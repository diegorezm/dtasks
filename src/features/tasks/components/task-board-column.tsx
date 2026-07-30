import { CheckIcon } from "lucide-react";
import type { DragEvent } from "react";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages";
import type { Task, TaskStatus, WorkspaceMember } from "./task-board-types";
import { TaskCard } from "./task-card";

const laneStyles: Record<
	TaskStatus,
	{ dot: string; rule: string; surface: string }
> = {
	backlog: {
		dot: "bg-slate-400",
		rule: "bg-slate-400",
		surface: "bg-slate-400/8",
	},
	todo: { dot: "bg-sky-500", rule: "bg-sky-500", surface: "bg-sky-500/8" },
	in_progress: {
		dot: "bg-amber-500",
		rule: "bg-amber-500",
		surface: "bg-amber-500/8",
	},
	review: {
		dot: "bg-violet-500",
		rule: "bg-violet-500",
		surface: "bg-violet-500/8",
	},
	done: {
		dot: "bg-emerald-500",
		rule: "bg-emerald-500",
		surface: "bg-emerald-500/8",
	},
};

type TaskBoardColumnProps = {
	status: TaskStatus;
	columnIndex: number;
	tasks: Task[];
	members: WorkspaceMember[];
	archived: boolean;
	isDropTarget: boolean;
	draggedTaskId?: string;
	isMoving: boolean;
	isRemoving: boolean;
	onDragEnter: (event: DragEvent<HTMLElement>, status: TaskStatus) => void;
	onDragOver: (event: DragEvent<HTMLElement>) => void;
	onDrop: (event: DragEvent<HTMLElement>, status: TaskStatus) => void;
	onDragStart: (event: DragEvent<HTMLDivElement>, taskId: string) => void;
	onDragEnd: () => void;
	onMove: (taskId: Task["_id"], status: TaskStatus) => void;
	onRemove: (taskId: Task["_id"]) => void;
};

export function TaskBoardColumn({
	status,
	columnIndex,
	tasks,
	members,
	archived,
	isDropTarget,
	draggedTaskId,
	isMoving,
	isRemoving,
	onDragEnter,
	onDragOver,
	onDrop,
	onDragStart,
	onDragEnd,
	onMove,
	onRemove,
}: TaskBoardColumnProps) {
	const style = laneStyles[status];

	return (
		<section
			aria-label={label(status)}
			className={cn(
				"relative flex min-h-[30rem] flex-col overflow-hidden rounded-xl border bg-card transition-all duration-200",
				isDropTarget &&
					"-translate-y-0.5 border-primary ring-2 ring-primary/20",
			)}
			onDragEnter={(event) => onDragEnter(event, status)}
			onDragOver={onDragOver}
			onDrop={(event) => onDrop(event, status)}
		>
			<div className={cn("h-1 w-full", style.rule)} />
			<div
				className={cn(
					"flex items-center justify-between border-b px-4 py-3",
					style.surface,
				)}
			>
				<div className="flex items-center gap-2.5">
					<span className={cn("size-2 rounded-full", style.dot)} />
					<h2 className="text-sm font-semibold">{label(status)}</h2>
					<span className="font-mono text-xs text-muted-foreground">
						{tasks.length}
					</span>
				</div>
				{status === "done" ? (
					<CheckIcon className="size-4 text-emerald-600 dark:text-emerald-400" />
				) : null}
			</div>
			<div className="flex flex-1 flex-col gap-3 p-3">
				{tasks.map((task) => (
					<TaskCard
						key={task._id}
						task={task}
						members={members}
						columnIndex={columnIndex}
						archived={archived}
						isDragging={draggedTaskId === task._id}
						isMoving={isMoving}
						isRemoving={isRemoving}
						onDragStart={onDragStart}
						onDragEnd={onDragEnd}
						onMove={onMove}
						onRemove={onRemove}
					/>
				))}
				{tasks.length === 0 ? (
					<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed bg-muted/30 px-5 text-center text-xs leading-5 text-muted-foreground">
						{m.column_empty()}
					</div>
				) : null}
			</div>
		</section>
	);
}

function label(status: TaskStatus) {
	return m[`status_${status}`]();
}
