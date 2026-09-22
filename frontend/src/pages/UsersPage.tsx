import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import {
  USER_ROLE_CODES,
  type UserRecord,
  type UserRoleCode,
} from "@lazy-janes/shared";
import {
  createUser,
  getUsers,
  resetUserPin,
  updateUser,
} from "../api/users";
import { Drawer } from "../components/ui/Drawer";
import {
  applyDemoPreset,
  clearDemoRun,
  getDemoStatus,
  type DemoRun,
  type DemoPreset,
} from "../api/dev";

const ROLE_LABELS: Record<UserRoleCode, string> = {
  host: "Host",
  server: "Server",
  lead_server: "Lead Server",
  chef: "Chef",
  head_chef: "Head Chef",
  manager: "Manager",
  admin: "Admin",
};

function browserDate(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

type DrawerMode =
  | "create"
  | "edit"
  | "pin"
  | null;

export function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null,
  );
  const [drawerMode, setDrawerMode] =
    useState<DrawerMode>(null);
  const [selectedUser, setSelectedUser] =
    useState<UserRecord | null>(null);
  const [displayName, setDisplayName] =
    useState("");
  const [roleCodes, setRoleCodes] = useState<
    UserRoleCode[]
  >([]);
  const [pin, setPin] = useState("");
  const [saving, setSaving] = useState(false);
  const [demoBusy, setDemoBusy] = useState<DemoPreset | null>(null);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);
  const [demoRun, setDemoRun] = useState<DemoRun | null>(null);
  const [demoAnchorDate, setDemoAnchorDate] = useState(browserDate);
  const [clearingDemo, setClearingDemo] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      try {
        const [result, demoStatus] = await Promise.all([
          getUsers(),
          import.meta.env.DEV
            ? getDemoStatus()
            : Promise.resolve({ activeRun: null }),
        ]);

        if (!cancelled) {
          setUsers(result.users);
          setDemoRun(demoStatus.activeRun);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load users.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  function closeDrawer() {
    setDrawerMode(null);
    setSelectedUser(null);
    setDisplayName("");
    setRoleCodes([]);
    setPin("");
    setError(null);
  }

  function openCreate() {
    setSelectedUser(null);
    setDisplayName("");
    setRoleCodes(["server"]);
    setPin("");
    setError(null);
    setDrawerMode("create");
  }

  function openEdit(user: UserRecord) {
    setSelectedUser(user);
    setDisplayName(user.displayName);
    setRoleCodes(user.roles);
    setPin("");
    setError(null);
    setDrawerMode("edit");
  }

  function openPinReset(user: UserRecord) {
    setSelectedUser(user);
    setPin("");
    setError(null);
    setDrawerMode("pin");
  }

  function toggleRole(roleCode: UserRoleCode) {
    setRoleCodes((current) =>
      current.includes(roleCode)
        ? current.filter(
            (currentRole) =>
              currentRole !== roleCode,
          )
        : [...current, roleCode],
    );
  }

  function replaceUser(updated: UserRecord) {
    setUsers((current) =>
      current.map((user) =>
        user.id === updated.id ? updated : user,
      ),
    );
  }

  async function handleCreate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const created = await createUser({
        displayName,
        roleCodes,
        pin,
      });

      setUsers((current) =>
        [...current, created].sort((a, b) =>
          a.displayName.localeCompare(
            b.displayName,
          ),
        ),
      );

      closeDrawer();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to create user.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!selectedUser) {
      return;
    }

    setError(null);
    setSaving(true);

    try {
      const updated = await updateUser(
        selectedUser.id,
        {
          displayName,
          roleCodes,
        },
      );

      replaceUser(updated);
      closeDrawer();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update user.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePinReset(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!selectedUser) {
      return;
    }

    setError(null);
    setSaving(true);

    try {
      await resetUserPin(selectedUser.id, pin);
      closeDrawer();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to reset password.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleActiveChange(
    user: UserRecord,
  ) {
    setError(null);

    try {
      const updated = await updateUser(user.id, {
        isActive: !user.isActive,
      });

      replaceUser(updated);
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update user.",
      );
    }
  }

  async function runDemoPreset(
    preset: DemoPreset,
    label: string,
  ) {
    const confirmed = window.confirm(
      demoRun
        ? `${label} will remove only the active “${demoRun.label}” demo run and replace it. Genuine records will remain. Continue?`
        : `${label} will add labeled demo records ending ${demoAnchorDate}. Genuine records will remain. Continue?`,
    );
    if (!confirmed) return;

    setDemoBusy(preset);
    setError(null);
    setDemoNotice(null);

    try {
      const result = await applyDemoPreset(preset, demoAnchorDate, demoRun !== null);
      const nextUsers = await getUsers();
      setUsers(nextUsers.users);
      setDemoRun(result.activeRun);
      const summary = result.activeRun?.summary;
      setDemoNotice(
        `${label} ready · ${summary?.parties ?? 0} parties · ${summary?.orders ?? 0} orders · $${Number(summary?.sales ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} completed sales`,
      );
    } catch (demoError) {
      setError(
        demoError instanceof Error
          ? demoError.message
          : "Unable to prepare demo data.",
      );
    } finally {
      setDemoBusy(null);
    }
  }

  async function removeDemoData() {
    if (!demoRun) return;
    const confirmed = window.confirm(
      `Clear “${demoRun.label}”? Only records owned by this demo run will be removed.`,
    );
    if (!confirmed) return;

    setClearingDemo(true);
    setError(null);
    setDemoNotice(null);
    try {
      await clearDemoRun(demoRun.id);
      setDemoRun(null);
      setDemoNotice("Demo records cleared. Genuine records were not changed.");
    } catch (demoError) {
      setError(
        demoError instanceof Error ? demoError.message : "Unable to clear demo data.",
      );
    } finally {
      setClearingDemo(false);
    }
  }

  return (
    <main className="page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">
            Lazy Jane’s / Management
          </p>
          <h1>Users</h1>
          <p>
            People, roles, passwords, and access.
          </p>
        </div>

        <button
          type="button"
          className="button"
          data-variant="primary"
          onClick={openCreate}
        >
          Add User
        </button>
      </header>

      {import.meta.env.DEV ? (
        <section className="dev-demo-controls" data-walkthrough-demo="true">
          <header>
            <div>
              <p className="eyebrow">Development only</p>
              <h2>Demo Data</h2>
            </div>
            <small>Deterministic scenarios using your real menu and workflows.</small>
          </header>

          <div className="dev-demo-toolbar">
            <label>
              <span>Scenario ends</span>
              <input
                type="date"
                value={demoAnchorDate}
                disabled={demoBusy !== null || clearingDemo}
                onChange={(event) => setDemoAnchorDate(event.target.value)}
              />
            </label>
            {demoRun ? (
              <div className="dev-demo-active">
                <span>Active demo</span>
                <strong>{demoRun.label}</strong>
                <small>{demoRun.rangeStart} → {demoRun.rangeEnd}</small>
                <button
                  type="button"
                  className="button"
                  data-variant="danger"
                  disabled={demoBusy !== null || clearingDemo}
                  onClick={() => void removeDemoData()}
                >
                  {clearingDemo ? "Clearing…" : "Clear Demo Data"}
                </button>
              </div>
            ) : (
              <p>No active demo scenario. Genuine records are left in place.</p>
            )}
          </div>

          <div className="dev-demo-grid">
            <button
              type="button"
              disabled={demoBusy !== null || clearingDemo || !demoAnchorDate}
              onClick={() => void runDemoPreset("slow-day", "Slow Day")}
            >
              <strong>Slow Day</strong>
              <span>Light completed sales plus a small live floor, kitchen queue, takeout, checks, and register activity.</span>
            </button>

            <button
              type="button"
              disabled={demoBusy !== null || clearingDemo || !demoAnchorDate}
              onClick={() => void runDemoPreset("mildly-busy-day", "Mildly Busy Day")}
            >
              <strong>Mildly Busy Day</strong>
              <span>A believable normal shift with mixed dine-in, takeout, delivery, kitchen states, and payments.</span>
            </button>

            <button
              type="button"
              disabled={demoBusy !== null || clearingDemo || !demoAnchorDate}
              onClick={() => void runDemoPreset("very-busy-day", "Very Busy Day")}
            >
              <strong>Very Busy Day</strong>
              <span>A packed floor, waiting list, heavy kitchen queue, off-premise orders, checks, and sales history.</span>
            </button>

            <button
              type="button"
              disabled={demoBusy !== null || clearingDemo || !demoAnchorDate}
              onClick={() => void runDemoPreset("busy-week", "Busy Week")}
            >
              <strong>Busy Week</strong>
              <span>Seven dated shifts with weekday variation, a weekend peak, completed sales, and today’s live service.</span>
            </button>

            <button
              type="button"
              disabled={demoBusy !== null || clearingDemo || !demoAnchorDate}
              onClick={() => void runDemoPreset("busy-month", "Busy Month")}
            >
              <strong>Busy Month</strong>
              <span>Thirty dated shifts for reports, trends, payments, operational history, and a live final day.</span>
            </button>
          </div>

          {demoBusy ? <p>Preparing demo…</p> : null}
          {demoNotice ? <p className="notice notice--success">{demoNotice}</p> : null}
        </section>
      ) : null}

      {error && drawerMode === null ? (
        <p className="notice" data-variant="error">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="loading-state">
          Loading users…
        </p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roles</th>
                <th>Status</th>
                <th>Password</th>
                <th aria-label="Actions" />
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={
                    user.isActive
                      ? undefined
                      : "is-muted"
                  }
                >
                  <td>
                    <strong>
                      {user.displayName}
                    </strong>
                  </td>

                  <td>
                    <div className="tag-list">
                      {user.roles.map((role) => (
                        <span
                          className="tag"
                          key={role}
                        >
                          {ROLE_LABELS[role]}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td>
                    <span
                      className="status-badge"
                      data-status={
                        user.isActive
                          ? "active"
                          : "inactive"
                      }
                    >
                      {user.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td>
                    {user.hasPin ? "Set" : "Missing"}
                  </td>

                  <td>
                    <div className="item-actions">
                      <button
                        type="button"
                        className="button"
                        data-variant="quiet"
                        onClick={() =>
                          openEdit(user)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="button"
                        data-variant="quiet"
                        onClick={() =>
                          openPinReset(user)
                        }
                      >
                        Reset Password
                      </button>

                      <button
                        type="button"
                        className="button"
                        data-variant="quiet"
                        onClick={() => {
                          void handleActiveChange(
                            user,
                          );
                        }}
                      >
                        {user.isActive
                          ? "Deactivate"
                          : "Reactivate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {drawerMode ? (
        <Drawer
          ariaLabel={
            drawerMode === "create"
              ? "Add user"
              : drawerMode === "edit"
                ? "Edit user"
                : "Reset Password"
          }
          eyebrow={
            drawerMode === "create"
              ? "New User"
              : selectedUser?.displayName
          }
          title={
            drawerMode === "create"
              ? "Add User"
              : drawerMode === "edit"
                ? "Edit User"
                : "Reset Password"
          }
          onClose={closeDrawer}
          headerAction={
            <button
              type="button"
              className="button"
              data-variant="quiet"
              onClick={closeDrawer}
            >
              Close
            </button>
          }
        >

            {error ? (
              <p
                className="notice"
                data-variant="error"
              >
                {error}
              </p>
            ) : null}

            {drawerMode === "create" ||
            drawerMode === "edit" ? (
              <form
                className="drawer-form"
                onSubmit={
                  drawerMode === "create"
                    ? handleCreate
                    : handleEdit
                }
              >
                <label>
                  <span>Name</span>
                  <input
                    required
                    autoFocus
                    maxLength={200}
                    value={displayName}
                    onChange={(event) =>
                      setDisplayName(
                        event.target.value,
                      )
                    }
                  />
                </label>

                <fieldset>
                  <legend>Roles</legend>

                  <div className="form-grid">
                    {USER_ROLE_CODES.map(
                      (roleCode) => (
                        <label
                          className="checkbox-field"
                          key={roleCode}
                        >
                          <input
                            type="checkbox"
                            checked={roleCodes.includes(
                              roleCode,
                            )}
                            onChange={() =>
                              toggleRole(roleCode)
                            }
                          />
                          <span>
                            {ROLE_LABELS[roleCode]}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                </fieldset>

                {drawerMode === "create" ? (
                  <label>
                    <span>Password</span>
                    <input
                      required
                      autoComplete="new-password"
                      maxLength={72}
                      value={pin}
                      onChange={(event) =>
                        setPin(event.target.value)
                      }
                    />
                  </label>
                ) : null}

                <div className="drawer-actions">
                  <button
                    type="submit"
                    className="button"
                    data-variant="primary"
                    disabled={
                      saving ||
                      roleCodes.length === 0
                    }
                  >
                    {saving
                      ? "Saving…"
                      : drawerMode === "create"
                        ? "Add User"
                        : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <form
                className="drawer-form"
                onSubmit={handlePinReset}
              >
                <label>
                  <span>New Password</span>
                  <input
                    required
                    autoFocus
                    autoComplete="new-password"
                    maxLength={72}
                    value={pin}
                    onChange={(event) =>
                      setPin(event.target.value)
                    }
                  />
                </label>

                <p>
                  Resetting the password signs this
                  user out of all active sessions.
                </p>

                <div className="drawer-actions">
                  <button
                    type="submit"
                    className="button"
                    data-variant="primary"
                    disabled={saving}
                  >
                    {saving
                      ? "Resetting…"
                      : "Reset Password"}
                  </button>
                </div>
              </form>
            )}
        </Drawer>
      ) : null}
    </main>
  );
}
