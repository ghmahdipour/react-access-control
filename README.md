# React Access Control

Type-safe reactive **access control engine** with **React 18 adapter** for managing permissions and role-based access in React projects

✨ ## Features

- 🔒 **Type-safe permissions** full - Typescript interface
- ⚡️ **Reactive engine** - automatic updates via subscription system
- 🔁 **Dynamic Updates** - change roles & permissions at runtime
- ⚛️ **React 18 ready** - built with `useSyncExternalStorage`
- 🧩 **Framework-agnostic core** - works without React
- 📦 **ESM + CJS support** - modern package output
- 🌴 **Tree-shakeable** - optimized for bundlers
- 🖥️ **SSR compatible** - safe for NExt.js and server rendering

---

📦 ## Installation

```bash
npm install react-access-control
# or
yarn add react-access-control
```
---

🚀 ## Quick Start

### 1. Create Access Control

```bash
import { createAccessControl } from "react-access-control";

const access = createAccessControl({
    roles: {
        admin: ["user.create", "user.delete", "user.view"],
        editor: ["user.create", "user.view"],
        viewer: ["user.view"]
    } as const,
    userRoles: ["viewer"]
});
```

---
### 2. Check Permissions

```bash
access.can("user.create") // true
access.can("user.delete") // false
```
---

### 3. Update Roles Dynamically

```bash
access.updateRoles(["admin"]);
access.can("user.delete") // true
```
---

⚛️ ## React Usage

```bash
import { useAccess } from "react-access-control/react";

function MyComponent({ access }: { access: typeof access }) {
    const can = useAccess(access);

    return(<>
        {can("user.view") && <p>Can view users</p>}
        {can("user.create") && <button>Create User</button>}
        {can("user.delete") && <button>Delete User</button>}
    </>)
}
```
---

🧠 ## How It works

- The core engine maintains a permission set 
- Updates trigger a subscription system  
- React hooks uses `useSyncExternalStorage` for optimal rendering
- Components re-render only when permissions change
 
---

🔧 ## API
createAccessControl(config)

### Creates a new access control instance.

#### Config

```md
| Field | Type | Description |
| :--- | :--- | :--- |
| roles | RoleConfig | Roles → permissions mapping |
| :---- | :--- | :---------- |
| userRoles | (keyof roles)[] | Current user roles | 
| :---- | :--- | :---------- |
| userPermissions | string[](optional) | Extra permissions | 

---

### Returned API

```bash
access.can(permission) 
```

#### Check if permission exists

```bash
access.getPermissions()
```

#### Get all resolved permissions(readonly)

```bash
access.updateRoles(roles)
```

#### Update roles dynamically

```bash
access.updatePermissions(permissions)
```

#### Update direct permissions

```bash
access.subscribe(listener)
```

#### Subscribe to changes(used internally by ***React***)

---

🧩 ## Import Structure

```bash
import { createAccessControl } from "react-access-control";
import { useAccess } from "react-access-control/react";
```
---

🧪 ## Example

See full working example
```bash
/examples/react-demo
```
---

📊 ## When to Use

- Admin dashboards
- SaaS role-based systems
- Feature flagging
- Multi-tenant applications
- Complex UI permission logic

---

⚠️ ## When NOT to Use

- Simple boolean flags
- Static permission systems
- Small apps without role complexity

---

🛠️ ## Development 

```bash
npm run dev
npm run build
npm test
npm run typecheck
```
---

🤝 ## Contributing

Contributins are welcome.

- Keep Typescript strict
- Maintain type interface
- Avoid unnecessary abstractions
- Prefer composable APIs

---

⭐️ ## Support

If you find this useful:

- ⭐️ Star the repo
- 🪄 Report issues
- 💡 Suggest improvements