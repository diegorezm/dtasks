import { Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import type * as React from "react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { m } from "#/paraglide/messages";
import type { Project } from "./task-board-types";

type TaskBoardHeaderProps = {
	workspaceId: string;
	project: Project;
	progress: number;
	children: React.ReactNode;
};

export function TaskBoardHeader({
	workspaceId,
	project,
	progress,
	children,
}: TaskBoardHeaderProps) {
	const archived = project.status === "archived";

	return (
		<header className="relative overflow-hidden rounded-2xl border bg-card px-5 py-6 shadow-sm sm:px-7">
			<div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
			<div className="flex flex-wrap items-end justify-between gap-5">
				<div className="min-w-0">
					<Button variant="ghost" size="sm" className="-ml-2 mb-3" asChild>
						<Link
							to="/dashboard/$workspaceId/projects"
							params={{ workspaceId }}
						>
							{m.back_to_projects()}
						</Link>
					</Button>
					<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
						<h1 className="display-title text-3xl leading-none sm:text-4xl">
							{project.name}
						</h1>
						<span className="font-mono text-xs font-medium tracking-wide text-muted-foreground">
							{m.project_progress({ progress })}
						</span>
					</div>
					{project.description ? (
						<p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
							{project.description}
						</p>
					) : null}
				</div>
				{archived ? <Badge>{m.project_archived()}</Badge> : children}
			</div>
		</header>
	);
}

export function CreateTaskTrigger() {
	return (
		<Button className="shadow-sm">
			<PlusIcon data-icon="inline-start" />
			{m.task_create()}
		</Button>
	);
}
