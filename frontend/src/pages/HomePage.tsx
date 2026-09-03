import {
  type CheckPriceOverride,
  type CheckPriceRequirement,
  type DiningTableRecord,
  type DrawerSession,
  type StackCheck,
  type StackOrder,
  type StackParty,
  type StackSnapshot,
  type UserRoleCode,
} from "@lazy-janes/shared";
import {
  type DragEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  CheckPricingRequiredError,
  createCheck,
  presentCheck,
  takePayment,
} from "../api/billing";
import {
  cancelParty,
  createDiningRoomSection,
  createDiningTable,
  createParty,
  getDiningTables,
  getManagedDiningRoomSections,
  getManagedDiningTables,
  seatParty,
  unseatParty,
  updateDiningTable,
} from "../api/parties";
import {
  cancelOrder,
  deliverOrderItems,
  fireOrder,
  markOrderItemsReady,
  voidOrderItems,
} from "../api/orders";
import {
  closeDrawer,
  getCurrentDrawer,
  openDrawer,
} from "../api/register";
import { getStackSnapshot } from "../api/stack";
import { useAuth } from "../hooks/useAuth";

const PARTY_ROLES: readonly UserRoleCode[] = [
  "host",
  "server",
  "lead_server",
  "manager",
  "admin",
];

const SERVICE_ROLES: readonly UserRoleCode[] = [
  "server",
  "lead_server",
  "manager",
  "admin",
];

const KITCHEN_ROLES: readonly UserRoleCode[] = [
  "chef",
  "head_chef",
  "manager",
  "admin",
];

const MANAGER_ROLES: readonly UserRoleCode[] = [
  "manager",
  "admin",
];

const CORRECTION_ROLES: readonly UserRoleCode[] = [
  "lead_server",
  "manager",
  "admin",
];

function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

function elapsed(iso: string): string {
  const milliseconds = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(0, Math.floor(milliseconds / 60_000));

  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`;
}

function clockTime(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function partyLabel(party: StackParty): string {
  const tableLabel = party.tables.length > 0
    ? party.tables.map((table) => `Table ${table.label}`).join(" + ")
    : null;

  if (party.name && tableLabel) return `${party.name} · ${tableLabel}`;
  if (party.name) return party.name;
  if (tableLabel) return tableLabel;
  return `Party of ${party.guestCount}`;
}

function orderLabel(order: StackOrder, context?: string): string {
  if (context) return context;
  if (order.fulfillmentType === "takeout") {
    return order.customerName?.trim() || "Takeout";
  }
  if (order.fulfillmentType === "delivery") {
    return order.customerName?.trim() || "Delivery";
  }
  return "Dine In";
}

function orderTypeLabel(order: StackOrder): string {
  if (order.fulfillmentType === "dine_in") return "Dine in";
  if (order.fulfillmentType === "takeout") return "Takeout";
  return "Delivery";
}

function statusLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function localCardReference(checkId: string): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  const stamp = `${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const checkCode = checkId.replace(/-/g, "").slice(0, 4).toUpperCase();
  const randomCode = crypto.randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase();
  return `LJ-${stamp}-${checkCode}-${randomCode}`;
}

type OperationalOrder = {
  order: StackOrder;
  partyId: string | null;
  context: string;
};

type PaymentDraft = {
  method: "cash" | "card";
  tip: string;
  cashReceived: string;
  processorReference: string;
};

const EMPTY_PAYMENT: PaymentDraft = {
  method: "card",
  tip: "0",
  cashReceived: "",
  processorReference: "",
};

type CheckPricingDraft = {
  partyId: string;
  requirements: CheckPriceRequirement[];
  values: Record<string, string>;
};

function checkPricingKey(
  requirement: CheckPriceRequirement,
): string {
  return `${requirement.source}:${requirement.recordId}`;
}

function nextTableLabelForSection(
  sectionId: string,
  tables: DiningTableRecord[],
) {
  if (!sectionId) return "";

  const usedNumbers = tables
    .filter((table) => table.sectionId === sectionId)
    .map((table) => {
      const match = table.label.trim().match(/(\d+)$/);
      return match ? Number(match[1]) : Number.NaN;
    })
    .filter((value) => Number.isInteger(value) && value > 0);

  return String((usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0) + 1);
}

const FLOOR_GRID_STEP = 5;
const FLOOR_TABLE_WIDTH_PX = 86;
const FLOOR_TABLE_HEIGHT_PX = 62;
const FLOOR_TABLE_GAP_PX = 10;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function snapToFloorGrid(value: number): number {
  return Math.round(value / FLOOR_GRID_STEP) * FLOOR_GRID_STEP;
}

function nearestOpenFloorPosition({
  rawX,
  rawY,
  bounds,
  sectionId,
  tableId,
  tables,
}: {
  rawX: number;
  rawY: number;
  bounds: DOMRect;
  sectionId: string;
  tableId: string;
  tables: DiningTableRecord[];
}): { floorX: number; floorY: number } | null {
  const marginX = Math.ceil(
    (((FLOOR_TABLE_WIDTH_PX / 2) + FLOOR_TABLE_GAP_PX) / bounds.width * 100) /
      FLOOR_GRID_STEP,
  ) * FLOOR_GRID_STEP;
  const marginY = Math.ceil(
    (((FLOOR_TABLE_HEIGHT_PX / 2) + FLOOR_TABLE_GAP_PX) / bounds.height * 100) /
      FLOOR_GRID_STEP,
  ) * FLOOR_GRID_STEP;

  const minX = clamp(marginX, FLOOR_GRID_STEP, 50);
  const maxX = 100 - minX;
  const minY = clamp(marginY, FLOOR_GRID_STEP, 50);
  const maxY = 100 - minY;

  const baseX = clamp(snapToFloorGrid(rawX), minX, maxX);
  const baseY = clamp(snapToFloorGrid(rawY), minY, maxY);

  const xClearance = ((FLOOR_TABLE_WIDTH_PX + FLOOR_TABLE_GAP_PX) / bounds.width) * 100;
  const yClearance = ((FLOOR_TABLE_HEIGHT_PX + FLOOR_TABLE_GAP_PX) / bounds.height) * 100;

  const collides = (floorX: number, floorY: number) =>
    tables.some(
      (table) =>
        table.id !== tableId &&
        table.isActive &&
        table.sectionId === sectionId &&
        Math.abs(table.floorX - floorX) < xClearance &&
        Math.abs(table.floorY - floorY) < yClearance,
    );

  const candidates: Array<{ floorX: number; floorY: number; distance: number }> = [];
  const maxRadius = Math.ceil(100 / FLOOR_GRID_STEP);

  for (let radius = 0; radius <= maxRadius; radius += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;

        const floorX = baseX + dx * FLOOR_GRID_STEP;
        const floorY = baseY + dy * FLOOR_GRID_STEP;

        if (floorX < minX || floorX > maxX || floorY < minY || floorY > maxY) {
          continue;
        }

        candidates.push({
          floorX,
          floorY,
          distance: (floorX - rawX) ** 2 + (floorY - rawY) ** 2,
        });
      }
    }

    const open = candidates
      .filter((candidate) => !collides(candidate.floorX, candidate.floorY))
      .sort((a, b) => a.distance - b.distance)[0];

    if (open) return { floorX: open.floorX, floorY: open.floorY };
  }

  return null;
}

export function HomePage() {
  const { user } = useAuth();
  const [snapshot, setSnapshot] = useState<StackSnapshot | null>(null);
  const [tables, setTables] = useState<Awaited<ReturnType<typeof getDiningTables>>>([]);
  const [managedTables, setManagedTables] = useState<DiningTableRecord[]>([]);
  const [managedSections, setManagedSections] = useState<Awaited<ReturnType<typeof getManagedDiningRoomSections>>>([]);
  const [drawer, setDrawer] = useState<DrawerSession | null>(null);
  const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null);
  const [operationsDisplay, setOperationsDisplay] =
    useState<"service" | "full">("service");
  const [selectedCheckId, setSelectedCheckId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [newPartyName, setNewPartyName] = useState("");
  const [newPartyGuests, setNewPartyGuests] = useState("2");
  const [seatingPartyId, setSeatingPartyId] = useState<string | null>(null);
  const [selectedFloorTableIds, setSelectedFloorTableIds] = useState<string[]>([]);
  const [arrangeFloor, setArrangeFloor] = useState(false);
  const [draggingTableId, setDraggingTableId] = useState<string | null>(null);
  const [newTableSectionId, setNewTableSectionId] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [newTableLabel, setNewTableLabel] = useState("");
  const [newTableCapacity, setNewTableCapacity] = useState("4");
  const [openingCash, setOpeningCash] = useState("200");
  const [closingCash, setClosingCash] = useState("");
  const [paymentByCheck, setPaymentByCheck] = useState<Record<string, PaymentDraft>>({});
  const [checkPricing, setCheckPricing] =
    useState<CheckPricingDraft | null>(null);

  const roleSet = useMemo(() => new Set(user?.roles ?? []), [user]);
  const can = useCallback(
    (roles: readonly UserRoleCode[]) => roles.some((role) => roleSet.has(role)),
    [roleSet],
  );

  const canManageParties = can(PARTY_ROLES);
  const canServe = can(SERVICE_ROLES);
  const canKitchen = can(KITCHEN_ROLES);
  const canManage = can(MANAGER_ROLES);
  const canCorrect = can(CORRECTION_ROLES);
  const canViewDrawer = canServe;

  const loadOperations = useCallback(
    async (showSpinner = false) => {
      if (showSpinner) setRefreshing(true);

      try {
        const [
          nextSnapshot,
          nextTables,
          nextManagedTables,
          nextManagedSections,
          nextDrawer,
        ] = await Promise.all([
          getStackSnapshot(),
          canManageParties ? getDiningTables() : Promise.resolve([]),
          canManage ? getManagedDiningTables() : Promise.resolve([]),
          canManage ? getManagedDiningRoomSections() : Promise.resolve([]),
          canViewDrawer ? getCurrentDrawer() : Promise.resolve(null),
        ]);

        setSnapshot(nextSnapshot);
        setTables(nextTables);
        setManagedTables(nextManagedTables);
        setManagedSections(nextManagedSections);
        setDrawer(nextDrawer);
        setError(null);
      } catch (loadError: unknown) {
        setError(errorMessage(loadError));
      } finally {
        setLoading(false);
        if (showSpinner) setRefreshing(false);
      }
    },
    [canManage, canManageParties, canViewDrawer],
  );

  useEffect(() => {
    void loadOperations();

    const interval = window.setInterval(() => {
      void loadOperations();
    }, 10_000);

    return () => window.clearInterval(interval);
  }, [loadOperations]);

  useEffect(() => {
    if (!canManage) return;

    if (managedSections.length === 0) {
      if (newTableSectionId) setNewTableSectionId("");
      if (newTableLabel) setNewTableLabel("");
      return;
    }

    const selectedRoomStillExists = managedSections.some(
      (section) => section.id === newTableSectionId,
    );

    if (!selectedRoomStillExists) {
      const firstRoom = managedSections[0];
      if (!firstRoom) return;
      setNewTableSectionId(firstRoom.id);
      setNewTableLabel(
        nextTableLabelForSection(firstRoom.id, managedTables),
      );
    }
  }, [
    canManage,
    managedSections,
    managedTables,
    newTableSectionId,
    newTableLabel,
  ]);

  const activeParties = useMemo(
    () =>
      (snapshot?.parties ?? []).filter(
        (party) => party.status !== "completed" && party.status !== "cancelled",
      ),
    [snapshot],
  );

  const completedParties = useMemo(
    () =>
      (snapshot?.parties ?? []).filter((party) => party.status === "completed"),
    [snapshot],
  );

  const waitingParties = activeParties.filter((party) => party.status === "waiting");
  const seatedParties = activeParties.filter(
    (party) => party.status === "seated" || party.status === "in_service",
  );

  const operationalOrders = useMemo<OperationalOrder[]>(() => {
    const partyOrders = activeParties.flatMap((party) =>
      party.orders.map((order) => ({
        order,
        partyId: party.id,
        context: partyLabel(party),
      })),
    );

    const standalone = (snapshot?.standaloneOrders ?? []).map((order) => ({
      order,
      partyId: null,
      context: orderLabel(order),
    }));

    return [...partyOrders, ...standalone]
      .filter(({ order }) => order.cancelledAt === null)
      .sort(
        (a, b) =>
          new Date(a.order.submittedAt).getTime() -
          new Date(b.order.submittedAt).getTime(),
      );
  }, [activeParties, snapshot]);

  const activeKitchenOrders = operationalOrders.filter(({ order }) =>
    order.items.some(
      (item) => item.status !== "fulfilled" && item.status !== "voided",
    ),
  );

  const standaloneCheckoutOrders = operationalOrders.filter(
    (entry) =>
      entry.partyId === null &&
      entry.order.items.some(
        (item) =>
          item.status !== "voided" &&
          item.remainingQuantity > 0,
      ),
  );

  const readyItemCount = operationalOrders.reduce(
    (count, { order }) =>
      count + order.items.filter((item) => item.status === "ready").length,
    0,
  );

  const allChecks = useMemo(
    () => [
      ...activeParties.flatMap((party) => party.checks),
      ...(snapshot?.standaloneChecks ?? []),
    ],
    [activeParties, snapshot],
  );

  const openBalance = allChecks.reduce(
    (total, check) => total + (check.status === "closed" ? 0 : check.balanceAmount),
    0,
  );

  const floorSections = useMemo(() => {
    const sections: Array<{
      sectionId: string;
      sectionName: string;
      tables: typeof tables;
    }> = [];

    for (const table of tables) {
      let section = sections.find((candidate) => candidate.sectionId === table.sectionId);
      if (!section) {
        section = {
          sectionId: table.sectionId,
          sectionName: table.sectionName,
          tables: [],
        };
        sections.push(section);
      }
      section.tables.push(table);
    }

    return sections;
  }, [tables]);

  const partyByTableId = useMemo(() => {
    const byTable = new Map<string, StackParty>();
    for (const party of activeParties) {
      for (const table of party.tables) byTable.set(table.id, party);
    }
    return byTable;
  }, [activeParties]);

  const seatingParty = seatingPartyId
    ? waitingParties.find((party) => party.id === seatingPartyId) ?? null
    : null;

  const selectedFloorTables = tables.filter((table) =>
    selectedFloorTableIds.includes(table.id),
  );
  const selectedFloorCapacity = selectedFloorTables.reduce(
    (total, table) => total + table.capacity,
    0,
  );

  async function runAction(
    key: string,
    action: () => Promise<unknown>,
    successMessage: string,
  ) {
    setBusyKey(key);
    setError(null);
    setNotice(null);

    try {
      await action();
      setNotice(successMessage);
      await loadOperations();
      return true;
    } catch (actionError: unknown) {
      setError(errorMessage(actionError));
      return false;
    } finally {
      setBusyKey(null);
    }
  }

  async function submitNewRoom(event: FormEvent) {
    event.preventDefault();
    const name = newRoomName.trim();

    if (!name) {
      setError("Enter a room name.");
      return;
    }

    setBusyKey("new-room");
    setError(null);
    setNotice(null);

    try {
      const room = await createDiningRoomSection({ name });
      setNewRoomName("");
      setNewTableSectionId(room.id);
      setNewTableLabel("1");
      setNotice(`${room.name} added.`);
      await loadOperations();
    } catch (roomError: unknown) {
      setError(errorMessage(roomError));
    } finally {
      setBusyKey(null);
    }
  }

  async function submitNewTable(event: FormEvent) {
    event.preventDefault();
    const sectionId = newTableSectionId;
    const room = managedSections.find((section) => section.id === sectionId);
    const label = newTableLabel.trim();
    const capacity = Number(newTableCapacity);

    if (!room || !label || !Number.isInteger(capacity) || capacity < 1) {
      setError("Choose a room and enter table number and seat count.");
      return;
    }

    const created = await runAction(
      "new-table",
      () => createDiningTable({ sectionId, label, capacity }),
      `${room.name} · Table ${label} added.`,
    );

    if (created) {
      const numericLabel = Number(label);
      setNewTableLabel(
        Number.isInteger(numericLabel) && numericLabel > 0
          ? String(numericLabel + 1)
          : nextTableLabelForSection(sectionId, managedTables),
      );
    }
  }

  async function toggleDiningTable(table: DiningTableRecord) {
    await runAction(
      `table-${table.id}`,
      () => updateDiningTable(table.id, { isActive: !table.isActive }),
      `Table ${table.label} ${table.isActive ? "deactivated" : "activated"}.`,
    );
  }

  async function submitNewParty(event: FormEvent) {
    event.preventDefault();
    const guestCount = Number(newPartyGuests);
    const name = newPartyName.trim();

    if (!name) {
      setError("Party name is required.");
      return;
    }

    if (!Number.isInteger(guestCount) || guestCount < 1) {
      setError("Guest count must be at least 1.");
      return;
    }

    const created = await runAction(
      "new-party",
      () => createParty({
        name,
        guestCount,
      }),
      `${name} added to the wait.`,
    );

    if (created) setNewPartyName("");
  }

  function beginFloorSeating(party: StackParty) {
    setSeatingPartyId(party.id);
    setSelectedFloorTableIds([]);
    setArrangeFloor(false);
    setError(null);
    setNotice(`Choose table${tables.length === 1 ? "" : "s"} on the floor for ${party.name ?? `${party.guestCount} guests`}.`);
  }

  function toggleFloorTable(tableId: string) {
    if (!seatingParty) return;
    const table = tables.find((candidate) => candidate.id === tableId);
    if (!table || table.occupied) return;

    setSelectedFloorTableIds((current) =>
      current.includes(tableId)
        ? current.filter((id) => id !== tableId)
        : [...current, tableId],
    );
  }

  function cancelFloorSeating() {
    setSeatingPartyId(null);
    setSelectedFloorTableIds([]);
    setNotice(null);
  }

  async function confirmFloorSeating() {
    if (!seatingParty) return;
    if (selectedFloorTableIds.length === 0) {
      setError("Choose at least one available table on the floor.");
      return;
    }

    const seated = await runAction(
      `seat-${seatingParty.id}`,
      () => seatParty(seatingParty.id, { tableIds: selectedFloorTableIds }),
      seatingParty.name ? `${seatingParty.name} seated.` : `${seatingParty.guestCount}-top seated.`,
    );

    if (seated) {
      setSeatingPartyId(null);
      setSelectedFloorTableIds([]);
    }
  }

  async function dropTableOnFloor(
    sectionId: string,
    event: DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();
    const tableId = draggingTableId;
    setDraggingTableId(null);
    if (!tableId || !canManage || !arrangeFloor) return;

    const table = managedTables.find((candidate) => candidate.id === tableId);
    if (!table) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const rawX = ((event.clientX - bounds.left) / bounds.width) * 100;
    const rawY = ((event.clientY - bounds.top) / bounds.height) * 100;
    const position = nearestOpenFloorPosition({
      rawX,
      rawY,
      bounds,
      sectionId,
      tableId: table.id,
      tables: managedTables,
    });

    if (!position) {
      setError("No open grid position is available there.");
      return;
    }

    await runAction(
      `move-table-${table.id}`,
      () => updateDiningTable(table.id, { sectionId, ...position }),
      `Table ${table.label} snapped into place.`,
    );
  }

  async function unseatActiveParty(party: StackParty) {
    const reason = window.prompt("Reason for unseating this party?")?.trim();
    if (!reason) return;

    const unseated = await runAction(
      `unseat-party-${party.id}`,
      () => unseatParty(party.id, { reason }),
      "Party returned to waiting. Table released.",
    );
    if (unseated) setSelectedPartyId(null);
  }

  async function cancelWaitingParty(party: StackParty) {
    const reason = window.prompt("Reason for cancelling this party?")?.trim();
    if (!reason) return;

    const cancelled = await runAction(
      `cancel-party-${party.id}`,
      () => cancelParty(party.id, { reason }),
      "Party cancelled.",
    );
    if (cancelled) setSelectedPartyId(null);
  }

  async function cancelActiveOrder(entry: OperationalOrder) {
    const reason = window.prompt("Reason for cancelling this order?")?.trim();
    if (!reason) return;

    await runAction(
      `cancel-order-${entry.order.id}`,
      () => cancelOrder(entry.order.id, { reason }),
      "Order cancelled.",
    );
  }

  async function voidActiveItem(
    entry: OperationalOrder,
    orderItemId: string,
    itemName: string,
  ) {
    const reason = window.prompt(`Reason for voiding ${itemName}?`)?.trim();
    if (!reason) return;

    await runAction(
      `void-item-${orderItemId}`,
      () =>
        voidOrderItems(entry.order.id, {
          orderItemIds: [orderItemId],
          reason,
        }),
      `${itemName} voided.`,
    );
  }

  async function createPartyCheck(party: StackParty) {
    const items = party.orders
      .filter((order) => order.cancelledAt === null)
      .flatMap((order) => order.items)
      .filter(
        (item) =>
          item.status !== "voided" &&
          item.remainingQuantity > 0,
      )
      .map((item) => ({
        orderItemId: item.id,
        allocatedQuantity: item.remainingQuantity,
      }));

    if (items.length === 0) {
      setError("There is nothing left to put on a check.");
      return;
    }

    const activePricing =
      checkPricing?.partyId === party.id
        ? checkPricing
        : null;

    const priceOverrides: CheckPriceOverride[] = [];

    if (activePricing) {
      for (const requirement of activePricing.requirements) {
        const raw =
          activePricing.values[
            checkPricingKey(requirement)
          ]?.trim() ?? "";

        if (raw === "") {
          setError(
            `Enter a price or choose Free for ${requirement.label}.`,
          );
          return;
        }

        if (!/^\d+(?:\.\d{1,2})?$/.test(raw)) {
          setError(
            `Enter a valid dollar amount for ${requirement.label}.`,
          );
          return;
        }

        priceOverrides.push({
          source: requirement.source,
          recordId: requirement.recordId,
          amount: Number(raw),
        });
      }
    }

    setBusyKey(`check-party-${party.id}`);
    setError(null);
    setNotice(null);

    try {
      await createCheck({
        partyId: party.id,
        label: partyLabel(party),
        items,
        priceOverrides,
      });

      setCheckPricing(null);
      setNotice("Check created.");
      await loadOperations();
    } catch (checkError: unknown) {
      if (
        checkError instanceof CheckPricingRequiredError
      ) {
        setSelectedPartyId(party.id);

        setCheckPricing((current) => ({
          partyId: party.id,
          requirements: checkError.requirements,
          values: Object.fromEntries(
            checkError.requirements.map(
              (requirement) => {
                const key =
                  checkPricingKey(requirement);

                return [
                  key,
                  current?.partyId === party.id
                    ? current.values[key] ?? ""
                    : "",
                ];
              },
            ),
          ),
        }));

        setError(null);
        return;
      }

      setError(errorMessage(checkError));
    } finally {
      setBusyKey(null);
    }
  }

  async function createStandaloneCheck(entry: OperationalOrder) {
    const items = entry.order.items
      .filter((item) => item.status !== "voided" && item.remainingQuantity > 0)
      .map((item) => ({
        orderItemId: item.id,
        allocatedQuantity: item.remainingQuantity,
      }));

    if (items.length === 0) {
      setError("There is nothing left to put on a check.");
      return;
    }

    await runAction(
      `check-order-${entry.order.id}`,
      () =>
        createCheck({
          partyId: null,
          label: entry.context,
          items,
        }),
      "Check created.",
    );
  }

  async function payCheck(check: StackCheck) {
    const draft = paymentByCheck[check.id] ?? EMPTY_PAYMENT;
    const tipAmount = Number(draft.tip || 0);

    if (!Number.isFinite(tipAmount) || tipAmount < 0) {
      setError("Tip must be a valid amount.");
      return;
    }

    if (draft.method === "cash") {
      const cashReceivedAmount = Number(draft.cashReceived);
      if (!drawer) {
        setError("Open the cash drawer before taking cash.");
        return;
      }
      if (
        !Number.isFinite(cashReceivedAmount) ||
        cashReceivedAmount < check.balanceAmount + tipAmount
      ) {
        setError("Cash received must cover the balance and tip.");
        return;
      }

      setBusyKey(`pay-${check.id}`);
      setError(null);
      setNotice(null);

      try {
        const payment = await takePayment({
          method: "cash",
          allocations: [
            {
              checkId: check.id,
              allocatedAmount: check.balanceAmount,
            },
          ],
          tipAmount,
          cashReceivedAmount,
        });

        setNotice(
          payment.changeGivenAmount && payment.changeGivenAmount > 0
            ? `Cash payment recorded · Change ${money(payment.changeGivenAmount)}`
            : "Cash payment recorded.",
        );
        await loadOperations();
      } catch (paymentError: unknown) {
        setError(errorMessage(paymentError));
      } finally {
        setBusyKey(null);
      }
      return;
    }

    const processorReference =
      draft.processorReference.trim() || localCardReference(check.id);

    if (!draft.processorReference.trim()) {
      updatePaymentDraft(check.id, { processorReference });
    }

    await runAction(
      `pay-${check.id}`,
      () =>
        takePayment({
          method: "card",
          allocations: [
            {
              checkId: check.id,
              allocatedAmount: check.balanceAmount,
            },
          ],
          tipAmount,
          processorReference,
        }),
      "Card payment recorded.",
    );
  }

  async function closeCurrentDrawer(countedCashAmount: number) {
    setBusyKey("close-drawer");
    setError(null);
    setNotice(null);

    try {
      const closed = await closeDrawer({ countedCashAmount });
      const expected = closed.expectedCashAmount ?? countedCashAmount;
      const variance = closed.varianceAmount ?? countedCashAmount - expected;
      const varianceLabel = `${variance >= 0 ? "+" : "-"}${money(Math.abs(variance))}`;

      setNotice(
        `Drawer closed · Expected ${money(expected)} · Counted ${money(countedCashAmount)} · Variance ${varianceLabel}`,
      );
      setClosingCash("");
      await loadOperations();
    } catch (drawerError: unknown) {
      setError(errorMessage(drawerError));
    } finally {
      setBusyKey(null);
    }
  }

  function updatePaymentDraft(
    checkId: string,
    changes: Partial<PaymentDraft>,
  ) {
    setPaymentByCheck((current) => ({
      ...current,
      [checkId]: {
        ...(current[checkId] ?? EMPTY_PAYMENT),
        ...changes,
      },
    }));
  }

  const selectedParty =
    selectedPartyId
      ? activeParties.find((party) => party.id === selectedPartyId) ?? null
      : null;

  const openTableCount = tables.filter((table) => !table.occupied).length;
  const openChecks = allChecks.filter((check) => check.status !== "closed");
  const presentedChecks = openChecks.filter(
    (check) => check.status === "presented" && check.balanceAmount > 0,
  );
  const readyOrders = operationalOrders
    .map((entry) => ({
      ...entry,
      readyItems: entry.order.items.filter((item) => item.status === "ready"),
    }))
    .filter((entry) => entry.readyItems.length > 0);
  const selectedCheck = selectedCheckId
    ? openChecks.find((check) => check.id === selectedCheckId) ?? null
    : null;
  const attentionCount =
    waitingParties.length +
    readyOrders.length +
    standaloneCheckoutOrders.length +
    openChecks.length;

  if (loading) {
    return (
      <main className="page operations-live-page">
        <p className="loading-state">Loading operations…</p>
      </main>
    );
  }

  if (operationsDisplay === "service") {
    return (
      <main className="page operations-focus-page">
        <header className="operations-focus-heading">
          <div>
            <p className="eyebrow">Lazy Jane’s / Service Board</p>
            <h1>Operations</h1>
          </div>

          <div className="operations-focus-heading-actions">
            {snapshot ? <small>Updated {clockTime(snapshot.generatedAt)}</small> : null}
            <button
              type="button"
              className="button"
              data-variant="quiet"
              onClick={() => setOperationsDisplay("full")}
            >
              Full View
            </button>
            <button
              type="button"
              className="button"
              data-variant="quiet"
              disabled={refreshing}
              onClick={() => void loadOperations(true)}
            >
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
            {canServe ? (
              <Link className="button" data-variant="primary" to="/orders/new">
                New Order
              </Link>
            ) : null}
          </div>
        </header>

        {error ? <div className="notice notice--error">{error}</div> : null}
        {notice ? <div className="notice notice--success">{notice}</div> : null}

        <section className="operations-focus-metrics" aria-label="What needs attention">
          <div data-attention={waitingParties.length > 0}>
            <span>Waiting</span>
            <strong>{waitingParties.length}</strong>
          </div>
          <div data-attention={readyItemCount > 0}>
            <span>Ready now</span>
            <strong>{readyItemCount}</strong>
          </div>
          <div data-attention={openChecks.length > 0}>
            <span>Unpaid</span>
            <strong>{money(openBalance)}</strong>
          </div>
          <div>
            <span>Open tables</span>
            <strong>{openTableCount}</strong>
          </div>
        </section>

        <div className="operations-focus-layout">
          <section className="operations-focus-floor" aria-label="Dining room floor">
            <header className="operations-focus-section-heading">
              <div>
                <p className="eyebrow">Floor</p>
                <h2>Dining Room</h2>
              </div>
              <div>
                <span>{seatedParties.length} occupied</span>
                {canManage ? (
                  <button
                    type="button"
                    className="operations-text-button"
                    data-active={arrangeFloor}
                    onClick={() => {
                      setArrangeFloor((current) => !current);
                      setSeatingPartyId(null);
                      setSelectedFloorTableIds([]);
                    }}
                  >
                    {arrangeFloor ? "Done" : "Arrange"}
                  </button>
                ) : null}
              </div>
            </header>

            {seatingParty ? (
              <div className="operations-floor-seat-bar">
                <span>
                  <strong>{seatingParty.name ?? `${seatingParty.guestCount} guests`}</strong>
                  <small>
                    {selectedFloorTableIds.length || "No"} table{selectedFloorTableIds.length === 1 ? "" : "s"} selected · {selectedFloorCapacity} seats
                  </small>
                </span>
                <div>
                  <button type="button" className="operations-text-button" onClick={cancelFloorSeating}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="button"
                    data-variant="primary"
                    disabled={selectedFloorTableIds.length === 0 || busyKey === `seat-${seatingParty.id}`}
                    onClick={() => void confirmFloorSeating()}
                  >
                    Seat Party
                  </button>
                </div>
              </div>
            ) : null}

            <div className="operations-focus-rooms">
              {floorSections.length === 0 ? (
                <div className="operations-empty">No tables configured.</div>
              ) : floorSections.map((section) => (
                <section className="operations-focus-room" key={section.sectionId}>
                  <header>{section.sectionName}</header>
                  <div
                    className="operations-focus-room-canvas"
                    data-arrange={arrangeFloor}
                    onDragOver={(event) => {
                      if (arrangeFloor) event.preventDefault();
                    }}
                    onDrop={(event) => void dropTableOnFloor(section.sectionId, event)}
                  >
                    {section.tables.map((table) => {
                      const selected = selectedFloorTableIds.includes(table.id);
                      const occupyingParty = partyByTableId.get(table.id) ?? null;

                      return (
                        <button
                          type="button"
                          key={table.id}
                          className="operations-focus-table"
                          data-occupied={table.occupied}
                          data-selected={selected}
                          data-ready={Boolean(
                            occupyingParty?.orders.some((order) =>
                              order.items.some((item) => item.status === "ready"),
                            ),
                          )}
                          disabled={Boolean(seatingParty) && table.occupied}
                          draggable={canManage && arrangeFloor}
                          style={{ left: `${table.floorX}%`, top: `${table.floorY}%` }}
                          onDragStart={() => setDraggingTableId(table.id)}
                          onDragEnd={() => setDraggingTableId(null)}
                          onClick={() => {
                            if (arrangeFloor) return;
                            if (table.occupied && occupyingParty && !seatingParty) {
                              setSelectedPartyId(occupyingParty.id);
                              return;
                            }
                            toggleFloorTable(table.id);
                          }}
                          aria-label={`Table ${table.label}, ${table.capacity} seats${table.occupied ? ", occupied" : ", available"}`}
                        >
                          <strong>{table.label}</strong>
                          <span>
                            {table.occupied && occupyingParty?.name
                              ? occupyingParty.name
                              : `${table.capacity} seats`}
                          </span>
                          <small>
                            {table.occupied
                              ? occupyingParty
                                ? `${occupyingParty.guestCount} guests`
                                : "Occupied"
                              : selected
                                ? "Selected"
                                : "Open"}
                          </small>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <aside className="operations-focus-rail">
            {selectedParty ? (() => {
              const partyOpenChecks = selectedParty.checks.filter(
                (check) => check.status !== "closed",
              );
              const hasUncheckedItems = selectedParty.orders
                .filter((order) => order.cancelledAt === null)
                .flatMap((order) => order.items)
                .some((item) => item.status !== "voided" && item.remainingQuantity > 0);

              return (
                <section className="operations-focus-table-control">
                  <header className="operations-focus-section-heading">
                    <div>
                      <p className="eyebrow">Table</p>
                      <h2>{partyLabel(selectedParty)}</h2>
                      <span>{selectedParty.guestCount} guests · {statusLabel(selectedParty.status)}</span>
                    </div>
                    <button
                      type="button"
                      className="operations-text-button"
                      onClick={() => setSelectedPartyId(null)}
                    >
                      Close
                    </button>
                  </header>

                  <div className="operations-focus-table-items">
                    {selectedParty.orders
                      .filter((order) => order.cancelledAt === null)
                      .flatMap((order) => order.items)
                      .filter((item) => item.status !== "voided")
                      .map((item) => (
                        <div key={item.id}>
                          <span>{item.quantity > 1 ? `${item.quantity}× ` : ""}{item.itemName}</span>
                          <small>{statusLabel(item.status)}</small>
                        </div>
                      ))}
                  </div>

                  {checkPricing?.partyId === selectedParty.id ? (
                    <div className="operations-price-editor">
                      <strong>Price extras</strong>
                      <small>Enter the charge or mark it Free.</small>
                      {checkPricing.requirements.map((requirement) => {
                        const key = checkPricingKey(requirement);
                        return (
                          <label key={key}>
                            <span>{requirement.label}</span>
                            <div>
                              <span>$</span>
                              <input
                                inputMode="decimal"
                                placeholder="0.00"
                                value={checkPricing.values[key] ?? ""}
                                onChange={(event) =>
                                  setCheckPricing((current) =>
                                    current && current.partyId === selectedParty.id
                                      ? {
                                          ...current,
                                          values: {
                                            ...current.values,
                                            [key]: event.target.value,
                                          },
                                        }
                                      : current,
                                  )
                                }
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setCheckPricing((current) =>
                                    current && current.partyId === selectedParty.id
                                      ? {
                                          ...current,
                                          values: { ...current.values, [key]: "0" },
                                        }
                                      : current,
                                  )
                                }
                              >
                                Free
                              </button>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  ) : null}

                  <div className="operations-focus-table-checks">
                    {partyOpenChecks.length === 0 ? (
                      <span>No open check</span>
                    ) : partyOpenChecks.map((check) => (
                      <button
                        type="button"
                        key={check.id}
                        className="operations-focus-check-row"
                        onClick={() => setSelectedCheckId(check.id)}
                      >
                        <span>{statusLabel(check.status)}</span>
                        <strong>{money(check.balanceAmount)}</strong>
                      </button>
                    ))}
                  </div>

                  <footer className="operations-focus-table-actions">
                    {canServe ? (
                      <Link className="button" data-variant="primary" to={`/orders/new?partyId=${selectedParty.id}`}>
                        Add Order
                      </Link>
                    ) : null}
                    {canServe && hasUncheckedItems ? (
                      <button
                        type="button"
                        className="button"
                        disabled={busyKey === `check-party-${selectedParty.id}`}
                        onClick={() => void createPartyCheck(selectedParty)}
                      >
                        {checkPricing?.partyId === selectedParty.id
                          ? "Save Prices & Create Check"
                          : partyOpenChecks.length > 0
                            ? "Add to Check"
                            : "Create Check"}
                      </button>
                    ) : null}
                    {selectedParty.status === "seated" && canManageParties ? (
                      <button
                        type="button"
                        className="button"
                        disabled={busyKey === `unseat-party-${selectedParty.id}`}
                        onClick={() => void unseatActiveParty(selectedParty)}
                      >
                        Unseat
                      </button>
                    ) : null}
                  </footer>
                </section>
              );
            })() : selectedCheck ? (() => {
              const draft = paymentByCheck[selectedCheck.id] ?? EMPTY_PAYMENT;
              return (
                <section className="operations-focus-payment">
                  <header className="operations-focus-section-heading">
                    <div>
                      <p className="eyebrow">Checkout</p>
                      <h2>{selectedCheck.label}</h2>
                      <span>{statusLabel(selectedCheck.status)} · {money(selectedCheck.balanceAmount)}</span>
                    </div>
                    <button type="button" className="operations-text-button" onClick={() => setSelectedCheckId(null)}>
                      Close
                    </button>
                  </header>

                  {selectedCheck.status === "open" ? (
                    <button
                      type="button"
                      className="button"
                      data-variant="primary"
                      disabled={busyKey === `present-${selectedCheck.id}`}
                      onClick={() =>
                        void runAction(
                          `present-${selectedCheck.id}`,
                          () => presentCheck(selectedCheck.id),
                          "Check presented.",
                        )
                      }
                    >
                      Present Check
                    </button>
                  ) : null}

                  {selectedCheck.status === "presented" && selectedCheck.balanceAmount > 0 ? (
                    <div className="operations-focus-pay-form">
                      <div className="operations-payment-methods">
                        <button
                          type="button"
                          data-selected={draft.method === "card"}
                          onClick={() => updatePaymentDraft(selectedCheck.id, { method: "card" })}
                        >
                          Card
                        </button>
                        <button
                          type="button"
                          data-selected={draft.method === "cash"}
                          onClick={() => updatePaymentDraft(selectedCheck.id, { method: "cash" })}
                        >
                          Cash
                        </button>
                      </div>

                      <label>
                        <span>Tip</span>
                        <input
                          inputMode="decimal"
                          value={draft.tip}
                          onChange={(event) => updatePaymentDraft(selectedCheck.id, { tip: event.target.value })}
                        />
                      </label>

                      {draft.method === "card" ? (
                        <label>
                          <span>Transaction ID</span>
                          <input
                            value={draft.processorReference}
                            placeholder="Generated automatically"
                            onChange={(event) =>
                              updatePaymentDraft(selectedCheck.id, {
                                processorReference: event.target.value,
                              })
                            }
                          />
                        </label>
                      ) : (
                        <label>
                          <span>Cash received</span>
                          <input
                            inputMode="decimal"
                            value={draft.cashReceived}
                            placeholder={money(selectedCheck.balanceAmount + Number(draft.tip || 0))}
                            onChange={(event) =>
                              updatePaymentDraft(selectedCheck.id, { cashReceived: event.target.value })
                            }
                          />
                        </label>
                      )}

                      <button
                        type="button"
                        className="button"
                        data-variant="primary"
                        disabled={busyKey === `pay-${selectedCheck.id}`}
                        onClick={() => void payCheck(selectedCheck)}
                      >
                        Pay {money(selectedCheck.balanceAmount)}
                      </button>
                    </div>
                  ) : null}
                </section>
              );
            })() : (
              <section className="operations-focus-attention">
                <header className="operations-focus-section-heading">
                  <div>
                    <p className="eyebrow">Now</p>
                    <h2>Needs Attention</h2>
                  </div>
                  <span>{attentionCount}</span>
                </header>

                {canManageParties ? (
                  <form className="operations-focus-new-party" onSubmit={(event) => void submitNewParty(event)}>
                    <input
                      aria-label="Party name"
                      type="text"
                      maxLength={80}
                      placeholder="Party name"
                      required
                      value={newPartyName}
                      onChange={(event) => setNewPartyName(event.target.value)}
                    />
                    <input
                      aria-label="Guests"
                      type="number"
                      min="1"
                      max="99"
                      value={newPartyGuests}
                      onChange={(event) => setNewPartyGuests(event.target.value)}
                    />
                    <button
                      type="submit"
                      className="button"
                      data-variant="primary"
                      disabled={busyKey === "new-party"}
                    >
                      Add Wait
                    </button>
                  </form>
                ) : null}

                {readyOrders.length > 0 ? (
                  <section className="operations-focus-queue-section" data-kind="ready">
                    <header><strong>Ready to deliver</strong><span>{readyItemCount}</span></header>
                    {readyOrders.map((entry) => (
                      <article key={entry.order.id}>
                        <div>
                          <strong>{entry.context}</strong>
                          <small>{entry.readyItems.map((item) => item.itemName).join(" · ")}</small>
                        </div>
                        {canServe ? (
                          <button
                            type="button"
                            className="button"
                            data-variant="primary"
                            disabled={busyKey === `deliver-${entry.order.id}`}
                            onClick={() =>
                              void runAction(
                                `deliver-${entry.order.id}`,
                                () => deliverOrderItems(entry.order.id, {
                                  orderItemIds: entry.readyItems.map((item) => item.id),
                                }),
                                entry.order.fulfillmentType === "dine_in"
                                  ? "Items delivered."
                                  : "Order completed.",
                              )
                            }
                          >
                            {entry.order.fulfillmentType === "dine_in" ? "Deliver" : "Complete"}
                          </button>
                        ) : null}
                      </article>
                    ))}
                  </section>
                ) : null}

                {waitingParties.length > 0 ? (
                  <section className="operations-focus-queue-section">
                    <header><strong>Waiting to seat</strong><span>{waitingParties.length}</span></header>
                    {waitingParties.map((party) => (
                      <article key={party.id}>
                        <div>
                          <strong>{party.name ?? `${party.guestCount} guests`}</strong>
                          <small>{party.guestCount} guests · {elapsed(party.arrivedAt)}</small>
                        </div>
                        {canManageParties ? (
                          <button
                            type="button"
                            className="button"
                            disabled={busyKey === `seat-${party.id}`}
                            onClick={() => beginFloorSeating(party)}
                          >
                            Seat
                          </button>
                        ) : null}
                      </article>
                    ))}
                  </section>
                ) : null}

                {(standaloneCheckoutOrders.length > 0 || openChecks.length > 0) ? (
                  <section className="operations-focus-queue-section">
                    <header>
                      <strong>Checkout</strong>
                      <span>{standaloneCheckoutOrders.length + openChecks.length}</span>
                    </header>

                    {standaloneCheckoutOrders.map((entry) => (
                      <article key={entry.order.id}>
                        <div>
                          <strong>{entry.context}</strong>
                          <small>{orderTypeLabel(entry.order)} · needs check</small>
                        </div>
                        <button
                          type="button"
                          className="button"
                          disabled={busyKey === `check-order-${entry.order.id}`}
                          onClick={() => void createStandaloneCheck(entry)}
                        >
                          Create Check
                        </button>
                      </article>
                    ))}

                    {openChecks.map((check) => (
                      <article key={check.id}>
                        <div>
                          <strong>{check.label}</strong>
                          <small>{statusLabel(check.status)} · {money(check.balanceAmount)}</small>
                        </div>
                        {check.status === "open" ? (
                          <button
                            type="button"
                            className="button"
                            disabled={busyKey === `present-${check.id}`}
                            onClick={() =>
                              void runAction(
                                `present-${check.id}`,
                                () => presentCheck(check.id),
                                "Check presented.",
                              )
                            }
                          >
                            Present
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="button"
                            data-variant="primary"
                            onClick={() => setSelectedCheckId(check.id)}
                          >
                            Pay
                          </button>
                        )}
                      </article>
                    ))}
                  </section>
                ) : null}

                {attentionCount === 0 ? (
                  <div className="operations-focus-clear">
                    <strong>All clear</strong>
                    <span>No service action needs attention right now.</span>
                  </div>
                ) : null}

                <footer className="operations-focus-utility">
                  <span>
                    Register <strong>{drawer ? "Open" : "Closed"}</strong>
                    {drawer ? ` · ${money(drawer.openingCashAmount)} start` : ""}
                  </span>
                  {canManage && !drawer ? (
                    <button
                      type="button"
                      className="operations-text-button"
                      onClick={() =>
                        void runAction(
                          "open-drawer",
                          () => openDrawer({ openingCashAmount: Number(openingCash) || 200 }),
                          "Drawer opened.",
                        )
                      }
                    >
                      Open Register
                    </button>
                  ) : null}
                </footer>
              </section>
            )}
          </aside>
        </div>
      </main>
    );
  }

  return (
    <main className="page operations-live-page">
      <header className="operations-live-heading">
        <div>
          <p className="eyebrow">Lazy Jane’s / Live Service</p>
          <h1>Operations</h1>
        </div>
        <div className="operations-heading-actions">
          <button
            type="button"
            className="button"
            data-variant="quiet"
            onClick={() => setOperationsDisplay("service")}
          >
            Service Board
          </button>
          {snapshot ? (
            <small>Updated {clockTime(snapshot.generatedAt)}</small>
          ) : null}
          <button
            type="button"
            className="button"
            data-variant="quiet"
            disabled={refreshing}
            onClick={() => void loadOperations(true)}
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          {canServe ? (
            <Link className="button" data-variant="primary" to="/orders/new">
              New Order
            </Link>
          ) : null}
        </div>
      </header>

      {error ? <div className="notice notice--error">{error}</div> : null}
      {notice ? <div className="notice notice--success">{notice}</div> : null}

      <section className="operations-metrics" aria-label="Current service summary">
        <div>
          <span>Waiting</span>
          <strong>{waitingParties.length}</strong>
        </div>
        <div>
          <span>On floor</span>
          <strong>{seatedParties.length}</strong>
        </div>
        <div data-attention={readyItemCount > 0}>
          <span>Ready</span>
          <strong>{readyItemCount}</strong>
        </div>
        <div>
          <span>Open balance</span>
          <strong>{money(openBalance)}</strong>
        </div>
        <div>
          <span>Completed today</span>
          <strong>{completedParties.length}</strong>
        </div>
      </section>

      <div
        className="operations-live-grid"
        data-sidebar={canServe || canManage}
        data-table-control={selectedParty ? "true" : "false"}
      >
        <div className="operations-main-column">
        <section className="operations-panel operations-floor-panel">
          <header className="operations-panel-heading">
            <div>
              <p className="eyebrow">Floor</p>
              <h2>Parties & Tables</h2>
            </div>
            <span>{activeParties.length} active</span>
          </header>

          {canManageParties ? (
            <form className="operations-new-party" onSubmit={(event) => void submitNewParty(event)}>
              <label className="operations-party-name-field">
                <span>Party name</span>
                <input
                  type="text"
                  maxLength={80}
                  placeholder="Smith"
                  required
                  value={newPartyName}
                  onChange={(event) => setNewPartyName(event.target.value)}
                />
              </label>
              <label className="operations-party-size-field">
                <span>Guests</span>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={newPartyGuests}
                  onChange={(event) => setNewPartyGuests(event.target.value)}
                />
              </label>
              <button
                type="submit"
                className="button"
                data-variant="primary"
                disabled={busyKey === "new-party"}
              >
                Add to Wait
              </button>
            </form>
          ) : null}

          {canManageParties ? (
            <section className="operations-floor-map-shell" aria-label="Dining room floor plan">
              <header className="operations-floor-map-toolbar">
                <div>
                  <strong>Dining Room Floor</strong>
                  <span>
                    {seatingParty
                      ? `Seating ${seatingParty.name ? `${seatingParty.name} · ` : ""}${seatingParty.guestCount} guests · choose one or more available tables`
                      : floorSections.length > 0
                        ? "Tables created in Floor Setup appear here automatically."
                        : "Create tables in Floor Setup to build the room."}
                  </span>
                </div>
                {canManage ? (
                  <button
                    type="button"
                    className="operations-text-button"
                    data-active={arrangeFloor}
                    onClick={() => {
                      setArrangeFloor((current) => !current);
                      setSeatingPartyId(null);
                      setSelectedFloorTableIds([]);
                    }}
                  >
                    {arrangeFloor ? "Done Arranging" : "Arrange Floor"}
                  </button>
                ) : null}
              </header>

              {seatingParty ? (
                <div className="operations-floor-seat-bar">
                  <span>
                    <strong>{selectedFloorTableIds.length || "No"} table{selectedFloorTableIds.length === 1 ? "" : "s"} selected</strong>
                    <small>{selectedFloorCapacity} seats selected for {seatingParty.guestCount} guests</small>
                  </span>
                  <div>
                    <button type="button" className="operations-text-button" onClick={cancelFloorSeating}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="button"
                      data-variant="primary"
                      disabled={selectedFloorTableIds.length === 0 || busyKey === `seat-${seatingParty.id}`}
                      onClick={() => void confirmFloorSeating()}
                    >
                      Seat Party
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="operations-floor-map-rooms">
                {floorSections.length === 0 ? (
                  <div className="operations-floor-map-empty">No tables configured.</div>
                ) : floorSections.map((section) => (
                  <div className="operations-floor-room" key={section.sectionName}>
                    <div className="operations-floor-room-name">{section.sectionName}</div>
                    <div
                      className="operations-floor-room-canvas"
                      data-arrange={arrangeFloor}
                      onDragOver={(event) => {
                        if (arrangeFloor) event.preventDefault();
                      }}
                      onDrop={(event) => void dropTableOnFloor(section.sectionId, event)}
                    >
                      {section.tables.map((table) => {
                        const selected = selectedFloorTableIds.includes(table.id);
                        const occupyingParty = partyByTableId.get(table.id) ?? null;
                        return (
                          <button
                            type="button"
                            key={table.id}
                            className="operations-floor-table"
                            data-occupied={table.occupied}
                            data-selected={selected}
                            data-selecting={Boolean(seatingParty)}
                            data-arranging={arrangeFloor}
                            disabled={Boolean(seatingParty) && table.occupied}
                            draggable={canManage && arrangeFloor}
                            style={{ left: `${table.floorX}%`, top: `${table.floorY}%` }}
                            onDragStart={() => setDraggingTableId(table.id)}
                            onDragEnd={() => setDraggingTableId(null)}
                            onClick={() => {
                              if (arrangeFloor) return;
                              if (table.occupied && occupyingParty && !seatingParty) {
                                setSelectedPartyId(occupyingParty.id);
                                return;
                              }
                              toggleFloorTable(table.id);
                            }}
                            aria-label={`Table ${table.label}, ${table.capacity} seats${table.occupied ? ", occupied" : ", available"}`}
                          >
                            <strong>{table.label}</strong>
                            <small>
                              {table.occupied && occupyingParty?.name
                                ? occupyingParty.name
                                : `${table.capacity} seats`}
                            </small>
                            <span>
                              {table.occupied
                                ? occupyingParty
                                  ? `${occupyingParty.guestCount} guests`
                                  : "Occupied"
                                : selected
                                  ? "Selected"
                                  : "Available"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {arrangeFloor ? (
                <p className="operations-floor-arrange-help">Drag tables to match the real dining room. Tables snap to the grid and cannot overlap. Positions are saved.</p>
              ) : null}
            </section>
          ) : null}

          <div className="operations-party-list">
            {!selectedParty ? (
              <header className="operations-waitlist-heading">
                <div>
                  <p className="eyebrow">Front Desk</p>
                  <strong>Waitlist</strong>
                </div>
                <span>{waitingParties.length}</span>
              </header>
            ) : null}
            {selectedParty ? (() => {
              const openChecks = selectedParty.checks.filter(
                (check) => check.status !== "closed",
              );
              const hasUncheckedItems = selectedParty.orders
                .filter((order) => order.cancelledAt === null)
                .flatMap((order) => order.items)
                .some(
                  (item) =>
                    item.status !== "voided" &&
                    item.remainingQuantity > 0,
                );

              return (
                <section className="operations-table-control">
                  <header>
                    <div>
                      <p className="eyebrow">Table Control</p>
                      <strong>{partyLabel(selectedParty)}</strong>
                      <small>
                        {selectedParty.guestCount} guests · {statusLabel(selectedParty.status)}
                      </small>
                    </div>
                    <button
                      type="button"
                      className="operations-text-button"
                      onClick={() => setSelectedPartyId(null)}
                    >
                      All Parties
                    </button>
                  </header>

                  <div className="operations-table-control-orders">
                    <span className="operations-status" data-status={selectedParty.status}>
                      {statusLabel(selectedParty.status)}
                    </span>

                    {selectedParty.orders.filter((order) => order.cancelledAt === null).length === 0 ? (
                      <p className="operations-table-control-empty">No active orders.</p>
                    ) : (
                      selectedParty.orders
                        .filter((order) => order.cancelledAt === null)
                        .map((order) => (
                          <article key={order.id}>
                            <small>{orderTypeLabel(order)} · {elapsed(order.submittedAt)}</small>
                            {order.items
                              .filter((item) => item.status !== "voided")
                              .map((item) => (
                                <div key={item.id}>
                                  <span>
                                    {item.quantity > 1 ? `${item.quantity}× ` : ""}
                                    {item.itemName}
                                  </span>
                                  <span className="operations-status" data-status={item.status}>
                                    {statusLabel(item.status)}
                                  </span>
                                </div>
                              ))}
                          </article>
                        ))
                    )}
                  </div>

                  {checkPricing?.partyId ===
                  selectedParty.id ? (
                    <div className="operations-price-editor">
                      <strong>Price extras</strong>
                      <small>
                        Enter the charge for this order,
                        or mark it Free.
                      </small>

                      {checkPricing.requirements.map(
                        (requirement) => {
                          const key =
                            checkPricingKey(requirement);

                          return (
                            <label key={key}>
                              <span>
                                {requirement.label}
                              </span>

                              <div>
                                <span>$</span>

                                <input
                                  inputMode="decimal"
                                  placeholder="0.00"
                                  value={
                                    checkPricing.values[
                                      key
                                    ] ?? ""
                                  }
                                  onChange={(event) =>
                                    setCheckPricing(
                                      (current) =>
                                        current &&
                                        current.partyId ===
                                          selectedParty.id
                                          ? {
                                              ...current,
                                              values: {
                                                ...current.values,
                                                [key]:
                                                  event
                                                    .target
                                                    .value,
                                              },
                                            }
                                          : current,
                                    )
                                  }
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    setCheckPricing(
                                      (current) =>
                                        current &&
                                        current.partyId ===
                                          selectedParty.id
                                          ? {
                                              ...current,
                                              values: {
                                                ...current.values,
                                                [key]: "0",
                                              },
                                            }
                                          : current,
                                    )
                                  }
                                >
                                  Free
                                </button>
                              </div>
                            </label>
                          );
                        },
                      )}
                    </div>
                  ) : null}

                  <div className="operations-table-control-checks">
                    <strong>Check</strong>

                    {openChecks.length === 0 ? (
                      <span>No check yet</span>
                    ) : (
                      openChecks.map((check) => (
                        <div key={check.id}>
                          <span>{statusLabel(check.status)}</span>
                          <strong>{money(check.balanceAmount)}</strong>

                          {check.status === "open" && canServe ? (
                            <button
                              type="button"
                              className="button"
                              disabled={busyKey === `present-${check.id}`}
                              onClick={() =>
                                void runAction(
                                  `present-${check.id}`,
                                  () => presentCheck(check.id),
                                  "Check presented.",
                                )
                              }
                            >
                              Present
                            </button>
                          ) : null}

                          {check.status === "presented" &&
                          check.balanceAmount > 0 &&
                          canServe ? (() => {
                            const draft =
                              paymentByCheck[check.id] ?? EMPTY_PAYMENT;

                            return (
                              <div className="operations-payment-form">
                                <div className="operations-payment-methods">
                                  <button
                                    type="button"
                                    data-selected={draft.method === "card"}
                                    onClick={() =>
                                      updatePaymentDraft(check.id, {
                                        method: "card",
                                      })
                                    }
                                  >
                                    Card
                                  </button>
                                  <button
                                    type="button"
                                    data-selected={draft.method === "cash"}
                                    onClick={() =>
                                      updatePaymentDraft(check.id, {
                                        method: "cash",
                                      })
                                    }
                                  >
                                    Cash
                                  </button>
                                </div>

                                <label>
                                  <span>Tip</span>
                                  <input
                                    inputMode="decimal"
                                    value={draft.tip}
                                    onChange={(event) =>
                                      updatePaymentDraft(check.id, {
                                        tip: event.target.value,
                                      })
                                    }
                                  />
                                </label>

                                {draft.method === "card" ? (
                                  <label>
                                    <span>Terminal ref</span>
                                    <input
                                      value={draft.processorReference}
                                      placeholder="Required"
                                      onChange={(event) =>
                                        updatePaymentDraft(check.id, {
                                          processorReference:
                                            event.target.value,
                                        })
                                      }
                                    />
                                  </label>
                                ) : (
                                  <label>
                                    <span>Cash received</span>
                                    <input
                                      inputMode="decimal"
                                      value={draft.cashReceived}
                                      placeholder={money(
                                        check.balanceAmount +
                                          Number(draft.tip || 0),
                                      )}
                                      onChange={(event) =>
                                        updatePaymentDraft(check.id, {
                                          cashReceived: event.target.value,
                                        })
                                      }
                                    />
                                  </label>
                                )}

                                <button
                                  type="button"
                                  className="button"
                                  data-variant="primary"
                                  disabled={busyKey === `pay-${check.id}`}
                                  onClick={() => void payCheck(check)}
                                >
                                  Pay {money(check.balanceAmount)}
                                </button>
                              </div>
                            );
                          })() : null}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="operations-table-control-actions">
                    {canServe ? (
                      <Link
                        className="button"
                        data-variant="primary"
                        to={`/orders/new?partyId=${selectedParty.id}`}
                      >
                        Add Order
                      </Link>
                    ) : null}

                    {canServe && hasUncheckedItems ? (
                      <button
                        type="button"
                        className="button"
                        disabled={busyKey === `check-party-${selectedParty.id}`}
                        onClick={() => void createPartyCheck(selectedParty)}
                      >
                        {checkPricing?.partyId === selectedParty.id
                          ? "Save Prices & Create Check"
                          : openChecks.length > 0
                            ? "Add to Check"
                            : "Create Check"}
                      </button>
                    ) : null}

                    {selectedParty.status === "seated" && canManageParties ? (
                      <button
                        type="button"
                        className="button"
                        disabled={busyKey === `unseat-party-${selectedParty.id}`}
                        onClick={() => void unseatActiveParty(selectedParty)}
                      >
                        Unseat
                      </button>
                    ) : null}

                    {canManageParties &&
                    selectedParty.orders.every((order) => order.cancelledAt !== null) ? (
                      <button
                        type="button"
                        className="button"
                        disabled={busyKey === `cancel-party-${selectedParty.id}`}
                        onClick={() => void cancelWaitingParty(selectedParty)}
                      >
                        Cancel Party
                      </button>
                    ) : null}
                  </div>
                </section>
              );
            })() : waitingParties.length === 0 ? (
              <div className="operations-empty">No parties waiting.</div>
            ) : (
              waitingParties.map((party) => {
                const activeItems = party.orders.flatMap((order) => order.items).filter(
                  (item) => item.status !== "fulfilled" && item.status !== "voided",
                );
                const ready = activeItems.filter((item) => item.status === "ready").length;
                const openChecks = party.checks.filter((check) => check.status !== "closed");
                const hasUncheckedItems = party.orders
                  .filter((order) => order.cancelledAt === null)
                  .flatMap((order) => order.items)
                  .some(
                    (item) =>
                      item.status !== "voided" &&
                      item.remainingQuantity > 0,
                  );

                return (
                  <article
                    className="operations-party"
                    data-status={party.status}
                    data-seating={seatingPartyId === party.id}
                    key={party.id}
                  >
                    <div className="operations-party-main">
                      <div>
                        <strong>{partyLabel(party)}</strong>
                        <small>
                          {party.guestCount} guests · {elapsed(party.arrivedAt)}
                        </small>
                      </div>
                      <span className="operations-status" data-status={party.status}>
                        {statusLabel(party.status)}
                      </span>
                    </div>

                    {ready > 0 ? (
                      <div className="operations-attention">{ready} item{ready === 1 ? "" : "s"} ready</div>
                    ) : null}

                    {party.status === "waiting" && canManageParties ? (
                      <div className="operations-party-actions">
                        <button
                          type="button"
                          className="button"
                          data-variant={seatingPartyId === party.id ? "primary" : undefined}
                          disabled={busyKey === `seat-${party.id}`}
                          onClick={() => beginFloorSeating(party)}
                        >
                          {seatingPartyId === party.id ? "Choosing Table…" : "Seat on Floor"}
                        </button>
                        <button
                          type="button"
                          className="operations-text-button"
                          onClick={() => void cancelWaitingParty(party)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : null}

                    {(party.status === "seated" || party.status === "in_service") ? (
                      <div className="operations-party-actions">
                        {party.status === "seated" && canManageParties ? (
                          <button
                            type="button"
                            className="button"
                            onClick={() => void unseatActiveParty(party)}
                          >
                            Unseat
                          </button>
                        ) : null}
                        {canServe ? (
                          <Link className="button" to={`/orders/new?partyId=${party.id}`}>
                            Add Order
                          </Link>
                        ) : null}
                        {canServe && hasUncheckedItems ? (
                          <button
                            type="button"
                            className="button"
                            disabled={busyKey === `check-party-${party.id}`}
                            onClick={() => void createPartyCheck(party)}
                          >
                            {openChecks.length > 0 ? "Add Unchecked Items" : "Create Check"}
                          </button>
                        ) : null}
                        {openChecks.length > 0 ? (
                          <span className="operations-balance">
                            {money(openChecks.reduce((sum, check) => sum + check.balanceAmount, 0))}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                );
              })
            )}
          </div>
        </section>

        <section className="operations-panel operations-kitchen-panel">
          <header className="operations-panel-heading">
            <div>
              <p className="eyebrow">Kitchen & Service</p>
              <h2>Active Orders</h2>
            </div>
            <span>{activeKitchenOrders.length} orders</span>
          </header>

          <div className="operations-order-list">
            {activeKitchenOrders.length === 0 ? (
              <div className="operations-empty">Nothing active in the kitchen.</div>
            ) : (
              activeKitchenOrders.map((entry) => {
                const submitted = entry.order.items.filter((item) => item.status === "submitted");
                const fired = entry.order.items.filter((item) => item.status === "fired");
                const ready = entry.order.items.filter((item) => item.status === "ready");
                const active = entry.order.items.filter(
                  (item) => item.status !== "fulfilled" && item.status !== "voided",
                );

                return (
                  <article className="operations-order" key={entry.order.id}>
                    <header>
                      <div>
                        <strong>{entry.context}</strong>
                        <small>
                          {orderTypeLabel(entry.order)} · {elapsed(entry.order.submittedAt)}
                        </small>
                      </div>
                      <span>{active.length} active</span>
                    </header>

                    <div className="operations-order-items">
                      {active.map((item) => (
                        <div data-status={item.status} key={item.id}>
                          <span>{item.quantity > 1 ? `${item.quantity}× ` : ""}{item.itemName}</span>
                          <span className="operations-order-item-meta">
                            <strong>{statusLabel(item.status)}</strong>
                            {canCorrect && item.allocatedQuantity === 0 ? (
                              <button
                                type="button"
                                disabled={busyKey === `void-item-${item.id}`}
                                onClick={() =>
                                  void voidActiveItem(entry, item.id, item.itemName)
                                }
                              >
                                Void
                              </button>
                            ) : null}
                          </span>
                        </div>
                      ))}
                    </div>

                    <footer>
                      {canServe && submitted.length > 0 ? (
                        <button
                          type="button"
                          className="button"
                          data-variant="primary"
                          disabled={busyKey === `fire-${entry.order.id}`}
                          onClick={() =>
                            void runAction(
                              `fire-${entry.order.id}`,
                              () =>
                                fireOrder(entry.order.id, {
                                  orderItemIds: submitted.map((item) => item.id),
                                  note: null,
                                }),
                              "Order fired to kitchen.",
                            )
                          }
                        >
                          Fire {submitted.length}
                        </button>
                      ) : null}

                      {canKitchen && fired.length > 0 ? (
                        <button
                          type="button"
                          className="button"
                          data-variant="primary"
                          disabled={busyKey === `ready-${entry.order.id}`}
                          onClick={() =>
                            void runAction(
                              `ready-${entry.order.id}`,
                              () =>
                                markOrderItemsReady(entry.order.id, {
                                  orderItemIds: fired.map((item) => item.id),
                                }),
                              "Items marked ready.",
                            )
                          }
                        >
                          Mark Ready · {fired.length}
                        </button>
                      ) : null}

                      {canServe && ready.length > 0 ? (
                        <button
                          type="button"
                          className="button"
                          data-variant="primary"
                          disabled={busyKey === `deliver-${entry.order.id}`}
                          onClick={() =>
                            void runAction(
                              `deliver-${entry.order.id}`,
                              () =>
                                deliverOrderItems(entry.order.id, {
                                  orderItemIds: ready.map((item) => item.id),
                                }),
                              entry.order.fulfillmentType === "dine_in"
                                ? "Items delivered."
                                : "Order completed.",
                            )
                          }
                        >
                          {entry.order.fulfillmentType === "dine_in" ? "Deliver" : "Complete"} · {ready.length}
                        </button>
                      ) : null}

                      {canCorrect ? (
                        <button
                          type="button"
                          className="operations-text-button"
                          disabled={busyKey === `cancel-order-${entry.order.id}`}
                          onClick={() => void cancelActiveOrder(entry)}
                        >
                          Cancel order
                        </button>
                      ) : null}
                    </footer>
                  </article>
                );
              })
            )}
          </div>
        </section>
        </div>

        <aside className="operations-sidebar">
          {canServe && (standaloneCheckoutOrders.length > 0 || allChecks.some((check) => check.status !== "closed")) ? (
            <section className="operations-panel operations-checkout-panel">
              <header className="operations-panel-heading">
                <div>
                  <p className="eyebrow">Checkout</p>
                  <h2>Checks</h2>
                </div>
                <span>{allChecks.filter((check) => check.status !== "closed").length} open</span>
              </header>

              {standaloneCheckoutOrders.length > 0 ? (
                <div className="operations-pending-checkout">
                  {standaloneCheckoutOrders.map((entry) => (
                    <div key={entry.order.id}>
                      <span>
                        <strong>{entry.context}</strong>
                        <small>{orderTypeLabel(entry.order)} · needs check</small>
                      </span>
                      <button
                        type="button"
                        className="button"
                        disabled={busyKey === `check-order-${entry.order.id}`}
                        onClick={() => void createStandaloneCheck(entry)}
                      >
                        Create Check
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="operations-check-list">
                {allChecks.filter((check) => check.status !== "closed").length === 0 ? (
                  <div className="operations-empty">No open checks.</div>
                ) : (
                  allChecks
                    .filter((check) => check.status !== "closed")
                    .map((check) => {
                      const draft = paymentByCheck[check.id] ?? EMPTY_PAYMENT;

                      return (
                        <article className="operations-check" key={check.id}>
                          <header>
                            <div>
                              <strong>{check.label}</strong>
                              <small>{statusLabel(check.status)}</small>
                            </div>
                            <strong>{money(check.balanceAmount)}</strong>
                          </header>

                          {check.status === "open" ? (
                            <button
                              type="button"
                              className="button"
                              data-variant="primary"
                              disabled={busyKey === `present-${check.id}`}
                              onClick={() =>
                                void runAction(
                                  `present-${check.id}`,
                                  () => presentCheck(check.id),
                                  "Check presented.",
                                )
                              }
                            >
                              Present Check
                            </button>
                          ) : null}

                          {check.status === "presented" && check.balanceAmount > 0 ? (
                            <div className="operations-payment-form">
                              <div className="operations-payment-methods">
                                <button
                                  type="button"
                                  data-selected={draft.method === "card"}
                                  onClick={() => updatePaymentDraft(check.id, { method: "card" })}
                                >
                                  Card
                                </button>
                                <button
                                  type="button"
                                  data-selected={draft.method === "cash"}
                                  onClick={() => updatePaymentDraft(check.id, { method: "cash" })}
                                >
                                  Cash
                                </button>
                              </div>

                              <label>
                                <span>Tip</span>
                                <input
                                  inputMode="decimal"
                                  value={draft.tip}
                                  onChange={(event) => updatePaymentDraft(check.id, { tip: event.target.value })}
                                />
                              </label>

                              {draft.method === "card" ? (
                                <label>
                                  <span>Terminal ref</span>
                                  <input
                                    value={draft.processorReference}
                                    placeholder="Required"
                                    onChange={(event) =>
                                      updatePaymentDraft(check.id, {
                                        processorReference: event.target.value,
                                      })
                                    }
                                  />
                                </label>
                              ) : (
                                <label>
                                  <span>Cash received</span>
                                  <input
                                    inputMode="decimal"
                                    value={draft.cashReceived}
                                    placeholder={money(check.balanceAmount + Number(draft.tip || 0))}
                                    onChange={(event) =>
                                      updatePaymentDraft(check.id, {
                                        cashReceived: event.target.value,
                                      })
                                    }
                                  />
                                </label>
                              )}

                              <button
                                type="button"
                                className="button"
                                data-variant="primary"
                                disabled={busyKey === `pay-${check.id}`}
                                onClick={() => void payCheck(check)}
                              >
                                Pay {money(check.balanceAmount)}
                              </button>
                            </div>
                          ) : null}
                        </article>
                      );
                    })
                )}
              </div>
            </section>
          ) : null}

          {canViewDrawer ? (
            <section className="operations-panel operations-register-panel">
              <header className="operations-panel-heading">
                <div>
                  <p className="eyebrow">Register</p>
                  <h2>Cash Drawer</h2>
                </div>
                <span data-open={drawer !== null}>{drawer ? "Open" : "Closed"}</span>
              </header>

              {drawer ? (
                <div className="operations-register-body">
                  <dl>
                    <div>
                      <dt>Opened</dt>
                      <dd>{clockTime(drawer.openedAt)}</dd>
                    </div>
                    <div>
                      <dt>Starting cash</dt>
                      <dd>{money(drawer.openingCashAmount)}</dd>
                    </div>
                  </dl>

                  {canManage ? (
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        const countedCashAmount = Number(closingCash);
                        if (!Number.isFinite(countedCashAmount) || countedCashAmount < 0) {
                          setError("Enter the counted closing cash.");
                          return;
                        }
                        void closeCurrentDrawer(countedCashAmount);
                      }}
                    >
                      <label>
                        <span>End-of-shift cash count</span>
                        <input
                          inputMode="decimal"
                          value={closingCash}
                          onChange={(event) => setClosingCash(event.target.value)}
                          placeholder="0.00"
                        />
                      </label>
                      <button
                        type="submit"
                        className="button"
                        disabled={busyKey === "close-drawer"}
                      >
                        Close Drawer
                      </button>
                    </form>
                  ) : null}
                </div>
              ) : canManage ? (
                <form
                  className="operations-register-body"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const openingCashAmount = Number(openingCash);
                    if (!Number.isFinite(openingCashAmount) || openingCashAmount < 0) {
                      setError("Enter the opening cash amount.");
                      return;
                    }
                    void runAction(
                      "open-drawer",
                      () => openDrawer({ openingCashAmount }),
                      "Drawer opened.",
                    );
                  }}
                >
                  <label>
                    <span>Starting cash count</span>
                    <input
                      inputMode="decimal"
                      value={openingCash}
                      onChange={(event) => setOpeningCash(event.target.value)}
                    />
                  </label>
                  <button
                    type="submit"
                    className="button"
                    data-variant="primary"
                    disabled={busyKey === "open-drawer"}
                  >
                    Open Drawer
                  </button>
                </form>
              ) : (
                <div className="operations-empty">Manager must open the drawer for cash payments.</div>
              )}
            </section>
          ) : null}

          {canManage ? (
            <details className="operations-panel operations-floor-setup-panel">
              <summary className="operations-panel-heading">
                <div>
                  <p className="eyebrow">Floor Setup</p>
                  <h2>Tables</h2>
                </div>
                <span>{managedTables.filter((table) => table.isActive).length} active</span>
              </summary>

              <p className="operations-floor-setup-copy">
                Rooms are created once, then selected when you add tables. Table numbers advance automatically inside each room.
              </p>

              <form
                className="operations-room-form"
                onSubmit={(event) => void submitNewRoom(event)}
              >
                <input
                  aria-label="New room name"
                  placeholder="New room · e.g. Main Room"
                  value={newRoomName}
                  onChange={(event) => setNewRoomName(event.target.value)}
                />
                <button
                  type="submit"
                  className="button"
                  disabled={busyKey === "new-room"}
                >
                  Add Room
                </button>
              </form>

              <form className="operations-floor-form" onSubmit={(event) => void submitNewTable(event)}>
                <select
                  aria-label="Room"
                  value={newTableSectionId}
                  onChange={(event) => {
                    const sectionId = event.target.value;
                    setNewTableSectionId(sectionId);
                    setNewTableLabel(
                      nextTableLabelForSection(sectionId, managedTables),
                    );
                  }}
                >
                  <option value="">
                    {managedSections.length === 0 ? "Add a room first" : "Choose room"}
                  </option>
                  {managedSections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
                <input
                  aria-label="Table number"
                  placeholder="Table"
                  value={newTableLabel}
                  onChange={(event) => setNewTableLabel(event.target.value)}
                />
                <input
                  aria-label="Seats"
                  inputMode="numeric"
                  value={newTableCapacity}
                  onChange={(event) => setNewTableCapacity(event.target.value)}
                />
                <button
                  type="submit"
                  className="button"
                  data-variant="primary"
                  disabled={busyKey === "new-table" || !newTableSectionId}
                >
                  Add Table
                </button>
              </form>

              <div className="operations-floor-table-list">
                {managedTables.length === 0 ? (
                  <div className="operations-empty">No dining tables configured yet.</div>
                ) : managedTables.map((table) => (
                  <div key={table.id} data-active={table.isActive}>
                    <span>
                      <strong>Table {table.label}</strong>
                      <small>{table.sectionName} · {table.capacity} seats{table.occupied ? " · occupied" : ""}</small>
                    </span>
                    <button
                      type="button"
                      className="operations-text-button"
                      disabled={table.occupied || busyKey === `table-${table.id}`}
                      onClick={() => void toggleDiningTable(table)}
                    >
                      {table.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                ))}
              </div>
            </details>
          ) : null}

          {canManage ? (
            <details className="operations-panel operations-management-panel">
              <summary className="operations-panel-heading">
                <div>
                  <p className="eyebrow">Management</p>
                  <h2>Admin</h2>
                </div>
              </summary>
              <div className="operations-management-links">
                <Link to="/menu">Menu Management <span>→</span></Link>
                {roleSet.has("admin") ? <Link to="/users">Users <span>→</span></Link> : null}
              </div>
            </details>
          ) : null}
        </aside>
      </div>


    </main>
  );
}
