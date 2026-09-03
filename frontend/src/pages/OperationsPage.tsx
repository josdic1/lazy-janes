import {
  type DiningRoomSection,
  type DiningTableRecord,
  type DrawerSession,
  type StackParty,
  type StackSnapshot,
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
  createDiningRoomSection,
  createDiningTable,
  getManagedDiningRoomSections,
  getManagedDiningTables,
  updateDiningTable,
} from "../api/parties";
import {
  closeDrawer,
  getCurrentDrawer,
  openDrawer,
} from "../api/register";
import { getStackSnapshot } from "../api/stack";
import { useAuth } from "../hooks/useAuth";

function money(value: number): string {
  return `$${value.toFixed(2)}`;
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
  return party.name?.trim() || `Party of ${party.guestCount}`;
}

function completedAt(party: StackParty): string {
  const event = [...party.events]
    .reverse()
    .find((candidate) => candidate.eventType === "completed");

  return event?.occurredAt ?? party.statusChangedAt;
}

function nextTableLabelForSection(
  sectionId: string,
  tables: DiningTableRecord[],
): string {
  const usedNumbers = tables
    .filter((table) => table.sectionId === sectionId)
    .map((table) => {
      const match = table.label.trim().match(/(\d+)$/);
      return match ? Number(match[1]) : Number.NaN;
    })
    .filter((value) => Number.isInteger(value) && value > 0);

  return String((usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0) + 1);
}

export function OperationsPage() {
  const { user } = useAuth();
  const [snapshot, setSnapshot] = useState<StackSnapshot | null>(null);
  const [drawer, setDrawer] = useState<DrawerSession | null>(null);
  const [sections, setSections] = useState<DiningRoomSection[]>([]);
  const [tables, setTables] = useState<DiningTableRecord[]>([]);
  const [openingCash, setOpeningCash] = useState("200");
  const [closingCash, setClosingCash] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [newTableSectionId, setNewTableSectionId] = useState("");
  const [newTableLabel, setNewTableLabel] = useState("");
  const [newTableCapacity, setNewTableCapacity] = useState("4");
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [floorSetupOpen, setFloorSetupOpen] = useState(false);

  const load = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);

    try {
      const [
        nextSnapshot,
        nextDrawer,
        nextSections,
        nextTables,
      ] = await Promise.all([
        getStackSnapshot(),
        getCurrentDrawer(),
        getManagedDiningRoomSections(),
        getManagedDiningTables(),
      ]);

      setSnapshot(nextSnapshot);
      setDrawer(nextDrawer);
      setSections(nextSections);
      setTables(nextTables);
      setError(null);
    } catch (loadError: unknown) {
      setError(errorMessage(loadError));
    } finally {
      setLoading(false);
      if (showSpinner) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();

    const interval = window.setInterval(() => {
      void load();
    }, 30_000);

    return () => window.clearInterval(interval);
  }, [load]);

  useEffect(() => {
    if (sections.length === 0) {
      setNewTableSectionId("");
      setNewTableLabel("");
      return;
    }

    if (!sections.some((section) => section.id === newTableSectionId)) {
      const firstSection = sections[0]!;
      setNewTableSectionId(firstSection.id);
      setNewTableLabel(nextTableLabelForSection(firstSection.id, tables));
    }
  }, [newTableSectionId, sections, tables]);

  const completedParties = useMemo(
    () =>
      (snapshot?.parties ?? [])
        .filter((party) => party.status === "completed")
        .sort(
          (a, b) =>
            new Date(completedAt(b)).getTime() -
            new Date(completedAt(a)).getTime(),
        ),
    [snapshot],
  );

  const activeTables = tables.filter((table) => table.isActive);
  const inactiveTables = tables.filter((table) => !table.isActive);
  const occupiedTables = tables.filter(
    (table) => table.isActive && table.occupied,
  );

  async function runAction(
    key: string,
    action: () => Promise<unknown>,
    success: string,
  ) {
    setBusyKey(key);
    setError(null);
    setNotice(null);

    try {
      await action();
      setNotice(success);
      await load();
    } catch (actionError: unknown) {
      setError(errorMessage(actionError));
    } finally {
      setBusyKey(null);
    }
  }

  async function submitRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newRoomName.trim();
    if (!name) return;

    await runAction(
      "new-room",
      () => createDiningRoomSection({ name }),
      "Room added.",
    );
    setNewRoomName("");
  }

  async function submitTable(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const label = newTableLabel.trim();
    const capacity = Number(newTableCapacity);

    if (!newTableSectionId || !label) {
      setError("Choose an area and enter a table label.");
      return;
    }

    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 30) {
      setError("Seats must be a whole number from 1 to 30.");
      return;
    }

    await runAction(
      "new-table",
      () =>
        createDiningTable({
          sectionId: newTableSectionId,
          label,
          capacity,
        }),
      "Table added.",
    );

    setNewTableLabel(
      nextTableLabelForSection(newTableSectionId, [
        ...tables,
        {
          id: crypto.randomUUID(),
          sectionId: newTableSectionId,
          sectionName:
            sections.find((section) => section.id === newTableSectionId)?.name ??
            "",
          label,
          capacity,
          occupied: false,
          isActive: true,
          floorX: 50,
          floorY: 50,
        },
      ]),
    );
  }

  if (loading) {
    return (
      <main className="page operations-manager-page">
        <p className="loading-state">Loading operations…</p>
      </main>
    );
  }

  return (
    <main className="page operations-manager-page">
      <header className="operations-manager-heading">
        <div>
          <p className="eyebrow">Lazy Jane’s / Manager</p>
          <h1>Operations</h1>
          <p>Shift controls and restaurant setup. Live service stays in POS.</p>
        </div>

        <div className="operations-manager-heading-actions">
          {snapshot ? <small>Updated {clockTime(snapshot.generatedAt)}</small> : null}
          <button
            type="button"
            className="button"
            data-variant="quiet"
            disabled={refreshing}
            onClick={() => void load(true)}
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          <Link className="button" data-variant="primary" to="/pos">
            Open POS
          </Link>
        </div>
      </header>

      {error ? <div className="notice notice--error">{error}</div> : null}
      {notice ? <div className="notice notice--success">{notice}</div> : null}

      <section className="operations-manager-status" aria-label="Manager status">
        <div>
          <span>Cash drawer</span>
          <strong>{drawer ? "Open" : "Closed"}</strong>
        </div>
        <div>
          <span>Active tables</span>
          <strong>{activeTables.length}</strong>
        </div>
        <div>
          <span>Occupied now</span>
          <strong>{occupiedTables.length}</strong>
        </div>
        <div>
          <span>Completed today</span>
          <strong>{completedParties.length}</strong>
        </div>
      </section>

      <div className="operations-manager-grid">
        <section className="operations-manager-panel">
          <header>
            <div>
              <p className="eyebrow">Register</p>
              <h2>Cash Drawer</h2>
            </div>
            <span className="operations-manager-state" data-open={drawer !== null}>
              {drawer ? "Open" : "Closed"}
            </span>
          </header>

          {drawer ? (
            <div className="operations-manager-register">
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

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const countedCashAmount = Number(closingCash);
                  if (!Number.isFinite(countedCashAmount) || countedCashAmount < 0) {
                    setError("Enter the end-of-shift cash count.");
                    return;
                  }
                  void runAction(
                    "close-drawer",
                    () => closeDrawer({ countedCashAmount }),
                    "Drawer closed and compared.",
                  );
                }}
              >
                <label>
                  <span>End-of-shift cash count</span>
                  <input
                    inputMode="decimal"
                    placeholder="0.00"
                    value={closingCash}
                    onChange={(event) => setClosingCash(event.target.value)}
                  />
                </label>
                <button
                  type="submit"
                  className="button"
                  disabled={busyKey === "close-drawer"}
                >
                  Close Shift & Compare
                </button>
              </form>
            </div>
          ) : (
            <form
              className="operations-manager-register"
              onSubmit={(event) => {
                event.preventDefault();
                const openingCashAmount = Number(openingCash);
                if (!Number.isFinite(openingCashAmount) || openingCashAmount < 0) {
                  setError("Enter the starting cash count.");
                  return;
                }
                void runAction(
                  "open-drawer",
                  () => openDrawer({ openingCashAmount }),
                  "Drawer opened for shift.",
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
                Open Drawer for Shift
              </button>
            </form>
          )}
        </section>

        <section
          className="operations-manager-panel operations-manager-floor"
          data-expanded={floorSetupOpen}
        >
          <header className="operations-manager-floor-header">
            <div>
              <p className="eyebrow">Configuration</p>
              <h2>Floor Setup</h2>
            </div>

            <div className="operations-manager-floor-header-actions">
              <span>
                {sections.length} areas · {activeTables.length} positions
              </span>
              <button
                type="button"
                className="operations-text-button"
                aria-expanded={floorSetupOpen}
                onClick={() => setFloorSetupOpen((open) => !open)}
              >
                {floorSetupOpen ? "Done" : "Edit"}
              </button>
            </div>
          </header>

          {floorSetupOpen ? (
            <>
            <div className="operations-manager-floor-summary">
              {sections.map((section) => {
                const sectionTables = tables.filter(
                  (table) => table.sectionId === section.id && table.isActive,
                );
                return (
                  <div key={section.id}>
                    <strong>{section.name}</strong>
                    <span>{sectionTables.length} positions</span>
                  </div>
                );
              })}
            </div>

            <form
              className="operations-manager-room-form"
              onSubmit={(event) => void submitRoom(event)}
            >
              <input
                aria-label="New area name"
                placeholder="New area"
                value={newRoomName}
                onChange={(event) => setNewRoomName(event.target.value)}
              />
              <button type="submit" className="button" disabled={busyKey === "new-room"}>
                Add Area
              </button>
            </form>

            <form
              className="operations-manager-table-form"
              onSubmit={(event) => void submitTable(event)}
            >
              <select
                aria-label="Area"
                value={newTableSectionId}
                onChange={(event) => {
                  const sectionId = event.target.value;
                  setNewTableSectionId(sectionId);
                  setNewTableLabel(nextTableLabelForSection(sectionId, tables));
                }}
              >
                <option value="">
                  {sections.length === 0 ? "Add an area first" : "Choose area"}
                </option>
                {sections.map((section) => (
                  <option value={section.id} key={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
              <input
                aria-label="Table label"
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

            <div className="operations-manager-table-list">
              {tables.map((table) => (
                <div key={table.id} data-active={table.isActive}>
                  <span>
                    <strong>{table.label}</strong>
                    <small>
                      {table.sectionName} · {table.capacity} seat
                      {table.capacity === 1 ? "" : "s"}
                      {table.occupied ? " · occupied" : ""}
                    </small>
                  </span>
                  <button
                    type="button"
                    className="operations-text-button"
                    disabled={table.occupied || busyKey === `table-${table.id}`}
                    onClick={() =>
                      void runAction(
                        `table-${table.id}`,
                        () => updateDiningTable(table.id, { isActive: !table.isActive }),
                        table.isActive ? "Table deactivated." : "Table activated.",
                      )
                    }
                  >
                    {table.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              ))}
            </div>

            {inactiveTables.length > 0 ? (
              <p className="operations-manager-note">
                {inactiveTables.length} inactive table
                {inactiveTables.length === 1 ? "" : "s"} retained in setup.
              </p>
            ) : null}
            </>
          ) : null}
        </section>

        <section className="operations-manager-panel">
          <header>
            <div>
              <p className="eyebrow">Today</p>
              <h2>Completed Activity</h2>
            </div>
            <span>{completedParties.length}</span>
          </header>

          <div className="operations-manager-completed">
            {completedParties.length === 0 ? (
              <div className="operations-manager-empty">No completed parties yet today.</div>
            ) : (
              completedParties.slice(0, 20).map((party) => (
                <div key={party.id}>
                  <span>
                    <strong>{partyLabel(party)}</strong>
                    <small>
                      {party.guestCount} guest{party.guestCount === 1 ? "" : "s"}
                    </small>
                  </span>
                  <time dateTime={completedAt(party)}>{clockTime(completedAt(party))}</time>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="operations-manager-links">
        <div>
          <p className="eyebrow">Management</p>
          <h2>Admin Tools</h2>
        </div>
        <nav aria-label="Manager tools">
          <Link to="/menu">Menu Management <span>→</span></Link>
          {user?.roles.includes("admin") ? (
            <Link to="/users">Users <span>→</span></Link>
          ) : null}
        </nav>
      </section>
    </main>
  );
}
