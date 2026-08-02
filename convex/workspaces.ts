import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import {
	normalizeText,
	requireAuthUser,
	requirePermission,
} from "./lib/authorization";
import { hasPermission, permissionsByRole } from "./lib/permissions";

export const listMine = query({
	args: {},
	handler: async (ctx) => {
		const user = await requireAuthUser(ctx);
		const memberships = await ctx.db
			.query("workspaceMembers")
			.withIndex("by_user", (q) => q.eq("userId", user._id))
			.collect();
		return Promise.all(
			memberships.map(async (membership) => ({
				...(await ctx.db.get(membership.workspaceId)),
				role: membership.role,
			})),
		);
	},
});

export const get = query({
	args: { workspaceId: v.id("workspaces") },
	handler: async (ctx, args) => {
		await requirePermission(ctx, args.workspaceId, "workspace.view");
		return ctx.db.get(args.workspaceId);
	},
});

export const getMyAccess = query({
	args: { workspaceId: v.id("workspaces") },
	handler: async (ctx, args) => {
		const { user, membership } = await requirePermission(
			ctx,
			args.workspaceId,
			"workspace.view",
		);
		return {
			userId: user._id,
			membershipId: membership._id,
			role: membership.role,
			permissions: permissionsByRole[membership.role],
		};
	},
});

export const listMembers = query({
	args: { workspaceId: v.id("workspaces") },
	handler: async (ctx, args) => {
		await requirePermission(ctx, args.workspaceId, "members.view");
		const members = await ctx.db
			.query("workspaceMembers")
			.withIndex("by_workspace_user", (q) =>
				q.eq("workspaceId", args.workspaceId),
			)
			.collect();
		return Promise.all(
			members.map(async (member) => {
				const user = await authComponent.getAnyUserById(ctx, member.userId);
				return {
					membershipId: member._id,
					id: member.userId,
					name: user?.name ?? null,
					email: user?.email ?? null,
					image: user?.image ?? null,
					role: member.role,
					canBeAssigned: hasPermission(member.role, "tasks.update"),
				};
			}),
		);
	},
});

export const create = mutation({
	args: { name: v.string() },
	handler: async (ctx, args) => {
		const user = await requireAuthUser(ctx);
		const now = Date.now();
		const workspaceId = await ctx.db.insert("workspaces", {
			name: normalizeText(args.name, 1, 80),
			createdBy: user._id,
			updatedAt: now,
		});
		await ctx.db.insert("workspaceMembers", {
			workspaceId,
			userId: user._id,
			role: "owner",
		});
		return workspaceId;
	},
});
export const update = mutation({
	args: { workspaceId: v.id("workspaces"), name: v.string() },
	handler: async (ctx, args) => {
		await requirePermission(ctx, args.workspaceId, "workspace.update");
		await ctx.db.patch(args.workspaceId, {
			name: normalizeText(args.name, 1, 80),
			updatedAt: Date.now(),
		});
	},
});
