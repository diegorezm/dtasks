import { Link } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	CheckCircle2Icon,
	CircleDotDashedIcon,
	PlusIcon,
} from "lucide-react";
import type * as React from "react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Progress } from "#/components/ui/progress";
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
		<header className="relative overflow-hidden rounded-[1.75rem] bg-card px-5 pb-6 pt-5 shadow-[0_1px_0_hsl(var(--border)),0_24px_60px_-44px_hsl(var(--foreground)/0.45)] sm:px-8 sm:pb-8">
			<div className="pointer-events-none absolute -right-24 -top-32 size-72 rounded-full bg-primary/7 blur-3xl" />
			<div className="relative flex flex-col gap-8">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<Button variant="ghost" size="sm" className="-ml-2" asChild>
						<Link
							to="/dashboard/$workspaceId/projects"
							params={{ workspaceId }}
						>
							<ArrowLeftIcon data-icon="inline-start" />
							{m.back_to_projects()}
						</Link>
					</Button>
					{archived ? (
						<Badge variant="secondary">{m.project_archived()}</Badge>
					) : (
						children
					)}
				</div>
				<div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.42fr)] lg:items-end">
					<div className="min-w-0">
						<p className="mb-3 text-xs font-medium tracking-[0.16em] text-muted-foreground">
							{m.task_board_label()}
						</p>
						<h1 className="display-title max-w-3xl text-balance text-4xl leading-[0.95] tracking-[-0.045em] sm:text-5xl">
							{project.name}
						</h1>
						{project.description ? (
							<p className="mt-4 max-w-2xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base">
								{project.description}
							</p>
						) : null}
					</div>
					<div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
						<div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<CircleDotDashedIcon className="size-4" aria-hidden="true" />
								<span className="text-xs font-medium">{m.task_open()}</span>
							</div>
							<p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
								{remaining}
							</p>
						</div>
						<div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<CheckCircle2Icon className="size-4" aria-hidden="true" />
								<span className="text-xs font-medium">{m.status_done()}</span>
							</div>
							<p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
								{completed}
							</p>
						</div>
						<div className="col-span-2">
							<div className="mb-2 flex items-center justify-between gap-4 text-xs">
								<span className="font-medium text-muted-foreground">
									{m.task_project_progress()}
								</span>
								<span className="font-mono font-semibold tabular-nums">
									{progress}%
								</span>
							</div>
							<Progress value={progress} className="h-1.5" />
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}

export function CreateTaskTrigger() {
	return (
		<Button className="shadow-sm transition-transform active:scale-[0.98]">
			<PlusIcon data-icon="inline-start" />
			{m.task_create()}
		</Button>
	);
}
