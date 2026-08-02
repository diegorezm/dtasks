import { describe, expect, it } from "vitest";
import {
	canInviteRole,
	canManageMemberRole,
	hasPermission,
	permissionsByRole,
	workspacePermissions,
	workspaceRoles,
} from "../../../convex/lib/permissions";

describe("workspace permissions", () => {
	it("defines a permission set for every workspace role", () => {
		expect(Object.keys(permissionsByRole).sort()).toEqual(
			[...workspaceRoles].sort(),
		);
	});

	it("gives the owner every permission", () => {
		expect(permissionsByRole.owner).toEqual(workspacePermissions);
	});

	it("keeps viewers read-only", () => {
		expect(hasPermission("viewer", "projects.view")).toBe(true);
		expect(hasPermission("viewer", "tasks.view")).toBe(true);
		expect(hasPermission("viewer", "projects.create")).toBe(false);
		expect(hasPermission("viewer", "tasks.move")).toBe(false);
	});

	it("lets members contribute without administering the workspace", () => {
		expect(hasPermission("member", "projects.create")).toBe(true);
		expect(hasPermission("member", "tasks.delete")).toBe(true);
		expect(hasPermission("member", "projects.archive")).toBe(false);
		expect(hasPermission("member", "members.invite")).toBe(false);
	});

	it("reserves ownership transfer for the owner", () => {
		expect(hasPermission("owner", "ownership.transfer")).toBe(true);
		expect(hasPermission("admin", "ownership.transfer")).toBe(false);
	});
});

describe("workspace role hierarchy", () => {
	it("lets owners manage every non-owner role", () => {
		expect(canManageMemberRole("owner", "admin", "viewer")).toBe(true);
		expect(canManageMemberRole("owner", "member", "admin")).toBe(true);
		expect(canManageMemberRole("owner", "owner", "admin")).toBe(false);
	});

	it("limits admins to members and viewers", () => {
		expect(canManageMemberRole("admin", "member", "viewer")).toBe(true);
		expect(canManageMemberRole("admin", "viewer", "member")).toBe(true);
		expect(canManageMemberRole("admin", "admin", "member")).toBe(false);
		expect(canManageMemberRole("admin", "member", "admin")).toBe(false);
	});

	it("applies the invitation hierarchy", () => {
		expect(canInviteRole("owner", "admin")).toBe(true);
		expect(canInviteRole("admin", "member")).toBe(true);
		expect(canInviteRole("admin", "viewer")).toBe(true);
		expect(canInviteRole("admin", "admin")).toBe(false);
		expect(canInviteRole("member", "member")).toBe(false);
	});
});
