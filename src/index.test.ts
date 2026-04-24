import { describe, it, expect, vi } from "vitest";
import { createAccessControl } from ".";

describe("createAccessControl", () => {
    const access = createAccessControl({
        roles: { 
            admin: ["user.create", "user.delete"],
            editor: ["user.create"]
        } as const,
        userRoles: ["admin"]
    });

    it("should allow valid permission", () => {
        expect(access.can("user.delete")).toBe(true);
    });

    it("should allow inherited permission", () => {
        expect(access.can("user.create")).toBe(true);
    });

    it("sould update roles dynamically", () => {
        const access = createAccessControl({
            roles: {
                admin: ["user.create", "user.delete"],
                editor: ["user.create"]
            } as const,
            userRoles: ["editor"]
        });

        expect(access.can("user.delete")).toBe(false);
        access.updateRoles(["admin"]);
        expect(access.can("user.delete")).toBe(true);
    });

    it("sould notify subscribers on update", () => {
        const access = createAccessControl({
            roles: {
                admin: ["user.create"],
                editor: []
            } as const,
            userRoles: ["editor"]
        });

        const mock = vi.fn();

        access.subscribe(mock);
        access.updateRoles(["admin"]);
        expect(mock).toHaveBeenCalled();
    })
})