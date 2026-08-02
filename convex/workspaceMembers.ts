import { v } from "convex/values";
import { mutation } from "./_generated/server";
import {
	fail,
	requirePermission,
	requireWorkspaceMember,
} from "./lib/authorization";
import { canManageMemberRole } from "./lib/permissions";

const assignableRole = v.union(
	v.literal("admin"),
	v.literal("member"),
	v.literal("viewer"),
);

export const updateRole = mutation({
	args: {
		workspaceId: v.id("workspaces"),
		membershipId: v.id("workspaceMembers"),
		role: assignableRole,
	},
	handler: async (ctx, args) => {
		const { user, membership: actor } = await requirePermission(
			ctx,
			args.workspaceId,
			"members.manage",
		);
		const target = await ctx.db.get(args.membershipId);
		if (!target || target.workspaceId !== args.workspaceId) fail("NOT_FOUND");
		if (target.userId === user._id) fail("CONFLICT");
		if (!canManageMemberRole(actor.role, target.role, args.role))
			fail("FORBIDDEN");
		if (target.role === args.role) return;
		await ctx.db.patch(args.membershipId, { role: args.role });
	},
});

export const remove = mutation({
	args: {
		workspaceId: v.id("workspaces"),
		membershipId: v.id("workspaceMembers"),
	},
	handler: async (ctx, args) => {
		const { user, membership: actor } = await requirePermission(
			ctx,
			args.workspaceId,
			"members.manage",
		);
		const target = await ctx.db.get(args.membershipId);
		if (!target || target.workspaceId !== args.workspaceId) fail("NOT_FOUND");
		if (target.userId === user._id) fail("CONFLICT");
		if (!canManageMemberRole(actor.role, target.role)) fail("FORBIDDEN");
		await ctx.db.delete(args.membershipId);
	},
});

export const leave = mutation({
	args: { workspaceId: v.id("workspaces") },
	handler: async (ctx, args) => {
		const { membership } = await requireWorkspaceMember(ctx, args.workspaceId);
		if (membership.role === "owner") fail("OWNER_TRANSFER_REQUIRED");
		await ctx.db.delete(membership._id);
	},
});

export const transferOwnership = mutation({
	args: {
		workspaceId: v.id("workspaces"),
		membershipId: v.id("workspaceMembers"),
	},
	handler: async (ctx, args) => {
		const { user, membership: owner } = await requirePermission(
			ctx,
			args.workspaceId,
			"ownership.transfer",
		);
		const target = await ctx.db.get(args.membershipId);
		if (!target || target.workspaceId !== args.workspaceId) fail("NOT_FOUND");
		if (target.userId === user._id || target.role === "owner") fail("CONFLICT");
		await ctx.db.patch(target._id, { role: "owner" });
		await ctx.db.patch(owner._id, { role: "admin" });
	},
});
