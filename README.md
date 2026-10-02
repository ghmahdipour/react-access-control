# React Access Control

Type-safe reactive **access control engine** with **React 18+ adapter** for managing permissions and role-based access in React applications.

## ✨ Features

- 🔒 **Type-safe permissions** - Permissions are inferred from your role configuration
- ⚡️ **Reactive engine** - Subscribe to permission changes and react to updates automatically
- 🔁 **Dynamic updates** - Change roles and direct permissions at runtime
- ⚛️ **React 18+** - Built with `useSyncExternalStore`
- 🧩 **Framework-agnostic core** - Use the core engine without React
- 📦 **ESM + CJS support** - Compatible with modern and CommonJS environments
- 🌴 **Tree-shakeable** - Optimized for modern bundlers
- 🖥️ **SSR compatible** - Uses `useSyncExternalStore` and can be used in SSR applications with appropriate client/server boundaries.

##  📦 Installation

```bash
npm install react-access-control
```

## 🚀 Quick Start

### 1. Create Access Control

Define your roles and permissions:

```ts
    import { createAccessControl } from "react-access-control";

    const roles = {
        admin: ["user.create", "user.delete", "user.view"],
        editor: ["user.create", "user.view"],
        viewer: ["user.view"]
    } as const;

    const access = createAccessControl({
        roles,
        userRoles: ["viewer"]
    });
```

### 2. Check Permissions

```ts
access.can("user.create"); // false
access.can("user.view"); // true
```

### 3. Update Roles Dynamically

Roles can be changed at runtime:

```ts
access.updateRoles(["admin"]);
access.can("user.delete") // true
```

### 4. Add Direct Permissions

Users can also have permissions that are not provided by their roles.

```ts
    const access = createAccessControl({
        roles,
        userRoles: ["viewer"],
        userPermissions: ["user.create"],
    });

    access.can("user.create"); // true
```

## ⚛️ React Usage

### Step 1 - Create a Typed Context

```ts
import { createAccessContext } from "react-access-control/react";

const { AccessProvider, useAccess } = createAccessContext<typeof roles>();
```

### Step 2 - Wrap Your App

```tsx
    <AccessProvider access={access}>
        <App />
    </AccessProvider>
```

### Step 3 - Check Permissions in Components

```tsx              
function UserActions() {
    const can = useAccess();

    return(
        <>
            {can("user.view") && <p>Can view users</p>}
            {can("user.create") && <button>Create User</button>}
            {can("user.delete") && <button>Delete User</button>}
        </>)
}
```

## 🧠 How It Works

- The core engine maintains a computed permission set based on roles and direct permissions.
- Updates trigger the subscription system.
- React uses `useSyncExternalStore` for reactive updates.
- Subscribers are notified **only when the resolved permissions actually change**

## 🔧 API

### `createAccessControl(config)`

Creates a new access control instance.

#### Config

| Field | Type | Description |
| :--- | :--- | :--- |
| `roles` | `RoleConfig` | Mapping of roles to permissions |
| `userRoles` | `(keyof T)[]` | Current user roles | 
| `userPermissions` | `readonly ExtractPermissions<T>[]` (optional) | Additional direct permissions | 

#### Returned API

#### `access.can(permission)`

Checks whether the user has a permission.

```ts
access.can("user.create");
```

#### ‍‍‍‍`access.getPermissions()`

Returns the current resolved permissions.

```ts
access.getPermissions();
```

#### `access.updateRoles(roles)`

Updates the user's roles dynamically.

```ts
access.updateRoles(["admin"]);
```

Subscribers are notified only if the resulting permission set changes.

#### `access.updatePermissions(permissions)`

Updates the user's direct permissions.

```ts
access.updatePermissions(["user.create"]);
```

Subscribers are notified only if the resulting permission set changes.

#### `access.subscribe(listener)`

Subscribes to access-control changes.

The returned function can be used to unsubscribe the listener:

```ts
const unsubscribe = access.subscribe(() => {
    console.log("Permissions changed");
});

unsubscribe();
```

## 🧩 Import Structure

```ts
import { createAccessControl } from "react-access-control";
import { createAccessContext } from "react-access-control/react";
```

The core package can be used independently of React, while the `/react` entry point provides the React adapter.

## 📊 When to Use

- Admin dashboards
- SaaS role-based systems
- Feature access and UI gating
- Multi-tenant applications
- Applications with dynamic permission changes

## ⚠️ When NOT to Use

- Simple boolean feature flags
- Fully static permission systems
- Small applications without role or permission complexity

## 🛠️ Development 

```bash
npm run dev
npm run build
npm test
npm run typecheck
```

## 🤝 Contributing

Contributions are welcome.

Please follow these guidelines:

- Keep TypeScript strict
- Maintain type safety
- Avoid unnecessary abstractions
- Prefer composable APIs
- Add tests for new behavior

## ⭐️ Support

If you find this useful:

- ⭐️ Star the repository
- 🪄 Report issues
- 💡 Suggest improvements
