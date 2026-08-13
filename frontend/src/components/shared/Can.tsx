import type {
  ReactNode,
} from "react";
import type {
  UserRoleCode,
} from "@lazy-janes/shared";
import { useAuth } from "../../hooks/useAuth";

type CanProps = {
  roles: readonly UserRoleCode[];
  children: ReactNode;
};

export function Can({
  roles,
  children,
}: CanProps) {
  const { user } = useAuth();

  if (
    !user ||
    !roles.some((role) =>
      user.roles.includes(role),
    )
  ) {
    return null;
  }

  return children;
}
