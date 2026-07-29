import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
	fail,
	normalizeEmail,
	requireAuthUser,
	requirePermission,
} from "./lib/authorization";

const week = 7 * 24 * 60 * 60 * 1000;

export const getPublic = query({
	args: { invitationId: v.id("workspaceInvitations") },
	handler: async (ctx, args) => {
		const invitation = await ctx.db.get(args.invitationId);
		if (!invitation) return null;
		const workspace = await ctx.db.get(invitation.workspaceId);
		return {
			workspaceName: workspace?.name ?? "",
			status: invitation.status,
			expired: invitation.expiresAt <= Date.now(),
		};
	},
});
export const list = query({
	args: { workspaceId: v.id("workspaces") },
	handler: async (ctx, args) => {
		await requirePermission(ctx, args.workspaceId, "manageInvitations");
		return ctx.db
			.query("workspaceInvitations")
			.withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
			.collect();
	},
});
export const create = mutation({
	args: { workspaceId: v.id("workspaces"), email: v.string() },
	handler: async (ctx, args) => {
		const { user } = await requirePermission(
			ctx,
			args.workspaceId,
			"manageInvitations",
		);
		const email = normalizeEmail(args.email);
		const existing = await ctx.db
			.query("workspaceMembers")
			.withIndex("by_workspace_user", (q) =>
				q.eq("workspaceId", args.workspaceId).eq("userId", user._id),
			)
			.unique();
		if (existing && user.email?.toLowerCase() === email) fail("CONFLICT");
		const pending = await ctx.db
			.query("workspaceInvitations")
			.withIndex("by_workspace_email", (q) =>
				q.eq("workspaceId", args.workspaceId).eq("email", email),
			)
			.filter((q) => q.eq(q.field("status"), "pending"))
			.first();
		if (pending) fail("CONFLICT");
		return ctx.db.insert("workspaceInvitations", {
			workspaceId: args.workspaceId,
			email,
			role: "member",
			invitedBy: user._id,
			status: "pending",
			expiresAt: Date.now() + week,
		});
	},
});
export const revoke = mutation({
	args: { invitationId: v.id("workspaceInvitations") },
	handler: async (ctx, args) => {
		const invitation = await ctx.db.get(args.invitationId);
		if (!invitation) fail("NOT_FOUND");
		await requirePermission(ctx, invitation.workspaceId, "manageInvitations");
		if (invitation.status !== "pending") fail("CONFLICT");
		await ctx.db.patch(args.invitationId, { status: "revoked" });
	},
});
export const accept = mutation({
	args: { invitationId: v.id("workspaceInvitations") },
	handler: async (ctx, args) => {
		const user = await requireAuthUser(ctx);
		const invitation = await ctx.db.get(args.invitationId);
		if (!invitation) fail("NOT_FOUND");
		if (invitation.expiresAt <= Date.now()) fail("EXPIRED_INVITATION");
		if (invitation.status !== "pending") fail("CONFLICT");
		if (normalizeEmail(user.email ?? "") !== invitation.email)
			fail("FORBIDDEN");
		const membership = await ctx.db
			.query("workspaceMembers")
			.withIndex("by_workspace_user", (q) =>
				q.eq("workspaceId", invitation.workspaceId).eq("userId", user._id),
			)
			.unique();
		if (membership) fail("CONFLICT");
		await ctx.db.insert("workspaceMembers", {
			workspaceId: invitation.workspaceId,
			userId: user._id,
			role: "member",
		});
		await ctx.db.patch(args.invitationId, {
			status: "accepted",
			acceptedBy: user._id,
		});
		return invitation.workspaceId;
	},
});
