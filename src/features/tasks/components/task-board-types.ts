import type { Doc } from "../../../../convex/_generated/dataModel";

export const columns = [
	"backlog",
	"todo",
	"in_progress",
	"review",
	"done",
] as const;

export type TaskStatus = (typeof columns)[number];

export const statusColors: Record<TaskStatus, string> = {
	backlog: "bg-slate-400",
	todo: "bg-sky-500",
	in_progress: "bg-amber-500",
	review: "bg-violet-500",
	done: "bg-emerald-500",
};

export type Task = Doc<"tasks">;
export type Project = Doc<"projects">;
export type WorkspaceMember = {
	id: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
};
