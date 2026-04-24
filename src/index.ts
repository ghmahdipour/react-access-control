export type RoleConfig = Record<
    string, 
    readonly string[]
>;

// Extract all permissions from roles
export type ExtractPermissions<T extends RoleConfig> = T[keyof T][number];

export type Listener = () => void;

export interface AccessControl<T extends RoleConfig> {
    can: (permission: ExtractPermissions<T>) => boolean;
    getPermissions: () => readonly ExtractPermissions<T>[];
    updateRoles: (roles: (keyof T)[]) => void;
    updatePermissions: (
        Permission: readonly ExtractPermissions<T>[]
    ) => void;
    subscribe: (listener: Listener) => () => void;
}

function resolvePermissions<T extends RoleConfig>(
    roles: T,
    userRoles: (keyof T)[],
    userPermissions?: readonly ExtractPermissions<T>[]
): Set<string> {
    const permissionSet = new Set<string>();

     // Collect role permissions
     for(const role of userRoles) {
        for(const permission of roles[role]) {
            permissionSet.add(permission)
        }
    }

    // Add direct permissions
    if(userPermissions) {
        for(const permission of userPermissions) {
            permissionSet.add(permission)
        }
    }

    return permissionSet;
}

export function createAccessControl<T extends RoleConfig>(config: {
    roles: T;
    userRoles: (keyof T)[];
    userPermissions?: readonly ExtractPermissions<T>[];
}): AccessControl<T> {

    let currentRoles = [...config.userRoles];
    let currentPermissions = config.userPermissions
        ? [...config.userPermissions]
        : [];

    let permissionSet = resolvePermissions(
        config.roles,
        config.userRoles,
        config.userPermissions
    );

    const listeners = new Set<Listener>()

    function notify() {
        for(const listener of listeners) {
            listener();
        }
    }

    function reCompute() {
        permissionSet = resolvePermissions(
            config.roles,
            currentRoles,
            currentPermissions
        );
        notify();
    }

    return {
        can(permission) { return permissionSet.has(permission) },
        getPermissions() { return Object.freeze(Array.from(permissionSet)) as readonly ExtractPermissions<T>[] },
        updateRoles(roles) {
            currentRoles = [...roles];
            reCompute();
        },
        updatePermissions(permissions) {
            currentPermissions = [...permissions];
            reCompute();
        },

        subscribe(listener) {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            }
        }
        
    }
}


