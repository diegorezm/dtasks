import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { type MutationCtx, mutation, query } from "./_generated/server";
import {
	fail,
	normalizeText,
	optionalText,
	requirePermission,
	requireProjectAccess,
	requireTaskAccess,
	validDueDate,
} from "./lib/authorization";

const status = v.union(
	v.literal("backlog"),
	v.literal("todo"),
	v.literal("in_progress"),
	v.literal("review"),
	v.literal("done"),
);
const priority = v.union(
	v.literal("none"),
	v.literal("low"),
	v.literal("medium"),
	v.literal("high"),
);
type Context = MutationCtx;
type TaskStatus = Doc<"tasks">["status"];

async function ensureAssignee(
	ctx: Context,
	workspaceId: Id<"workspaces">,
	assigneeId: string | undefined,
) {
	if (!assigneeId) return;
	const member = await ctx.db
		.query("workspaceMembers")
		.withIndex("by_workspace_user", (q) =>
			q.eq("workspaceId", workspaceId).eq("userId", assigneeId),
		)
		.unique();
	if (!member) fail("VALIDATION");
}
async function nextPosition(
	ctx: Context,
	projectId: Id<"projects">,
	taskStatus: TaskStatus,
) {
	const tasks = await ctx.db
		.query("tasks")
		.withIndex("by_project_status_position", (q) =>
			q.eq("projectId", projectId).eq("status", taskStatus),
		)
		.collect();
	return tasks.length ? Math.max(...tasks.map((task) => task.position)) + 1 : 0;
}
export const listByProject = query({
	args: { workspaceId: v.id("workspaces"), projectId: v.id("projects") },
	handler: async (ctx, args) => {
		const project = await requireProjectAccess(ctx, args.projectId);
		if (project.workspaceId !== args.workspaceId) fail("NOT_FOUND");
		return ctx.db
			.query("tasks")
			.withIndex("by_project_status_position", (q) =>
				q.eq("projectId", args.projectId),
			)
			.collect();
	},
});
export const create = mutation({
	args: {
		projectId: v.id("projects"),
		title: v.string(),
		description: v.optional(v.string()),
		priority,
		assigneeId: v.optional(v.string()),
		dueDate: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const project = await requireProjectAccess(ctx, args.projectId);
		await requirePermission(ctx, project.workspaceId, "manageTasks");
		if (project.status === "archived") fail("CONFLICT");
		await ensureAssignee(ctx, project.workspaceId, args.assigneeId);
		const user = (
			await requirePermission(ctx, project.workspaceId, "manageTasks")
		).user;
		return ctx.db.insert("tasks", {
			workspaceId: project.workspaceId,
			projectId: args.projectId,
			title: normalizeText(args.title, 1, 200),
			description: optionalText(args.description, 10000),
			priority: args.priority,
			assigneeId: args.assigneeId,
			dueDate: validDueDate(args.dueDate),
			status: "backlog",
			position: await nextPosition(ctx, args.projectId, "backlog"),
			visibility: "internal",
			origin: "internal",
			createdBy: user._id,
			updatedAt: Date.now(),
		});
	},
});
export const update = mutation({
	args: {
		taskId: v.id("tasks"),
		title: v.string(),
		description: v.optional(v.string()),
		priority,
		assigneeId: v.optional(v.string()),
		dueDate: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { task, project } = await requireTaskAccess(ctx, args.taskId);
		await requirePermission(ctx, task.workspaceId, "manageTasks");
		if (project.status === "archived") fail("CONFLICT");
		await ensureAssignee(ctx, task.workspaceId, args.assigneeId);
		await ctx.db.patch(args.taskId, {
			title: normalizeText(args.title, 1, 200),
			description: optionalText(args.description, 10000),
			priority: args.priority,
			assigneeId: args.assigneeId,
			dueDate: validDueDate(args.dueDate),
			updatedAt: Date.now(),
		});
	},
});
export const move = mutation({
	args: { taskId: v.id("tasks"), status },
	handler: async (ctx, args) => {
		const { task, project } = await requireTaskAccess(ctx, args.taskId);
		await requirePermission(ctx, task.workspaceId, "manageTasks");
		if (project.status === "archived") fail("CONFLICT");
		await ctx.db.patch(args.taskId, {
			status: args.status,
			position: await nextPosition(ctx, task.projectId, args.status),
			updatedAt: Date.now(),
		});
	},
});
export const remove = mutation({
	args: { taskId: v.id("tasks") },
	handler: async (ctx, args) => {
		const { task, project } = await requireTaskAccess(ctx, args.taskId);
		await requirePermission(ctx, task.workspaceId, "manageTasks");
		if (project.status === "archived") fail("CONFLICT");
		await ctx.db.delete(args.taskId);
	},
});
