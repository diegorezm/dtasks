import {
	CalendarDaysIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	FlagIcon,
	Trash2Icon,
} from "lucide-react";
import type { DragEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages";
import {
	columns,
	type Task,
	type TaskStatus,
	type WorkspaceMember,
} from "./task-board-types";

const priorityStyles: Record<Task["priority"], string> = {
	none: "text-muted-foreground",
	low: "text-muted-foreground",
	medium: "text-foreground/80",
	high: "text-primary",
};

const priorityRails: Record<Task["priority"], string> = {
	none: "border-l-transparent",
	low: "border-l-primary/25",
	medium: "border-l-primary/55",
	high: "border-l-primary",
};

type TaskCardProps = {
	task: Task;
	members: WorkspaceMember[];
	columnIndex: number;
	archived: boolean;
	isDragging: boolean;
	isMoving: boolean;
	isRemoving: boolean;
	onDragStart: (event: DragEvent<HTMLElement>, taskId: string) => void;
	onDragEnd: () => void;
	onMove: (taskId: Task["_id"], status: TaskStatus) => void;
	onRemove: (taskId: Task["_id"]) => void;
};

export function TaskCard({
	task,
	members,
	columnIndex,
	archived,
	isDragging,
	isMoving,
	isRemoving,
	onDragStart,
	onDragEnd,
	onMove,
	onRemove,
}: TaskCardProps) {
	const member = members.find((item) => item.id === task.assigneeId);
	const assignee = member?.name || member?.email;
	const previousStatus = columns[columnIndex - 1];
	const nextStatus = columns[columnIndex + 1];

	return (
		<article
			aria-label={task.title}
			draggable={!archived}
			onDragEnd={onDragEnd}
			onDragStart={(event) => onDragStart(event, task._id)}
			className={cn(
				"group relative rounded-md border border-border/80 border-l-2 bg-card px-3.5 py-3 transition-[transform,border-color,opacity] duration-200 hover:-translate-y-px hover:border-foreground/20",
				priorityRails[task.priority],
				isDragging && "scale-[0.98] opacity-45",
				!archived && "cursor-grab active:cursor-grabbing",
			)}
		>
			<div className="flex flex-col gap-2.5">
				<p className="min-w-0 pr-6 text-pretty text-sm font-semibold leading-5 tracking-[-0.015em]">
					{task.title}
				</p>
				{task.description ? (
					<p className="line-clamp-2 text-[11px] leading-[1.45] text-muted-foreground">
						{task.description}
					</p>
				) : null}
				<div className="flex min-h-6 items-center gap-3 pt-1">
					{assignee ? (
						<Avatar className="rounded-md" size="sm" title={assignee}>
							{member.image ? (
								<AvatarImage src={member.image} alt={assignee} />
							) : null}
							<AvatarFallback>{initials(assignee)}</AvatarFallback>
						</Avatar>
					) : null}
					{task.priority !== "none" ? (
						<span
							className={cn(
								"inline-flex items-center gap-1 text-[11px] font-medium",
								priorityStyles[task.priority],
							)}
						>
							<FlagIcon className="size-3" />
							{m[`priority_${task.priority}` as "priority_low"]()}
						</span>
					) : null}
					{task.dueDate ? (
						<span className="inline-flex items-center gap-1 font-mono text-[10px] tabular-nums text-muted-foreground">
							<CalendarDaysIcon className="size-3" />
							{formatDueDate(task.dueDate)}
						</span>
					) : null}
				</div>
				<div className="absolute right-2 top-2 flex items-center rounded-md border bg-card opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
					<Button
						aria-label={
							previousStatus ? label(previousStatus) : label(task.status)
						}
						size="icon-sm"
						variant="ghost"
						disabled={archived || !previousStatus || isMoving}
						onClick={() => previousStatus && onMove(task._id, previousStatus)}
					>
						<ChevronLeftIcon />
					</Button>
					<Button
						aria-label={m.task_delete()}
						size="icon-sm"
						variant="ghost"
						className="text-muted-foreground hover:text-destructive"
						disabled={archived || isRemoving}
						onClick={() => onRemove(task._id)}
					>
						<Trash2Icon />
					</Button>
					<Button
						aria-label={nextStatus ? label(nextStatus) : label(task.status)}
						size="icon-sm"
						variant="ghost"
						disabled={archived || !nextStatus || isMoving}
						onClick={() => nextStatus && onMove(task._id, nextStatus)}
					>
						<ChevronRightIcon />
					</Button>
				</div>
			</div>
		</article>
	);
}

function formatDueDate(date: string) {
	return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
		new Date(`${date}T00:00:00`),
	);
}

function initials(name: string) {
	return name
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();
}

function label(status: TaskStatus) {
	return m[`status_${status}`]();
}
