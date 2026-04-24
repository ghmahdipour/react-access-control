import { useSyncExternalStore } from "react";
import type { AccessControl, RoleConfig } from "..";

export function useAccess<T extends RoleConfig>(
    access: AccessControl<T>
) {
    const permissions = useSyncExternalStore(
        access.subscribe,
        access.getPermissions,
        access.getPermissions
    );

    return(permission: T[keyof T][number]) => {
        return permissions.includes(permission)
    };
}