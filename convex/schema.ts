import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	workspaces: defineTable({
		name: v.string(),
		createdBy: v.string(),
		updatedAt: v.number(),
	}),
	workspaceMembers: defineTable({
		workspaceId: v.id("workspaces"),
		userId: v.string(),
		role: v.union(v.literal("owner"), v.literal("member")),
	})
		.index("by_workspace_user", ["workspaceId", "userId"])
		.index("by_user", ["userId"]),
	workspaceInvitations: defineTable({
		workspaceId: v.id("workspaces"),
		email: v.string(),
		role: v.literal("member"),
		invitedBy: v.string(),
		status: v.union(
			v.literal("pending"),
			v.literal("accepted"),
			v.literal("revoked"),
		),
		expiresAt: v.number(),
		acceptedBy: v.optional(v.string()),
	})
		.index("by_workspace", ["workspaceId"])
		.index("by_workspace_email", ["workspaceId", "email"]),
	projects: defineTable({
		workspaceId: v.id("workspaces"),
		name: v.string(),
		description: v.optional(v.string()),
		status: v.union(v.literal("active"), v.literal("archived")),
		createdBy: v.string(),
		updatedAt: v.number(),
	}).index("by_workspace_status", ["workspaceId", "status"]),
	tasks: defineTable({
		workspaceId: v.id("workspaces"),
		projectId: v.id("projects"),
		title: v.string(),
		description: v.optional(v.string()),
		status: v.union(
			v.literal("backlog"),
			v.literal("todo"),
			v.literal("in_progress"),
			v.literal("review"),
			v.literal("done"),
		),
		priority: v.union(
			v.literal("none"),
			v.literal("low"),
			v.literal("medium"),
			v.literal("high"),
		),
		assigneeId: v.optional(v.string()),
		dueDate: v.optional(v.string()),
		position: v.number(),
		visibility: v.literal("internal"),
		origin: v.literal("internal"),
		createdBy: v.string(),
		updatedAt: v.number(),
	})
		.index("by_project_status_position", ["projectId", "status", "position"])
		.index("by_workspace_assignee", ["workspaceId", "assigneeId"]),
});
