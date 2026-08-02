import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
	fail,
	normalizeText,
	optionalText,
	requirePermission,
	requireProjectAccess,
} from "./lib/authorization";

export const list = query({
	args: {
		workspaceId: v.id("workspaces"),
		includeArchived: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		await requirePermission(ctx, args.workspaceId, "projects.view");
		const statuses = args.includeArchived
			? (["active", "archived"] as const)
			: (["active"] as const);
		const projects = (
			await Promise.all(
				statuses.map((status) =>
					ctx.db
						.query("projects")
						.withIndex("by_workspace_status", (q) =>
							q.eq("workspaceId", args.workspaceId).eq("status", status),
						)
						.collect(),
				),
			)
		).flat();
		return Promise.all(
			projects.map(async (project) => {
				const tasks = await ctx.db
					.query("tasks")
					.withIndex("by_project_status_position", (q) =>
						q.eq("projectId", project._id),
					)
					.collect();
				const done = tasks.filter((task) => task.status === "done").length;
				return {
					...project,
					taskCount: tasks.length,
					completion: tasks.length
						? Math.round((done / tasks.length) * 100)
						: 0,
				};
			}),
		);
	},
});
export const get = query({
	args: { workspaceId: v.id("workspaces"), projectId: v.id("projects") },
	handler: async (ctx, args) => {
		const project = await requireProjectAccess(ctx, args.projectId);
		if (project.workspaceId !== args.workspaceId) fail("NOT_FOUND");
		await requirePermission(ctx, project.workspaceId, "projects.view");
		return project;
	},
});
export const create = mutation({
	args: {
		workspaceId: v.id("workspaces"),
		name: v.string(),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { user } = await requirePermission(
			ctx,
			args.workspaceId,
			"projects.create",
		);
		return ctx.db.insert("projects", {
			workspaceId: args.workspaceId,
			name: normalizeText(args.name, 1, 120),
			description: optionalText(args.description, 2000),
			status: "active",
			createdBy: user._id,
			updatedAt: Date.now(),
		});
	},
});
export const update = mutation({
	args: {
		projectId: v.id("projects"),
		name: v.string(),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const project = await requireProjectAccess(ctx, args.projectId);
		if (project.status === "archived") fail("CONFLICT");
		await requirePermission(ctx, project.workspaceId, "projects.update");
		await ctx.db.patch(args.projectId, {
			name: normalizeText(args.name, 1, 120),
			description: optionalText(args.description, 2000),
			updatedAt: Date.now(),
		});
	},
});
export const archive = mutation({
	args: { projectId: v.id("projects") },
	handler: async (ctx, args) => {
		const project = await requireProjectAccess(ctx, args.projectId);
		await requirePermission(ctx, project.workspaceId, "projects.archive");
		if (project.status === "archived") fail("CONFLICT");
		await ctx.db.patch(args.projectId, {
			status: "archived",
			updatedAt: Date.now(),
		});
	},
});
