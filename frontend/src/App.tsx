import {
  Navigate,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import { Can } from "./components/shared/Can";
import { RequireRoles } from "./components/shared/RequireRoles";
import { useAuth } from "./hooks/useAuth";
import { AuthPage } from "./pages/AuthPage";
import { HomePage } from "./pages/HomePage";
import { KitchenBoardPage } from "./pages/KitchenBoardPage";
import { MenuManagementPage } from "./pages/MenuManagementPage";
import { OrderEntryPage } from "./pages/OrderEntryPage";
import { UsersPage } from "./pages/UsersPage";

export function App() {
  const {
    user,
    isAuthenticated,
    isCheckingSession,
    setAuthenticatedUser,
    logoutUser,
  } = useAuth();

  if (isCheckingSession) {
    return (
      <main className="page">
        <p className="loading-state">
          Loading…
        </p>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <AuthPage
        onAuthenticated={setAuthenticatedUser}
      />
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink className="app-brand" to="/">
          Lazy Jane’s
        </NavLink>

        <nav
          className="app-nav"
          aria-label="Primary navigation"
        >
          <NavLink to="/" end>
            Operations
          </NavLink>

          <Can
            roles={[
              "server",
              "lead_server",
              "manager",
              "admin",
            ]}
          >
            <NavLink to="/orders/new">
              Order Entry
            </NavLink>
          </Can>

          <Can roles={["chef", "head_chef", "manager", "admin"]}>
            <NavLink to="/kitchen">
              Kitchen
            </NavLink>
          </Can>

          <Can roles={["manager", "admin"]}>
            <NavLink to="/menu">
              Menu Management
            </NavLink>
          </Can>

          <Can roles={["admin"]}>
            <NavLink to="/users">
              Users
            </NavLink>
          </Can>
        </nav>

        <div className="app-session">
          <span>{user.displayName}</span>

          <button
            type="button"
            className="button"
            data-variant="quiet"
            onClick={() => {
              void logoutUser();
            }}
          >
            Log Out
          </button>
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/orders/new"
          element={
            <RequireRoles
              roles={[
                "server",
                "lead_server",
                "manager",
                "admin",
              ]}
            >
              <OrderEntryPage />
            </RequireRoles>
          }
        />

        <Route
          path="/kitchen"
          element={
            <RequireRoles
              roles={["chef", "head_chef", "manager", "admin"]}
            >
              <KitchenBoardPage />
            </RequireRoles>
          }
        />

        <Route
          path="/menu"
          element={
            <RequireRoles
              roles={["manager", "admin"]}
            >
              <MenuManagementPage />
            </RequireRoles>
          }
        />

        <Route
          path="/users"
          element={
            <RequireRoles roles={["admin"]}>
              <UsersPage />
            </RequireRoles>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
