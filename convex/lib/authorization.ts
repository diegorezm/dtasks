import { ConvexError } from "convex/values";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { authComponent } from "../auth";
import { hasPermission, type WorkspacePermission } from "./permissions";

type Context = MutationCtx | QueryCtx;
export function fail(code: string): never {
	throw new ConvexError({ code });
}

export async function requireAuthUser(ctx: Context) {
	const user = await authComponent.getAuthUser(ctx);
	if (!user) fail("UNAUTHENTICATED");
	return user;
}

export async function requireWorkspaceMember(
	ctx: Context,
	workspaceId: Id<"workspaces">,
) {
	const user = await requireAuthUser(ctx);
	const membership = await ctx.db
		.query("workspaceMembers")
		.withIndex("by_workspace_user", (q) =>
			q.eq("workspaceId", workspaceId).eq("userId", user._id),
		)
		.unique();
	if (!membership) fail("FORBIDDEN");
	return { user, membership };
}

export async function requirePermission(
	ctx: Context,
	workspaceId: Id<"workspaces">,
	permission: WorkspacePermission,
) {
	const result = await requireWorkspaceMember(ctx, workspaceId);
	if (!hasPermission(result.membership.role, permission)) fail("FORBIDDEN");
	return result;
}

export async function requireProjectAccess(
	ctx: Context,
	projectId: Id<"projects">,
) {
	const project = await ctx.db.get(projectId);
	if (!project) fail("NOT_FOUND");
	await requireWorkspaceMember(ctx, project.workspaceId);
	return project;
}

export async function requireTaskAccess(ctx: Context, taskId: Id<"tasks">) {
	const task = await ctx.db.get(taskId);
	if (!task) fail("NOT_FOUND");
	const project = await ctx.db.get(task.projectId);
	if (!project || project.workspaceId !== task.workspaceId) fail("NOT_FOUND");
	await requireWorkspaceMember(ctx, task.workspaceId);
	return { task, project };
}

export function normalizeText(value: string, min: number, max: number) {
	const normalized = value.trim();
	if (normalized.length < min || normalized.length > max) fail("VALIDATION");
	return normalized;
}

export function optionalText(value: string | undefined, max: number) {
	if (value === undefined) return undefined;
	const normalized = value.trim();
	if (normalized.length > max) fail("VALIDATION");
	return normalized || undefined;
}

export function normalizeEmail(value: string) {
	const email = value.trim().toLowerCase();
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("VALIDATION");
	return email;
}

export function validDueDate(value: string | undefined) {
	if (value === undefined || value === "") return undefined;
	if (
		!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
		Number.isNaN(Date.parse(`${value}T00:00:00Z`))
	) {
		fail("VALIDATION");
	}
	return value;
}
