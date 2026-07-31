import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon, CheckIcon, CircleIcon, PlusIcon } from "lucide-react";
import type * as React from "react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { m } from "#/paraglide/messages";
import type { Project } from "./task-board-types";

type TaskBoardHeaderProps = {
	workspaceId: string;
	project: Project;
	progress: number;
	completed: number;
	total: number;
	children: React.ReactNode;
};

export function TaskBoardHeader({
	workspaceId,
	project,
	progress,
	completed,
	total,
	children,
}: TaskBoardHeaderProps) {
	const archived = project.status === "archived";
	const remaining = total - completed;

	return (
		<header className="border-b pb-5">
			<div className="flex flex-col gap-5">
				<Button
					variant="ghost"
					size="sm"
					className="-ml-2 w-fit text-muted-foreground"
					asChild
				>
					<Link to="/dashboard/$workspaceId/projects" params={{ workspaceId }}>
						<ArrowLeftIcon data-icon="inline-start" />
						{m.back_to_projects()}
					</Link>
				</Button>

				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="min-w-0">
						<div className="flex flex-wrap items-center gap-3">
							<h1 className="truncate text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
								{project.name}
							</h1>
							{archived ? (
								<Badge variant="secondary">{m.project_archived()}</Badge>
							) : null}
						</div>
						{project.description ? (
							<p className="mt-2 max-w-2xl text-pretty text-sm leading-6 text-muted-foreground">
								{project.description}
							</p>
						) : null}
					</div>
					{archived ? null : children}
				</div>

				<div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
					<div className="flex items-center gap-1.5">
						<CircleIcon className="size-3" aria-hidden="true" />
						<span>{m.task_open_count({ count: remaining })}</span>
					</div>
					<div className="flex items-center gap-1.5">
						<CheckIcon className="size-3" aria-hidden="true" />
						<span>{m.task_done_count({ count: completed })}</span>
					</div>
					<div className="font-mono tabular-nums">
						{m.project_progress({ progress })}
					</div>
				</div>
			</div>
		</header>
	);
}

export function CreateTaskTrigger({ onClick }: { onClick: () => void }) {
	return (
		<Button
			type="button"
			className="shrink-0 transition-transform active:scale-[0.98]"
			onClick={onClick}
		>
			<PlusIcon data-icon="inline-start" />
			{m.task_create()}
		</Button>
	);
}
