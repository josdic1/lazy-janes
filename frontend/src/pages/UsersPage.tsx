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
  clearAllExceptAdmin,
  loadSampleActivity,
  preloadAdminData,
  type AdminPreloadKind,
  type AdminSamplePreset,
} from "../api/adminData";

const ROLE_LABELS: Record<UserRoleCode, string> = {
  host: "Host",
  server: "Server",
  lead_server: "Lead Server",
  chef: "Chef",
  head_chef: "Head Chef",
  manager: "Manager",
  admin: "Admin",
};

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
  const [seedBusy, setSeedBusy] = useState<string | null>(null);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      try {
        const result = await getUsers();

        if (!cancelled) {
          setUsers(result.users);
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

  async function refreshUsers() {
    const nextUsers = await getUsers();
    setUsers(nextUsers.users);
  }

  function browserDate(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
  }

  async function runSeedAction(
    key: string,
    work: () => Promise<{ message: string }>,
  ) {
    setSeedBusy(key);
    setError(null);
    setSeedNotice(null);

    try {
      const result = await work();
      await refreshUsers();
      setSeedNotice(result.message);
    } catch (seedError) {
      setError(
        seedError instanceof Error
          ? seedError.message
          : "Unable to update project data.",
      );
    } finally {
      setSeedBusy(null);
    }
  }

  async function resetProjectData() {
    const confirmed = window.confirm(
      "Clear ALL Except Admin permanently deletes menu, staff, tables, orders, payments, reports/history, and sample data. Your current Admin login is kept. Continue?",
    );
    if (!confirmed) return;

    await runSeedAction("reset", clearAllExceptAdmin);
  }

  async function preload(kind: AdminPreloadKind) {
    await runSeedAction(`preload-${kind}`, () => preloadAdminData(kind));
  }

  async function loadSample(preset: AdminSamplePreset) {
    await runSeedAction(`sample-${preset}`, () =>
      loadSampleActivity(preset, browserDate()),
    );
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

      <section className="admin-seed-controls" data-walkthrough-demo="true">
        <header>
          <div>
            <p className="eyebrow">Admin only</p>
            <h2>Seed Data</h2>
          </div>
          <small>Start empty, then load only what you need.</small>
        </header>

        <div className="admin-seed-section">
          <div className="admin-seed-section-heading">
            <strong>Reset</strong>
            <span>Return to a true empty project.</span>
          </div>
          <div className="admin-seed-grid admin-seed-grid--reset">
            <button
              type="button"
              data-variant="danger"
              disabled={seedBusy !== null}
              onClick={() => void resetProjectData()}
            >
              <strong>Clear ALL Except Admin</strong>
              <span>Deletes all project data and keeps only your current Admin account.</span>
            </button>
          </div>
        </div>

        <div className="admin-seed-section">
          <div className="admin-seed-section-heading">
            <strong>Preload</strong>
            <span>Load the foundation independently.</span>
          </div>
          <div className="admin-seed-grid">
            <button
              type="button"
              disabled={seedBusy !== null}
              onClick={() => void preload("menu")}
            >
              <strong>Menu</strong>
              <span>Canonical Lazy Jane’s menu and menu composition data.</span>
            </button>
            <button
              type="button"
              disabled={seedBusy !== null}
              onClick={() => void preload("staff")}
            >
              <strong>Staff</strong>
              <span>Four sample staff accounts for host, server, kitchen, and manager.</span>
            </button>
            <button
              type="button"
              disabled={seedBusy !== null}
              onClick={() => void preload("tables")}
            >
              <strong>Tables</strong>
              <span>Canonical Ritz floor, rooms, and tables.</span>
            </button>
          </div>
        </div>

        <div className="admin-seed-section">
          <div className="admin-seed-section-heading">
            <strong>Populate Demo</strong>
            <span>One click loads Menu, Staff, Tables, and the selected sample activity.</span>
          </div>
          <div className="admin-seed-grid">
            <button
              type="button"
              disabled={seedBusy !== null}
              onClick={() => void loadSample("slow-day")}
            >
              <strong>Slow Day</strong>
              <span>Light sales, a small live floor, kitchen work, checks, and register activity.</span>
            </button>
            <button
              type="button"
              disabled={seedBusy !== null}
              onClick={() => void loadSample("very-busy-day")}
            >
              <strong>Busy Day</strong>
              <span>A packed floor, waiting list, kitchen queue, payments, and live service.</span>
            </button>
            <button
              type="button"
              disabled={seedBusy !== null}
              onClick={() => void loadSample("slow-week")}
            >
              <strong>Slow Week</strong>
              <span>Seven quieter days for reports and trends, ending with today’s live service.</span>
            </button>
            <button
              type="button"
              disabled={seedBusy !== null}
              onClick={() => void loadSample("busy-week")}
            >
              <strong>Busy Week</strong>
              <span>Seven busier days with a weekend peak, completed sales, and live service.</span>
            </button>
          </div>
        </div>

        {seedBusy ? <p>Working…</p> : null}
        {seedNotice ? <p className="notice notice--success">{seedNotice}</p> : null}
      </section>

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
