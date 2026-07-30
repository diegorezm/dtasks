import {
	CalendarDaysIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	FlagIcon,
	GripVerticalIcon,
} from "lucide-react";
import type { DragEvent } from "react";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages";
import {
	columns,
	type Task,
	type TaskStatus,
	type WorkspaceMember,
} from "./task-board-types";

const priorityStyles: Record<Task["priority"], string> = {
	none: "border-border bg-muted text-muted-foreground",
	low: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
	medium:
		"border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
	high: "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

type TaskCardProps = {
	task: Task;
	members: WorkspaceMember[];
	columnIndex: number;
	archived: boolean;
	isDragging: boolean;
	isMoving: boolean;
	isRemoving: boolean;
	onDragStart: (event: DragEvent<HTMLDivElement>, taskId: string) => void;
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
		<Card
			draggable={!archived}
			onDragEnd={onDragEnd}
			onDragStart={(event) => onDragStart(event, task._id)}
			className={cn(
				"group gap-0 rounded-lg border-border py-0 shadow-sm transition-[transform,box-shadow,opacity] hover:-translate-y-0.5 hover:shadow-md",
				isDragging && "scale-[0.98] opacity-45",
				!archived && "cursor-grab active:cursor-grabbing",
			)}
		>
			<CardContent className="flex flex-col gap-3 p-3.5">
				<div className="flex items-start gap-2">
					<GripVerticalIcon
						className="mt-0.5 size-4 shrink-0 text-muted-foreground/50 group-hover:text-muted-foreground"
						aria-hidden="true"
					/>
					<p className="min-w-0 flex-1 text-sm font-semibold leading-5">
						{task.title}
					</p>
				</div>
				{task.description ? (
					<p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
						{task.description}
					</p>
				) : null}
				<div className="flex flex-wrap items-center gap-1.5">
					{task.priority !== "none" ? (
						<Badge
							className={cn(
								"gap-1 border text-[10px] font-semibold",
								priorityStyles[task.priority],
							)}
							variant="outline"
						>
							<FlagIcon className="size-3" />
							{m[`priority_${task.priority}` as "priority_low"]()}
						</Badge>
					) : null}
					{task.dueDate ? (
						<span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
							<CalendarDaysIcon className="size-3" />
							{formatDueDate(task.dueDate)}
						</span>
					) : null}
				</div>
				<div className="flex min-h-6 items-center justify-between">
					{assignee ? (
						<Avatar size="sm" title={assignee}>
							<AvatarFallback>{initials(assignee)}</AvatarFallback>
						</Avatar>
					) : (
						<span />
					)}
					<div className="flex items-center">
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
							size="sm"
							variant="ghost"
							className="px-2 text-xs text-muted-foreground hover:text-destructive"
							disabled={archived || isRemoving}
							onClick={() => onRemove(task._id)}
						>
							{m.task_delete()}
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
			</CardContent>
		</Card>
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
