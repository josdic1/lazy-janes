import { useEffect, useState } from "react";
import {
  Navigate,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import { Can } from "./components/shared/Can";
import { RequireRoles } from "./components/shared/RequireRoles";
import { BrandLoader } from "./components/ui/BrandLoader";
import { Walkthrough } from "./components/ui/Walkthrough";
import { useAuth } from "./hooks/useAuth";
import { AuthPage } from "./pages/AuthPage";
import { KitchenBoardPage } from "./pages/KitchenBoardPage";
import { MenuManagementPage } from "./pages/MenuManagementPage";
import { OperationsPage } from "./pages/OperationsPage";
import { OrderEntryPage } from "./pages/OrderEntryPage";
import { PosPage } from "./pages/PosPage";
import { UsersPage } from "./pages/UsersPage";

function walkthroughStorageKey(userId: string): string {
  return `lazy-janes.walkthrough.v1.${userId}`;
}

export function App() {
  const {
    user,
    isAuthenticated,
    isCheckingSession,
    setAuthenticatedUser,
    logoutUser,
  } = useAuth();
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setWalkthroughOpen(false);
      return;
    }

    try {
      const complete =
        window.localStorage.getItem(walkthroughStorageKey(user.id)) === "complete";
      setWalkthroughOpen(!complete);
    } catch {
      setWalkthroughOpen(false);
    }
  }, [user?.id]);

  function completeWalkthrough() {
    if (user) {
      try {
        window.localStorage.setItem(walkthroughStorageKey(user.id), "complete");
      } catch {
        // The walkthrough still closes when storage is unavailable.
      }
    }
    setWalkthroughOpen(false);
  }

  if (isCheckingSession) {
    return <BrandLoader label="Opening Lazy Jane’s…" fullscreen />;
  }

  if (!isAuthenticated || !user) {
    return <AuthPage onAuthenticated={setAuthenticatedUser} />;
  }

  const hasServiceRole = user.roles.some((role) =>
    ["host", "server", "lead_server", "manager", "admin"].includes(role),
  );
  const hasKitchenRole = user.roles.some((role) =>
    ["chef", "head_chef"].includes(role),
  );
  const landingPath = hasServiceRole
    ? "/pos"
    : hasKitchenRole
      ? "/kitchen"
      : null;

  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink className="app-brand" to="/" aria-label="Lazy Jane’s Diner home">
          <img
            className="app-brand-logo"
            src="/lazy-janes-logo.svg"
            alt="Lazy Jane’s Diner"
          />
        </NavLink>

        <nav className="app-nav" aria-label="Primary navigation">
          <Can roles={["host", "server", "lead_server", "manager", "admin"]}>
            <NavLink data-tour-route="/pos" to="/pos">POS</NavLink>
          </Can>

          <Can roles={["server", "lead_server", "manager", "admin"]}>
            <NavLink data-tour-route="/orders/new" to="/orders/new">Order Entry</NavLink>
          </Can>

          <Can roles={["chef", "head_chef", "manager", "admin"]}>
            <NavLink data-tour-route="/kitchen" to="/kitchen">Kitchen</NavLink>
          </Can>

          <Can roles={["manager", "admin"]}>
            <NavLink data-tour-route="/operations" to="/operations">Operations</NavLink>
          </Can>

          <Can roles={["manager", "admin"]}>
            <NavLink to="/menu">Menu Management</NavLink>
          </Can>

          <Can roles={["admin"]}>
            <NavLink to="/users">Users</NavLink>
          </Can>
        </nav>

        <div className="app-session">
          <button
            type="button"
            className="button walkthrough-replay"
            data-variant="quiet"
            onClick={() => setWalkthroughOpen(true)}
          >
            Guide
          </button>
          <span>{user.displayName}</span>
          <button
            type="button"
            className="button"
            data-variant="quiet"
            onClick={() => void logoutUser()}
          >
            Log Out
          </button>
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            landingPath ? (
              <Navigate to={landingPath} replace />
            ) : (
              <main className="page">
                <p className="loading-state">No workspace is assigned to this user.</p>
              </main>
            )
          }
        />

        <Route
          path="/pos"
          element={
            <RequireRoles roles={["host", "server", "lead_server", "manager", "admin"]}>
              <PosPage />
            </RequireRoles>
          }
        />

        <Route
          path="/orders/new"
          element={
            <RequireRoles roles={["server", "lead_server", "manager", "admin"]}>
              <OrderEntryPage />
            </RequireRoles>
          }
        />

        <Route
          path="/kitchen"
          element={
            <RequireRoles roles={["chef", "head_chef", "manager", "admin"]}>
              <KitchenBoardPage />
            </RequireRoles>
          }
        />

        <Route
          path="/operations"
          element={
            <RequireRoles roles={["manager", "admin"]}>
              <OperationsPage />
            </RequireRoles>
          }
        />

        <Route
          path="/menu"
          element={
            <RequireRoles roles={["manager", "admin"]}>
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

      <Walkthrough
        open={walkthroughOpen}
        userId={user.id}
        roles={user.roles}
        onComplete={completeWalkthrough}
      />
    </div>
  );
}
