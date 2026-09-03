import {
  type CheckPriceOverride,
  type DrawerSession,
  type StackCheck,
  type StackParty,
  type StackSnapshot,
  RITZ_FLOOR_SECTIONS,
  type RitzFloorTableShape,
  type UserRoleCode,
} from "@lazy-janes/shared";
import {
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
  createParty,
  getDiningTables,
  seatParty,
  unseatParty,
} from "../api/parties";
import { getCurrentDrawer } from "../api/register";
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

function statusLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function partyLabel(party: StackParty): string {
  if (party.name?.trim()) return party.name.trim();
  return `Party of ${party.guestCount}`;
}

function localCardReference(checkId: string): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  const stamp = `${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const checkCode = checkId.replace(/-/g, "").slice(0, 4).toUpperCase();
  const randomCode = crypto.randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase();
  return `LJ-${stamp}-${checkCode}-${randomCode}`;
}

function readMoneyPrompt(label: string, initial = "0"): number | null {
  const raw = window.prompt(label, initial)?.trim();
  if (raw === undefined || raw === "") return null;
  if (!/^\d+(?:\.\d{1,2})?$/.test(raw)) return Number.NaN;
  return Number(raw);
}

function tableLiveState(party: StackParty | null): {
  state: "open" | "seated" | "ordered" | "kitchen" | "ready" | "check";
  badge: string;
  detail: string;
} {
  if (!party) {
    return { state: "open", badge: "OPEN", detail: "Available" };
  }

  const items = party.orders
    .filter((order) => order.cancelledAt === null)
    .flatMap((order) => order.items)
    .filter((item) => item.status !== "voided");
  const ready = items.filter((item) => item.status === "ready").length;
  const kitchen = items.filter((item) => item.status === "fired").length;
  const ordered = items.filter((item) => item.status === "submitted").length;
  const openChecks = party.checks.filter((check) => check.status !== "closed");
  const balance = openChecks.reduce((total, check) => total + check.balanceAmount, 0);
  const presented = openChecks.some((check) => check.status === "presented");

  if (ready > 0) {
    return {
      state: "ready",
      badge: `READY ${ready}`,
      detail: "Food ready",
    };
  }

  if (presented && balance > 0) {
    return {
      state: "check",
      badge: money(balance),
      detail: "Check presented",
    };
  }

  if (openChecks.length > 0) {
    return {
      state: "check",
      badge: money(balance),
      detail: "Check open",
    };
  }

  if (kitchen > 0) {
    return {
      state: "kitchen",
      badge: `KITCHEN ${kitchen}`,
      detail: "In kitchen",
    };
  }

  if (ordered > 0) {
    return {
      state: "ordered",
      badge: `ORDERED ${ordered}`,
      detail: "Order entered",
    };
  }

  return {
    state: "seated",
    badge: "SEATED",
    detail: `${elapsed(party.arrivedAt)} at table`,
  };
}

const RITZ_SECTION_BY_NAME = new Map(
  RITZ_FLOOR_SECTIONS.map((section) => [section.name, section]),
);

function ritzTableShape(
  sectionName: string,
  tableLabel: string,
): RitzFloorTableShape | "standard" {
  const section = RITZ_SECTION_BY_NAME.get(sectionName);
  return (
    section?.tables.find((table) => table.label === tableLabel)?.shape ??
    "standard"
  );
}

export function PosPage() {
  const { user } = useAuth();
  const [snapshot, setSnapshot] = useState<StackSnapshot | null>(null);
  const [tables, setTables] = useState<Awaited<ReturnType<typeof getDiningTables>>>([]);
  const [drawer, setDrawer] = useState<DrawerSession | null>(null);
  const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null);
  const [seatingPartyId, setSeatingPartyId] = useState<string | null>(null);
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);
  const [newPartyName, setNewPartyName] = useState("");
  const [newPartyGuests, setNewPartyGuests] = useState("2");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const roleSet = useMemo(() => new Set(user?.roles ?? []), [user]);
  const can = useCallback(
    (roles: readonly UserRoleCode[]) => roles.some((role) => roleSet.has(role)),
    [roleSet],
  );
  const canManageParties = can(PARTY_ROLES);
  const canServe = can(SERVICE_ROLES);

  const loadPos = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);

    try {
      const [nextSnapshot, nextTables, nextDrawer] = await Promise.all([
        getStackSnapshot(),
        getDiningTables(),
        canServe ? getCurrentDrawer() : Promise.resolve(null),
      ]);
      setSnapshot(nextSnapshot);
      setTables(nextTables);
      setDrawer(nextDrawer);
      setError(null);
    } catch (loadError: unknown) {
      setError(errorMessage(loadError));
    } finally {
      setLoading(false);
      if (showSpinner) setRefreshing(false);
    }
  }, [canServe]);

  useEffect(() => {
    void loadPos();
    const interval = window.setInterval(() => void loadPos(), 10_000);
    return () => window.clearInterval(interval);
  }, [loadPos]);

  const activeParties = useMemo(
    () => (snapshot?.parties ?? []).filter(
      (party) => party.status !== "completed" && party.status !== "cancelled",
    ),
    [snapshot],
  );

  const waitingParties = activeParties.filter((party) => party.status === "waiting");
  const seatedParties = activeParties.filter(
    (party) => party.status === "seated" || party.status === "in_service",
  );

  const partyByTableId = useMemo(() => {
    const map = new Map<string, StackParty>();
    for (const party of seatedParties) {
      for (const table of party.tables) map.set(table.id, party);
    }
    return map;
  }, [seatedParties]);

  const floorSections = useMemo(() => {
    const sections: Array<{
      id: string;
      name: string;
      tables: typeof tables;
    }> = [];

    for (const table of tables) {
      let section = sections.find((candidate) => candidate.id === table.sectionId);
      if (!section) {
        section = { id: table.sectionId, name: table.sectionName, tables: [] };
        sections.push(section);
      }
      section.tables.push(table);
    }
    return sections;
  }, [tables]);

  const isCanonicalRitzFloor = useMemo(
    () =>
      RITZ_FLOOR_SECTIONS.every((floorSection) =>
        floorSections.some((section) => section.name === floorSection.name),
      ),
    [floorSections],
  );

  const seatingParty = seatingPartyId
    ? waitingParties.find((party) => party.id === seatingPartyId) ?? null
    : null;
  const selectedParty = selectedPartyId
    ? activeParties.find((party) => party.id === selectedPartyId) ?? null
    : null;

  async function runAction(
    key: string,
    action: () => Promise<unknown>,
    success: string,
  ): Promise<boolean> {
    setBusyKey(key);
    setError(null);
    setNotice(null);
    try {
      await action();
      setNotice(success);
      await loadPos();
      return true;
    } catch (actionError: unknown) {
      setError(errorMessage(actionError));
      return false;
    } finally {
      setBusyKey(null);
    }
  }

  async function submitParty(event: FormEvent) {
    event.preventDefault();
    const name = newPartyName.trim();
    const guestCount = Number(newPartyGuests);
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
      () => createParty({ name, guestCount }),
      `${name} added to waitlist.`,
    );
    if (created) setNewPartyName("");
  }

  function beginSeating(party: StackParty) {
    setSelectedPartyId(null);
    setSeatingPartyId(party.id);
    setSelectedTableIds([]);
    setNotice(`Choose an open table for ${partyLabel(party)}.`);
  }

  function cancelSeating() {
    setSeatingPartyId(null);
    setSelectedTableIds([]);
    setNotice(null);
  }

  function handleTableClick(tableId: string) {
    const party = partyByTableId.get(tableId) ?? null;
    const table = tables.find((candidate) => candidate.id === tableId);
    if (!table) return;

    if (seatingParty) {
      if (table.occupied) return;
      setSelectedTableIds((current) =>
        current.includes(tableId)
          ? current.filter((id) => id !== tableId)
          : [...current, tableId],
      );
      return;
    }

    if (party) setSelectedPartyId(party.id);
  }

  async function confirmSeating() {
    if (!seatingParty || selectedTableIds.length === 0) return;
    const partyId = seatingParty.id;
    const success = await runAction(
      `seat-${partyId}`,
      () => seatParty(partyId, { tableIds: selectedTableIds }),
      `${partyLabel(seatingParty)} seated.`,
    );
    if (success) {
      setSeatingPartyId(null);
      setSelectedTableIds([]);
      setSelectedPartyId(partyId);
    }
  }

  async function cancelWaiting(party: StackParty) {
    const reason = window.prompt("Reason for cancelling this party?")?.trim();
    if (!reason) return;
    await runAction(
      `cancel-party-${party.id}`,
      () => cancelParty(party.id, { reason }),
      "Party cancelled.",
    );
  }

  async function unseatSelected(party: StackParty) {
    const reason = window.prompt("Reason for unseating this party?")?.trim();
    if (!reason) return;
    const success = await runAction(
      `unseat-${party.id}`,
      () => unseatParty(party.id, { reason }),
      "Party returned to waitlist.",
    );
    if (success) setSelectedPartyId(null);
  }

  async function createPartyCheck(party: StackParty) {
    const items = party.orders
      .filter((order) => order.cancelledAt === null)
      .flatMap((order) => order.items)
      .filter((item) => item.status !== "voided" && item.remainingQuantity > 0)
      .map((item) => ({
        orderItemId: item.id,
        allocatedQuantity: item.remainingQuantity,
      }));

    if (items.length === 0) {
      setError("There is nothing left to put on a check.");
      return;
    }

    const input = {
      partyId: party.id,
      label: `${partyLabel(party)} · ${party.tables.map((table) => `Table ${table.label}`).join(" + ")}`,
      items,
    };

    setBusyKey(`check-${party.id}`);
    setError(null);
    setNotice(null);

    try {
      await createCheck(input);
      setNotice("Check created.");
      await loadPos();
    } catch (checkError: unknown) {
      if (!(checkError instanceof CheckPricingRequiredError)) {
        setError(errorMessage(checkError));
        return;
      }

      const priceOverrides: CheckPriceOverride[] = [];
      for (const requirement of checkError.requirements) {
        const amount = readMoneyPrompt(
          `Price for ${requirement.label}? Enter 0 for Free.`,
          "0",
        );
        if (amount === null) return;
        if (!Number.isFinite(amount) || amount < 0) {
          setError(`Enter a valid price for ${requirement.label}.`);
          return;
        }
        priceOverrides.push({
          source: requirement.source,
          recordId: requirement.recordId,
          amount,
        });
      }

      try {
        await createCheck({ ...input, priceOverrides });
        setNotice("Prices saved and check created.");
        await loadPos();
      } catch (retryError: unknown) {
        setError(errorMessage(retryError));
      }
    } finally {
      setBusyKey(null);
    }
  }

  async function payCard(check: StackCheck) {
    const tipAmount = readMoneyPrompt("Tip amount?", "0");
    if (tipAmount === null) return;
    if (!Number.isFinite(tipAmount) || tipAmount < 0) {
      setError("Tip must be a valid amount.");
      return;
    }

    await runAction(
      `pay-${check.id}`,
      () => takePayment({
        method: "card",
        allocations: [{ checkId: check.id, allocatedAmount: check.balanceAmount }],
        tipAmount,
        processorReference: localCardReference(check.id),
      }),
      "Card payment recorded.",
    );
  }

  async function payCash(check: StackCheck) {
    if (!drawer) {
      setError("Open the cash drawer in Operations before taking cash.");
      return;
    }

    const tipAmount = readMoneyPrompt("Tip amount?", "0");
    if (tipAmount === null) return;
    if (!Number.isFinite(tipAmount) || tipAmount < 0) {
      setError("Tip must be a valid amount.");
      return;
    }

    const totalDue = check.balanceAmount + tipAmount;
    const cashReceivedAmount = readMoneyPrompt(
      `Cash received? Total due ${money(totalDue)}.`,
      totalDue.toFixed(2),
    );
    if (cashReceivedAmount === null) return;
    if (!Number.isFinite(cashReceivedAmount) || cashReceivedAmount < totalDue) {
      setError("Cash received must cover the balance and tip.");
      return;
    }

    await runAction(
      `pay-${check.id}`,
      () => takePayment({
        method: "cash",
        allocations: [{ checkId: check.id, allocatedAmount: check.balanceAmount }],
        tipAmount,
        cashReceivedAmount,
      }),
      "Cash payment recorded.",
    );
  }

  if (loading) {
    return (
      <main className="page pos-page">
        <p className="loading-state">Loading POS…</p>
      </main>
    );
  }

  const selectedOpenChecks = selectedParty
    ? selectedParty.checks.filter((check) => check.status !== "closed")
    : [];
  const selectedHasUncheckedItems = selectedParty
    ? selectedParty.orders
        .filter((order) => order.cancelledAt === null)
        .flatMap((order) => order.items)
        .some((item) => item.status !== "voided" && item.remainingQuantity > 0)
    : false;

  const readyCount = seatedParties.reduce(
    (total, party) => total + party.orders.flatMap((order) => order.items)
      .filter((item) => item.status === "ready").length,
    0,
  );

  return (
    <main className="pos-page">
      <header className="pos-toolbar">
        <div className="pos-toolbar-title">
          <span className="eyebrow">Lazy Jane’s / Live Floor</span>
          <h1>POS</h1>
        </div>

        <div className="pos-toolbar-status" aria-label="Live restaurant summary">
          <span><strong>{waitingParties.length}</strong> waiting</span>
          <span><strong>{seatedParties.length}</strong> seated</span>
          <span data-hot={readyCount > 0}><strong>{readyCount}</strong> ready</span>
        </div>

        <div className="pos-toolbar-actions">
          {snapshot ? <small>Updated {clockTime(snapshot.generatedAt)}</small> : null}
          <button
            type="button"
            className="button"
            data-variant="quiet"
            disabled={refreshing}
            onClick={() => void loadPos(true)}
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

      {error ? <div className="notice notice--error pos-notice">{error}</div> : null}
      {notice ? <div className="notice notice--success pos-notice">{notice}</div> : null}

      <div className="pos-workspace" data-inspector={selectedParty ? "open" : "closed"}>
        <aside className="pos-waitlist" aria-label="Waitlist">
          <header className="pos-panel-heading">
            <div>
              <span className="eyebrow">Front Desk</span>
              <h2>Waitlist</h2>
            </div>
            <strong>{waitingParties.length}</strong>
          </header>

          {canManageParties ? (
            <form className="pos-wait-form" onSubmit={(event) => void submitParty(event)}>
              <input
                aria-label="Party name"
                placeholder="Party name"
                value={newPartyName}
                onChange={(event) => setNewPartyName(event.target.value)}
              />
              <input
                aria-label="Guests"
                inputMode="numeric"
                value={newPartyGuests}
                onChange={(event) => setNewPartyGuests(event.target.value)}
              />
              <button
                type="submit"
                className="button"
                data-variant="primary"
                disabled={busyKey === "new-party"}
              >
                Add
              </button>
            </form>
          ) : null}

          <div className="pos-waitlist-list">
            {waitingParties.length === 0 ? (
              <div className="pos-empty">
                <strong>No one waiting</strong>
                <span>New arrivals will appear here.</span>
              </div>
            ) : (
              waitingParties.map((party) => (
                <article
                  className="pos-wait-party"
                  data-selected={seatingPartyId === party.id}
                  key={party.id}
                >
                  <button
                    type="button"
                    className="pos-wait-party-main"
                    onClick={() => beginSeating(party)}
                  >
                    <span className="pos-wait-party-size">{party.guestCount}</span>
                    <span>
                      <strong>{partyLabel(party)}</strong>
                      <small>{elapsed(party.arrivedAt)} waiting</small>
                    </span>
                  </button>

                  {canManageParties ? (
                    <div className="pos-wait-party-actions">
                      <button
                        type="button"
                        className="operations-text-button"
                        onClick={() => beginSeating(party)}
                      >
                        Seat
                      </button>
                      <button
                        type="button"
                        className="operations-text-button"
                        onClick={() => void cancelWaiting(party)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : null}
                </article>
              ))
            )}
          </div>
        </aside>

        <section className="pos-floor" aria-label="Dining room floor">
          {seatingParty ? (
            <div className="pos-seating-bar">
              <div>
                <span className="eyebrow">Seat Party</span>
                <strong>{partyLabel(seatingParty)} · {seatingParty.guestCount} guests</strong>
              </div>
              <span>{selectedTableIds.length === 0 ? "Choose table" : `${selectedTableIds.length} selected`}</span>
              <button type="button" className="operations-text-button" onClick={cancelSeating}>
                Cancel
              </button>
              <button
                type="button"
                className="button"
                data-variant="primary"
                disabled={selectedTableIds.length === 0 || busyKey === `seat-${seatingParty.id}`}
                onClick={() => void confirmSeating()}
              >
                Seat
              </button>
            </div>
          ) : null}

          <div
            className="pos-floor-rooms"
            data-layout={isCanonicalRitzFloor ? "ritz" : "stacked"}
          >
            {floorSections.length === 0 ? (
              <div className="pos-empty pos-empty-floor">
                <strong>No floor configured</strong>
                <span>Arrange tables from Operations.</span>
              </div>
            ) : isCanonicalRitzFloor ? (
              <div className="pos-ritz-plan">
                <div className="pos-ritz-landmark pos-ritz-landmark-kitchen">
                  <span>Kitchen · Prep · Dish</span>
                </div>

                {RITZ_FLOOR_SECTIONS.map((floorSpec) => {
                  const section = floorSections.find(
                    (candidate) => candidate.name === floorSpec.name,
                  );
                  if (!section) return null;

                  return (
                    <section
                      className="pos-ritz-zone"
                      key={section.id}
                      data-zone={floorSpec.name}
                      style={{
                        left: `${floorSpec.floor.x}%`,
                        top: `${floorSpec.floor.y}%`,
                        width: `${floorSpec.floor.width}%`,
                        height: `${floorSpec.floor.height}%`,
                      }}
                    >
                      <header>
                        <strong>{section.name}</strong>
                        <span>
                          {section.tables.filter((table) => table.occupied).length}
                          /{section.tables.length}
                        </span>
                      </header>

                      <div className="pos-ritz-zone-canvas">
                        {section.tables.map((table) => {
                          const party = partyByTableId.get(table.id) ?? null;
                          const state = tableLiveState(party);
                          const selected = selectedTableIds.includes(table.id);
                          const focused = party?.id === selectedPartyId;
                          const shape = ritzTableShape(section.name, table.label);
                          const counterSeat = shape === "counter";

                          return (
                            <button
                              type="button"
                              className="pos-table"
                              data-state={state.state}
                              data-shape={shape}
                              data-selected={selected}
                              data-focused={focused}
                              disabled={Boolean(seatingParty) && table.occupied}
                              key={table.id}
                              style={{
                                left: `${table.floorX}%`,
                                top: `${table.floorY}%`,
                              }}
                              onClick={() => handleTableClick(table.id)}
                              aria-label={`${section.name} ${table.label}: ${
                                party ? `${partyLabel(party)}, ${state.detail}` : "available"
                              }`}
                            >
                              {counterSeat ? null : (
                                <span className="pos-table-badge">{state.badge}</span>
                              )}
                              <strong>{table.label}</strong>
                              {counterSeat ? (
                                <small>{party ? party.guestCount : ""}</small>
                              ) : (
                                <>
                                  <span className="pos-table-party">
                                    {party ? partyLabel(party) : `${table.capacity} seats`}
                                  </span>
                                  <small>
                                    {party
                                      ? `${party.guestCount} guests · ${elapsed(party.arrivedAt)}`
                                      : state.detail}
                                  </small>
                                </>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              floorSections.map((section) => (
                <section className="pos-room" key={section.id}>
                  <header>
                    <strong>{section.name}</strong>
                    <span>
                      {section.tables.filter((table) => table.occupied).length} occupied
                    </span>
                  </header>

                  <div className="pos-room-canvas">
                    {section.tables.map((table) => {
                      const party = partyByTableId.get(table.id) ?? null;
                      const state = tableLiveState(party);
                      const selected = selectedTableIds.includes(table.id);
                      const focused = party?.id === selectedPartyId;

                      return (
                        <button
                          type="button"
                          className="pos-table"
                          data-state={state.state}
                          data-selected={selected}
                          data-focused={focused}
                          disabled={Boolean(seatingParty) && table.occupied}
                          key={table.id}
                          style={{ left: `${table.floorX}%`, top: `${table.floorY}%` }}
                          onClick={() => handleTableClick(table.id)}
                        >
                          <span className="pos-table-badge">{state.badge}</span>
                          <strong>{table.label}</strong>
                          <span className="pos-table-party">
                            {party ? partyLabel(party) : `${table.capacity} seats`}
                          </span>
                          <small>
                            {party
                              ? `${party.guestCount} guests · ${elapsed(party.arrivedAt)}`
                              : state.detail}
                          </small>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))
            )}
          </div>
        </section>

        {selectedParty ? (
          <aside className="pos-inspector" aria-label="Selected table controls">
            <header className="pos-panel-heading pos-inspector-heading">
              <div>
                <span className="eyebrow">Table</span>
                <h2>{selectedParty.tables.map((table) => table.label).join(" + ")}</h2>
                <strong>{partyLabel(selectedParty)}</strong>
                <small>{selectedParty.guestCount} guests · {elapsed(selectedParty.arrivedAt)}</small>
              </div>
              <button
                type="button"
                className="pos-close"
                aria-label="Close table controls"
                onClick={() => setSelectedPartyId(null)}
              >
                ×
              </button>
            </header>

            <section className="pos-inspector-section">
              <div className="pos-inspector-section-title">
                <strong>Order</strong>
                {canServe ? (
                  <Link className="operations-text-button" to={`/orders/new?partyId=${selectedParty.id}`}>
                    Add
                  </Link>
                ) : null}
              </div>

              {selectedParty.orders.filter((order) => order.cancelledAt === null).length === 0 ? (
                <div className="pos-inspector-empty">No order yet.</div>
              ) : (
                selectedParty.orders
                  .filter((order) => order.cancelledAt === null)
                  .map((order) => (
                    <article className="pos-order" key={order.id}>
                      <small>{elapsed(order.submittedAt)}</small>
                      {order.items
                        .filter((item) => item.status !== "voided")
                        .map((item) => (
                          <div key={item.id}>
                            <span>{item.quantity > 1 ? `${item.quantity}× ` : ""}{item.itemName}</span>
                            <span className="pos-item-status" data-status={item.status}>
                              {statusLabel(item.status)}
                            </span>
                          </div>
                        ))}
                    </article>
                  ))
              )}
            </section>

            <section className="pos-inspector-section">
              <div className="pos-inspector-section-title">
                <strong>Check</strong>
                {canServe && selectedHasUncheckedItems ? (
                  <button
                    type="button"
                    className="operations-text-button"
                    disabled={busyKey === `check-${selectedParty.id}`}
                    onClick={() => void createPartyCheck(selectedParty)}
                  >
                    {selectedOpenChecks.length > 0 ? "Add items" : "Create"}
                  </button>
                ) : null}
              </div>

              {selectedOpenChecks.length === 0 ? (
                <div className="pos-inspector-empty">No open check.</div>
              ) : (
                selectedOpenChecks.map((check) => (
                  <article className="pos-check" key={check.id}>
                    <div>
                      <span>{statusLabel(check.status)}</span>
                      <strong>{money(check.balanceAmount)}</strong>
                    </div>

                    {check.status === "open" && canServe ? (
                      <button
                        type="button"
                        className="button"
                        data-variant="primary"
                        disabled={busyKey === `present-${check.id}`}
                        onClick={() => void runAction(
                          `present-${check.id}`,
                          () => presentCheck(check.id),
                          "Check presented.",
                        )}
                      >
                        Present Check
                      </button>
                    ) : null}

                    {check.status === "presented" && check.balanceAmount > 0 && canServe ? (
                      <div className="pos-pay-actions">
                        <button
                          type="button"
                          className="button"
                          data-variant="primary"
                          disabled={busyKey === `pay-${check.id}`}
                          onClick={() => void payCard(check)}
                        >
                          Card
                        </button>
                        <button
                          type="button"
                          className="button"
                          disabled={busyKey === `pay-${check.id}`}
                          onClick={() => void payCash(check)}
                        >
                          Cash
                        </button>
                      </div>
                    ) : null}
                  </article>
                ))
              )}
            </section>

            <footer className="pos-inspector-actions">
              {canServe ? (
                <Link className="button" data-variant="primary" to={`/orders/new?partyId=${selectedParty.id}`}>
                  Add Order
                </Link>
              ) : null}
              {selectedParty.status === "seated" && canManageParties ? (
                <button
                  type="button"
                  className="button"
                  disabled={busyKey === `unseat-${selectedParty.id}`}
                  onClick={() => void unseatSelected(selectedParty)}
                >
                  Unseat
                </button>
              ) : null}
            </footer>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
