import {
	CalendarDaysIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	FlagIcon,
	Trash2Icon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages";
import type { Task, TaskStatus, WorkspaceMember } from "./task-board-types";
import { columns, statusColors } from "./task-board-types";

const priorityRails: Record<Task["priority"], string> = {
	none: "border-l-transparent",
	low: "border-l-primary/25",
	medium: "border-l-primary/55",
	high: "border-l-primary",
};

type TaskListViewProps = {
	tasks: Task[];
	members: WorkspaceMember[];
	visibleStatuses: TaskStatus[];
	archived: boolean;
	isMoving: boolean;
	isRemoving: boolean;
	onMove: (taskId: Task["_id"], status: TaskStatus) => void;
	onRemove: (taskId: Task["_id"]) => void;
};

export function TaskListView({
	tasks,
	members,
	visibleStatuses,
	archived,
	isMoving,
	isRemoving,
	onMove,
	onRemove,
}: TaskListViewProps) {
	return (
		<div className="flex flex-col gap-2 rounded-xl border bg-muted/45 p-2">
			{columns
				.filter((status) => visibleStatuses.includes(status))
				.map((status) => {
					const statusTasks = tasks.filter((task) => task.status === status);
					return (
						<section
							key={status}
							aria-labelledby={`list-${status}`}
							className="overflow-hidden rounded-lg border bg-muted/30"
						>
							<header className="flex items-center justify-between rounded-t-lg border-b bg-muted/35 px-3 py-3">
								<div className="flex min-w-0 items-center gap-2">
									<span
										className={cn(
											"size-2 shrink-0 rounded-full",
											statusColors[status],
										)}
										aria-hidden="true"
									/>
									<h2
										id={`list-${status}`}
										className="text-xs font-semibold text-foreground/80"
									>
										{m[`status_${status}`]()}
									</h2>
								</div>
								<span className="font-mono text-[11px] tabular-nums text-muted-foreground">
									{statusTasks.length}
								</span>
							</header>
							<div className="flex flex-col gap-2 p-2">
								{statusTasks.length ? (
									statusTasks.map((task) => (
										<TaskListRow
											key={task._id}
											task={task}
											members={members}
											archived={archived}
											isMoving={isMoving}
											isRemoving={isRemoving}
											onMove={onMove}
											onRemove={onRemove}
										/>
									))
								) : (
									<p className="rounded-md border border-dashed bg-background/45 px-3 py-4 text-xs text-muted-foreground">
										{m.column_empty()}
									</p>
								)}
							</div>
						</section>
					);
				})}
		</div>
	);
}

function TaskListRow({
	task,
	members,
	archived,
	isMoving,
	isRemoving,
	onMove,
	onRemove,
}: {
	task: Task;
	members: WorkspaceMember[];
	archived: boolean;
	isMoving: boolean;
	isRemoving: boolean;
	onMove: (taskId: Task["_id"], status: TaskStatus) => void;
	onRemove: (taskId: Task["_id"]) => void;
}) {
	const member = members.find((item) => item.id === task.assigneeId);
	const assignee = member?.name || member?.email;
	const currentIndex = columns.indexOf(task.status);
	const previousStatus = columns[currentIndex - 1];
	const nextStatus = columns[currentIndex + 1];

	return (
		<article
			className={cn(
				"group flex min-w-0 items-center gap-3 rounded-md border border-border/80 border-l-2 bg-card px-3.5 py-3 transition-colors hover:border-foreground/20 hover:bg-card/90",
				priorityRails[task.priority],
			)}
		>
			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-medium">{task.title}</p>
				{task.description ? (
					<p className="mt-0.5 truncate text-xs text-muted-foreground">
						{task.description}
					</p>
				) : null}
			</div>
			<div className="hidden items-center gap-3 md:flex">
				{task.priority !== "none" ? (
					<span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
						<FlagIcon className="size-3 text-primary" />
						{m[`priority_${task.priority}` as "priority_low"]()}
					</span>
				) : null}
				{task.dueDate ? (
					<span className="inline-flex items-center gap-1 font-mono text-[10px] tabular-nums text-muted-foreground">
						<CalendarDaysIcon className="size-3" />
						{formatDueDate(task.dueDate)}
					</span>
				) : null}
				{assignee ? (
					<Avatar className="rounded-md" size="sm" title={assignee}>
						{member.image ? (
							<AvatarImage src={member.image} alt={assignee} />
						) : null}
						<AvatarFallback>{initials(assignee)}</AvatarFallback>
					</Avatar>
				) : null}
			</div>
			<div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
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
