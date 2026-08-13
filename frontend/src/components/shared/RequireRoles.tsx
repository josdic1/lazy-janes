import type {
  ReactNode,
} from "react";
import type {
  UserRoleCode,
} from "@lazy-janes/shared";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type RequireRolesProps = {
  roles: readonly UserRoleCode[];
  children: ReactNode;
};

export function RequireRoles({
  roles,
  children,
}: RequireRolesProps) {
  const { user } = useAuth();

  const allowed =
    user !== null &&
    roles.some((role) =>
      user.roles.includes(role),
    );

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}
