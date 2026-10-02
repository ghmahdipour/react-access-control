/** @vitest-environment jsdom */

import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { createAccessControl } from "../index";
import { createAccessContext } from "./createAccessContext";

afterEach(() => {
    cleanup();
});

const roles = {
    admin: ["user.read", "user.delete"],
    editor: ["user.read"],
} as const;

const { AccessProvider, useAccess } =
    createAccessContext<typeof roles>();

describe("createAccessContext", () => {
    it("should provide access checks through React context", () => {
        const access = createAccessControl({
            roles,
            userRoles: ["editor"],
        });

        function TestComponent() {
            const can = useAccess();

            return (
                <div>
                    <span data-testid="read">
                        {can("user.read") ? "yes" : "no"}
                    </span>

                    <span data-testid="delete">
                        {can("user.delete") ? "yes" : "no"}
                    </span>
                </div>
            );
        }

        render(
            <AccessProvider access={access}>
                <TestComponent />
            </AccessProvider>
        );

        expect(screen.getByTestId("read").textContent).toBe("yes");
        expect(screen.getByTestId("delete").textContent).toBe("no");
    });

    it("should update when roles change", () => {
        const access = createAccessControl({
            roles,
            userRoles: ["editor"],
        });

        function TestComponent() {
            const can = useAccess();

            return (
                <span data-testid="delete">
                    {can("user.delete") ? "yes" : "no"}
                </span>
            );
        }

        render(
            <AccessProvider access={access}>
                <TestComponent />
            </AccessProvider>
        );

        expect(screen.getByTestId("delete").textContent).toBe("no");

        act(() => {
            access.updateRoles(["admin"]);
        });
        
        expect(screen.getByTestId("delete").textContent).toBe("yes");
    });

    it("should throw when used outside AccessProvider", () => {
        function TestComponent() {
            const can = useAccess();

            return (
                <span>
                    {can("user.read") ? "yes" : "no"}
                </span>
            );
        }

        expect(() => render(<TestComponent />)).toThrow(
            "useAccess must be used within AccessProvider"
        );
    });
});