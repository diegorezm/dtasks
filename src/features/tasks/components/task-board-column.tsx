import type { DragEvent } from "react";
import { Badge } from "#/components/ui/badge";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages";
import type { Task, TaskStatus, WorkspaceMember } from "./task-board-types";
import { TaskCard } from "./task-card";

const laneStyles: Record<TaskStatus, { marker: string; number: string }> = {
	backlog: { marker: "bg-muted-foreground/35", number: "01" },
	todo: { marker: "bg-muted-foreground/55", number: "02" },
	in_progress: { marker: "bg-primary", number: "03" },
	review: { marker: "bg-primary/70", number: "04" },
	done: { marker: "bg-foreground", number: "05" },
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
				"relative flex min-h-[30rem] flex-col rounded-2xl border border-border/80 bg-muted/70 p-2 shadow-[0_1px_2px_hsl(var(--foreground)/0.04)] transition-[transform,background-color,box-shadow] duration-200",
				isDropTarget &&
					"-translate-y-1 border-primary/50 bg-primary/12 shadow-[0_10px_28px_-20px_hsl(var(--primary)/0.5),inset_0_0_0_1px_hsl(var(--primary)/0.2)]",
			)}
			onDragEnter={(event) => onDragEnter(event, status)}
			onDragOver={onDragOver}
			onDrop={(event) => onDrop(event, status)}
		>
			<header className="flex items-center justify-between gap-3 px-2 pb-3 pt-2">
				<div className="flex min-w-0 items-center gap-2.5">
					<span
						className={cn("size-1.5 shrink-0 rounded-full", style.marker)}
					/>
					<h2 className="truncate text-sm font-semibold tracking-[-0.01em]">
						{label(status)}
					</h2>
					<Badge
						variant="secondary"
						className="h-5 min-w-5 justify-center rounded-md px-1.5 font-mono text-[10px] tabular-nums"
					>
						{tasks.length}
					</Badge>
				</div>
				<span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground/60">
					{style.number}
				</span>
			</header>
			<div className="flex flex-1 flex-col gap-2.5">
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
					<div className="flex min-h-32 flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-background/55 px-5 text-center">
						<p className="max-w-32 text-pretty text-xs leading-5 text-muted-foreground">
							{m.column_empty()}
						</p>
					</div>
				) : null}
			</div>
		</section>
	);
}

function label(status: TaskStatus) {
	return m[`status_${status}`]();
}
