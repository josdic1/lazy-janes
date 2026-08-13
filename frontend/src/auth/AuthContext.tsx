import {
  createContext,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import type {
  UserIdentity,
} from "@lazy-janes/shared";
import {
  getCurrentUser,
  logout,
} from "../api/auth";

export type AuthContextValue = {
  user: UserIdentity | null;
  isAuthenticated: boolean;
  isCheckingSession: boolean;
  setAuthenticatedUser: (
    user: UserIdentity,
  ) => void;
  logoutUser: () => Promise<void>;
};

export const AuthContext =
  createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<UserIdentity | null>(null);
  const [isCheckingSession, setIsCheckingSession] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const currentUser =
          await getCurrentUser();

        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsCheckingSession(false);
        }
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  function setAuthenticatedUser(
    authenticatedUser: UserIdentity,
  ) {
    setUser(authenticatedUser);
  }

  async function logoutUser() {
    await logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isCheckingSession,
        setAuthenticatedUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
