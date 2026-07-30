import type { Doc } from "../../../../convex/_generated/dataModel";

export const columns = [
	"backlog",
	"todo",
	"in_progress",
	"review",
	"done",
] as const;

export type TaskStatus = (typeof columns)[number];
export type Task = Doc<"tasks">;
export type Project = Doc<"projects">;
export type WorkspaceMember = {
	id: string;
	name?: string | null;
	email?: string | null;
};
