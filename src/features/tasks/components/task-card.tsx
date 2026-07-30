import {
	CalendarDaysIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	FlagIcon,
	GripVerticalIcon,
	Trash2Icon,
} from "lucide-react";
import type { DragEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
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
	none: "",
	low: "opacity-60",
	medium: "opacity-80",
	high: "",
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
				"group gap-0 rounded-xl border-0 py-0 shadow-[0_1px_2px_hsl(var(--foreground)/0.05),0_8px_24px_-20px_hsl(var(--foreground)/0.5)] transition-[transform,box-shadow,opacity] duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_3px_hsl(var(--foreground)/0.06),0_14px_30px_-18px_hsl(var(--foreground)/0.45)]",
				isDragging && "scale-[0.98] opacity-45",
				!archived && "cursor-grab active:cursor-grabbing",
			)}
		>
			<CardContent className="flex flex-col gap-3.5 p-4">
				<div className="flex items-start gap-2.5">
					<GripVerticalIcon
						className="mt-0.5 size-4 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-muted-foreground"
						aria-hidden="true"
					/>
					<p className="min-w-0 flex-1 text-pretty text-sm font-semibold leading-5 tracking-[-0.01em]">
						{task.title}
					</p>
				</div>
				{task.description ? (
					<p className="line-clamp-2 pl-6.5 text-xs leading-5 text-muted-foreground">
						{task.description}
					</p>
				) : null}
				<div className="flex flex-wrap items-center gap-2 pl-6.5">
					{task.priority !== "none" ? (
						<Badge
							className={cn(
								"gap-1 rounded-md border-0 bg-primary/10 text-[10px] font-semibold text-primary",
								priorityStyles[task.priority],
							)}
							variant="secondary"
						>
							<FlagIcon className="size-3" />
							{m[`priority_${task.priority}` as "priority_low"]()}
						</Badge>
					) : null}
					{task.dueDate ? (
						<span className="inline-flex items-center gap-1 font-mono text-[10px] tabular-nums text-muted-foreground">
							<CalendarDaysIcon className="size-3" />
							{formatDueDate(task.dueDate)}
						</span>
					) : null}
				</div>
				<div className="flex min-h-7 items-center justify-between border-t pt-3">
					{assignee ? (
						<Avatar className="rounded-lg" size="sm" title={assignee}>
							{member.image ? (
								<AvatarImage src={member.image} alt={assignee} />
							) : null}
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
