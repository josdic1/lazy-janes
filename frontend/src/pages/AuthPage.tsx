import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import {
  createInitialAdmin,
  getSetupStatus,
  login,
} from "../api/auth";
import {
  devLogin,
  getDevUsers,
  type DevUser,
} from "../api/dev";

type AuthPageProps = {
  onAuthenticated: (
    user: Awaited<ReturnType<typeof login>>,
  ) => void;
};

export function AuthPage({
  onAuthenticated,
}: AuthPageProps) {
  const [loading, setLoading] = useState(true);
  const [requiresSetup, setRequiresSetup] =
    useState(false);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] =
    useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(
    null,
  );
  const [submitting, setSubmitting] =
    useState(false);
  const [devUsers, setDevUsers] = useState<DevUser[]>([]);
  const [devBusyUserId, setDevBusyUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const setup = await getSetupStatus();

        if (cancelled) {
          return;
        }

        setRequiresSetup(setup.requiresSetup);

        if (import.meta.env.DEV && !setup.requiresSetup) {
          try {
            const users = await getDevUsers();
            if (!cancelled) setDevUsers(users);
          } catch {
            if (!cancelled) setDevUsers([]);
          }
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load login.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSetup(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const admin = await createInitialAdmin({
        displayName,
        pin,
      });

      const authenticated = await login({
        username: admin.displayName,
        pin,
      });

      onAuthenticated(authenticated);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create administrator.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogin(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const authenticated = await login({
        username,
        pin,
      });

      onAuthenticated(authenticated);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to log in.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDevLogin(userId: string) {
    setError(null);
    setDevBusyUserId(userId);

    try {
      const authenticated = await devLogin(userId);
      onAuthenticated(authenticated);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to use development login.",
      );
    } finally {
      setDevBusyUserId(null);
    }
  }

  const devGroups = import.meta.env.DEV
    ? [
        {
          label: "Admins",
          users: devUsers.filter((user) => user.roles.includes("admin")),
        },
        {
          label: "Management",
          users: devUsers.filter(
            (user) =>
              !user.roles.includes("admin") &&
              user.roles.some((role) =>
                ["manager", "lead_server", "head_chef"].includes(role),
              ),
          ),
        },
        {
          label: "Staff",
          users: devUsers.filter(
            (user) =>
              !user.roles.includes("admin") &&
              !user.roles.some((role) =>
                ["manager", "lead_server", "head_chef"].includes(role),
              ),
          ),
        },
      ].filter((group) => group.users.length > 0)
    : [];

  if (loading) {
    return (
      <main className="page">
        <p className="loading-state">Loading…</p>
      </main>
    );
  }

  return (
    <main className="page auth-page">
      <header className="page-heading">
        <p className="eyebrow">
          Lazy Jane’s / Access
        </p>
        <h1>
          {requiresSetup
            ? "Initial Setup"
            : "Sign In"}
        </h1>
      </header>

      {error ? (
        <p className="notice" data-variant="error">
          {error}
        </p>
      ) : null}

      {requiresSetup ? (
        <form
          className="drawer-form"
          onSubmit={handleSetup}
        >
          <label>
            <span>Name</span>
            <input
              autoFocus
              required
              maxLength={200}
              value={displayName}
              onChange={(event) =>
                setDisplayName(event.target.value)
              }
            />
          </label>

          <label>
            <span>Password</span>
            <input
              required
              type="password"
              autoComplete="new-password"
              maxLength={72}
              value={pin}
              onChange={(event) =>
                setPin(event.target.value)
              }
            />
          </label>

          <button
            className="button"
            data-variant="primary"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Creating…"
              : "Create Admin"}
          </button>
        </form>
      ) : (
        <form
          className="drawer-form"
          onSubmit={handleLogin}
        >
          <label>
            <span>Username</span>
            <input
              autoFocus
              required
              autoComplete="username"
              maxLength={200}
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
            />
          </label>

          <label>
            <span>Password</span>
            <input
              required
              type="password"
              autoComplete="current-password"
              maxLength={72}
              value={pin}
              onChange={(event) =>
                setPin(event.target.value)
              }
            />
          </label>

          <button
            className="button"
            data-variant="primary"
            type="submit"
            disabled={
              submitting || !username.trim()
            }
          >
            {submitting
              ? "Signing In…"
              : "Sign In"}
          </button>
        </form>
      )}

      {import.meta.env.DEV && !requiresSetup && devGroups.length > 0 ? (
        <aside className="dev-login-switcher" aria-label="Development login">
          <header>
            <strong>DEV LOGIN</strong>
            <small>Live database users · development only</small>
          </header>

          {devGroups.map((group) => (
            <section key={group.label}>
              <span>{group.label}</span>
              <div>
                {group.users.map((user) => (
                  <button
                    type="button"
                    key={user.id}
                    disabled={devBusyUserId !== null}
                    onClick={() => void handleDevLogin(user.id)}
                  >
                    {devBusyUserId === user.id ? "Signing in…" : user.displayName}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </aside>
      ) : null}
    </main>
  );
}
