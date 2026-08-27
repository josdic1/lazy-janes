import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import type {
  UserLoginOption,
} from "@lazy-janes/shared";
import {
  createInitialAdmin,
  getLoginOptions,
  getSetupStatus,
  login,
} from "../api/auth";

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
  const [options, setOptions] = useState<
    UserLoginOption[]
  >([]);
  const [selectedUserId, setSelectedUserId] =
    useState("");
  const [displayName, setDisplayName] =
    useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(
    null,
  );
  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const setup = await getSetupStatus();

        if (cancelled) {
          return;
        }

        setRequiresSetup(setup.requiresSetup);

        if (!setup.requiresSetup) {
          const loginOptions = await getLoginOptions();

          if (cancelled) {
            return;
          }

          setOptions(loginOptions);
          setSelectedUserId(
            loginOptions[0]?.id ?? "",
          );
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
        userId: admin.id,
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
        userId: selectedUserId,
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
            <select
              required
              value={selectedUserId}
              onChange={(event) =>
                setSelectedUserId(
                  event.target.value,
                )
              }
            >
              {options.map((option) => (
                <option
                  key={option.id}
                  value={option.id}
                >
                  {option.displayName}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Password</span>
            <input
              autoFocus
              required
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
              submitting || !selectedUserId
            }
          >
            {submitting
              ? "Signing In…"
              : "Sign In"}
          </button>
        </form>
      )}
    </main>
  );
}
