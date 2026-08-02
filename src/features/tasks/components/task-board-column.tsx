import { PlusIcon } from "lucide-react";
import type { DragEvent } from "react";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages";
import {
	statusColors,
	type Task,
	type TaskStatus,
	type WorkspaceMember,
} from "./task-board-types";
import { TaskCard } from "./task-card";

type TaskBoardColumnProps = {
	status: TaskStatus;
	tasks: Task[];
	members: WorkspaceMember[];
	archived: boolean;
	canCreate: boolean;
	canMove: boolean;
	canDelete: boolean;
	isDropTarget: boolean;
	draggedTaskId?: string;
	isRemoving: boolean;
	onDragEnter: (event: DragEvent<HTMLElement>, status: TaskStatus) => void;
	onDragOver: (event: DragEvent<HTMLElement>) => void;
	onDrop: (event: DragEvent<HTMLElement>, status: TaskStatus) => void;
	onDragStart: (event: DragEvent<HTMLElement>, taskId: string) => void;
	onDragEnd: () => void;
	onRemove: (taskId: Task["_id"]) => void;
	onAddTask: (status: TaskStatus) => void;
};

export function TaskBoardColumn({
	status,
	tasks,
	members,
	archived,
	canCreate,
	canMove,
	canDelete,
	isDropTarget,
	draggedTaskId,
	isRemoving,
	onDragEnter,
	onDragOver,
	onDrop,
	onDragStart,
	onDragEnd,
	onRemove,
	onAddTask,
}: TaskBoardColumnProps) {
	return (
		<section
			aria-label={label(status)}
			className={cn(
				"relative flex min-h-[32rem] flex-col rounded-xl border bg-muted/45 p-2 transition-[transform,background-color,border-color] duration-200",
				isDropTarget && "-translate-y-0.5 border-primary/60 bg-primary/10",
			)}
			onDragEnter={(event) => canMove && onDragEnter(event, status)}
			onDragOver={(event) => canMove && onDragOver(event)}
			onDrop={(event) => canMove && onDrop(event, status)}
		>
			<header className="flex items-center justify-between gap-3 px-2 pb-3 pt-1.5">
				<div className="flex min-w-0 items-center gap-2">
					<span
						className={cn("size-2 shrink-0 rounded-full", statusColors[status])}
						aria-hidden="true"
					/>
					<h2 className="truncate text-xs font-semibold text-foreground/80">
						{label(status)}
					</h2>
				</div>
				<div className="flex items-center gap-1">
					<span className="font-mono text-[11px] tabular-nums text-muted-foreground">
						{tasks.length}
					</span>
					{!archived && canCreate ? (
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							aria-label={m.task_create()}
							onClick={() => onAddTask(status)}
						>
							<PlusIcon />
						</Button>
					) : null}
				</div>
			</header>
			<div className="flex flex-1 flex-col gap-2.5">
				{tasks.map((task) => (
					<TaskCard
						key={task._id}
						task={task}
						members={members}
						archived={archived}
						canMove={canMove}
						canDelete={canDelete}
						isDragging={draggedTaskId === task._id}
						isRemoving={isRemoving}
						onDragStart={onDragStart}
						onDragEnd={onDragEnd}
						onRemove={onRemove}
					/>
				))}
				{tasks.length === 0 ? (
					<div className="flex min-h-32 flex-1 items-center justify-center rounded-lg border border-dashed bg-background/45 px-5 text-center">
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
