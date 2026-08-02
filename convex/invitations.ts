import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import {
	fail,
	normalizeEmail,
	requireAuthUser,
	requirePermission,
} from "./lib/authorization";
import { canInviteRole } from "./lib/permissions";

const week = 7 * 24 * 60 * 60 * 1000;
const invitationRole = v.union(
	v.literal("admin"),
	v.literal("member"),
	v.literal("viewer"),
);

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
		await requirePermission(ctx, args.workspaceId, "members.invite");
		return ctx.db
			.query("workspaceInvitations")
			.withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
			.collect();
	},
});
export const create = mutation({
	args: {
		workspaceId: v.id("workspaces"),
		email: v.string(),
		role: invitationRole,
	},
	handler: async (ctx, args) => {
		const { user, membership } = await requirePermission(
			ctx,
			args.workspaceId,
			"members.invite",
		);
		if (!canInviteRole(membership.role, args.role)) fail("FORBIDDEN");
		const email = normalizeEmail(args.email);
		const members = await ctx.db
			.query("workspaceMembers")
			.withIndex("by_workspace_user", (q) =>
				q.eq("workspaceId", args.workspaceId),
			)
			.collect();
		for (const member of members) {
			const memberUser = await authComponent.getAnyUserById(ctx, member.userId);
			if (memberUser?.email?.toLowerCase() === email) fail("CONFLICT");
		}
		const pending = await ctx.db
			.query("workspaceInvitations")
			.withIndex("by_workspace_email", (q) =>
				q.eq("workspaceId", args.workspaceId).eq("email", email),
			)
			.filter((q) => q.eq(q.field("status"), "pending"))
			.first();
		if (pending && pending.expiresAt > Date.now()) fail("CONFLICT");
		if (pending) await ctx.db.patch(pending._id, { status: "revoked" });
		return ctx.db.insert("workspaceInvitations", {
			workspaceId: args.workspaceId,
			email,
			role: args.role,
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
		const { membership } = await requirePermission(
			ctx,
			invitation.workspaceId,
			"members.invite",
		);
		if (!canInviteRole(membership.role, invitation.role)) fail("FORBIDDEN");
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
			role: invitation.role,
		});
		await ctx.db.patch(args.invitationId, {
			status: "accepted",
			acceptedBy: user._id,
		});
		return invitation.workspaceId;
	},
});
