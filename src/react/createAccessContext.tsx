import React, { createContext, useContext, useSyncExternalStore } from "react";
import type { AccessControl, RoleConfig, ExtractPermissions } from '..';

export function createAccessContext<T extends RoleConfig>() {
    const AccessContext = createContext<AccessControl<T> | null>(null);

    function AccessProvider({
        access,
        children
    }: {
        access: AccessControl<T>;
        children: React.ReactNode;
    }) {
        return(
            <AccessContext.Provider value={access}>
                {children}
            </AccessContext.Provider>
        );
    }

    function useAccess<T extends RoleConfig>() {
     
        const store = useContext(AccessContext);
    
        if(!store) {
            throw new Error("useAccess must be used within AccessProvider")
        }

        const permissions = useSyncExternalStore(
            store.subscribe,
            store.getPermissions,
            store.getPermissions
        );
    
        return(permission: ExtractPermissions<T>) => {
            return permissions.includes(permission)
        };
    }

    return {
        AccessProvider,
        useAccess
    }

}    
