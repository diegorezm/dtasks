import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useRouteContext } from "@tanstack/react-router";
import {
	ArchiveIcon,
	ArrowUpRightIcon,
	CheckCircle2Icon,
	FolderKanbanIcon,
	PlusIcon,
} from "lucide-react";
import { type FormEvent, useState } from "react";

import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Skeleton } from "#/components/ui/skeleton";
import { Textarea } from "#/components/ui/textarea";
import { routeParamId } from "#/core/convex/id";
import { m } from "#/paraglide/messages";
import { api } from "../../../../convex/_generated/api";

const projectAccents = ["bg-primary", "bg-chart-2", "bg-chart-3", "bg-chart-4"];

export function ProjectsPage({ workspaceId }: { workspaceId: string }) {
	const context = useRouteContext({ from: "__root__" });
	const { user } = useRouteContext({ from: "/__private" });
	const projects = useQuery(
		context.convexQueryClient.queryOptions(api.projects.list, {
			workspaceId: routeParamId<"workspaces">(workspaceId),
		}),
	);
	const workspace = useQuery(
		context.convexQueryClient.queryOptions(api.workspaces.get, {
			workspaceId: routeParamId<"workspaces">(workspaceId),
		}),
	);
	const members = useQuery(
		context.convexQueryClient.queryOptions(api.workspaces.listMembers, {
			workspaceId: routeParamId<"workspaces">(workspaceId),
		}),
	);
	const create = useMutation({
		mutationFn: useConvexMutation(api.projects.create),
		onSuccess: () => void projects.refetch(),
	});
	const archive = useMutation({
		mutationFn: useConvexMutation(api.projects.archive),
		onSuccess: () => void projects.refetch(),
	});
	const [open, setOpen] = useState(false);
	const [actionError, setActionError] = useState<string>();
	function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		setActionError(undefined);
		create.mutate(
			{
				workspaceId: routeParamId<"workspaces">(workspaceId),
				name: String(form.get("name")),
				description: String(form.get("description")),
			},
			{
				onError: () => setActionError(m.error_generic()),
				onSuccess: () => {
					setActionError(undefined);
					setOpen(false);
				},
			},
		);
	}
	if (projects.isLoading || workspace.isLoading || members.isLoading)
		return (
			<div className="flex flex-col gap-8">
				<div className="space-y-3">
					<Skeleton className="h-3 w-28" />
					<Skeleton className="h-12 w-64" />
				</div>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{["one", "two", "three"].map((item) => (
						<Skeleton key={item} className="h-52 rounded-xl" />
					))}
				</div>
			</div>
		);
	if (projects.error || !workspace.data) return <p>{m.error_generic()}</p>;
	const projectList = projects.data ?? [];
	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-wrap items-end justify-between gap-5 border-b border-border/70 pb-7">
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-primary">
						<FolderKanbanIcon className="size-4" aria-hidden="true" />
						<p className="font-mono text-xs font-semibold uppercase tracking-[0.16em]">
							{workspace.data.name}
						</p>
					</div>
					<div className="flex items-end gap-3">
						<h1 className="display-title text-4xl tracking-[-0.04em] sm:text-5xl">
							{m.projects_title()}
						</h1>
						<span className="mb-1 font-mono text-xs text-muted-foreground">
							{projectList.length} {m.projects()}
						</span>
					</div>
				</div>
				<Dialog
					open={open}
					onOpenChange={(nextOpen) => {
						setOpen(nextOpen);
						if (!nextOpen) setActionError(undefined);
					}}
				>
					<DialogTrigger asChild>
						<Button className="rounded-lg shadow-sm">
							<PlusIcon data-icon="inline-start" />
							{m.project_create()}
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{m.project_create()}</DialogTitle>
							<DialogDescription>{workspace.data.name}</DialogDescription>
						</DialogHeader>
						<form onSubmit={submit}>
							<FieldGroup>
								<Field data-invalid={Boolean(actionError) || undefined}>
									<FieldLabel htmlFor="project-name">
										{m.project_name()}
									</FieldLabel>
									<Input
										id="project-name"
										name="name"
										required
										maxLength={120}
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="project-description">
										{m.project_description()}
									</FieldLabel>
									<Textarea
										id="project-description"
										name="description"
										maxLength={2000}
									/>
								</Field>
								{actionError ? <FieldError>{actionError}</FieldError> : null}
								<Button disabled={create.isPending} type="submit">
									{m.project_create_submit()}
								</Button>
							</FieldGroup>
						</form>
					</DialogContent>
				</Dialog>
			</div>
			{actionError ? (
				<p className="text-sm text-destructive" role="alert">
					{actionError}
				</p>
			) : null}
			{projectList.length === 0 ? (
				<Card className="overflow-hidden rounded-xl border-dashed bg-card/70 shadow-none">
					<CardContent className="grid gap-8 p-7 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-10">
						<div className="relative flex size-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
							<div className="absolute inset-3 rounded-lg border border-primary/25" />
							<FolderKanbanIcon
								className="relative size-8"
								strokeWidth={1.5}
								aria-hidden="true"
							/>
						</div>
						<div className="space-y-2">
							<CardTitle className="display-title text-2xl tracking-[-0.03em]">
								{m.projects_empty()}
							</CardTitle>
							<CardDescription>
								{m.workspace_onboarding_description()}
							</CardDescription>
						</div>
						<Button
							variant="outline"
							className="rounded-lg"
							onClick={() => setOpen(true)}
						>
							<PlusIcon data-icon="inline-start" />
							{m.project_create()}
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
					{projectList.map((project, index) => (
						<Card
							key={project._id}
							className="group relative overflow-hidden rounded-xl border-border/70 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
						>
							<div
								className={`h-1 ${projectAccents[index % projectAccents.length]}`}
							/>
							<CardHeader className="gap-5 pb-4">
								<div className="flex items-start justify-between gap-3">
									<div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
										<FolderKanbanIcon className="size-5" aria-hidden="true" />
									</div>
									<ArrowUpRightIcon
										className="size-4 text-muted-foreground/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
										aria-hidden="true"
									/>
								</div>
								<div className="space-y-1.5">
									<CardTitle className="truncate text-lg">
										<Link
											to="/dashboard/$workspaceId/projects/$projectId"
											params={{ workspaceId, projectId: project._id }}
											className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
										>
											{project.name}
										</Link>
									</CardTitle>
									<CardDescription className="line-clamp-2 min-h-10">
										{project.description || m.projects_empty()}
									</CardDescription>
								</div>
							</CardHeader>
							<CardContent className="space-y-5">
								<div className="space-y-2">
									<div className="flex items-center justify-between gap-3 font-mono text-xs">
										<span className="text-muted-foreground">
											{m.project_progress({ progress: project.completion })}
										</span>
										<span className="font-semibold text-foreground">
											{project.completion}%
										</span>
									</div>
									<div className="h-1.5 overflow-hidden rounded-full bg-muted">
										<div
											className={`h-full rounded-full ${projectAccents[index % projectAccents.length]} transition-[width]`}
											style={{ width: `${project.completion}%` }}
										/>
									</div>
								</div>
								<div className="flex items-center justify-between gap-3 border-t border-border/60 pt-4">
									<span className="flex items-center gap-1.5 text-sm text-muted-foreground">
										<CheckCircle2Icon className="size-4" aria-hidden="true" />
										{project.taskCount} {m.tasks()}
									</span>
									{members.data?.find((member) => member.id === user._id)
										?.role === "owner" ? (
										<Button
											size="sm"
											variant="ghost"
											className="text-muted-foreground hover:text-destructive"
											disabled={archive.isPending}
											onClick={() =>
												archive.mutate(
													{ projectId: project._id },
													{ onError: () => setActionError(m.error_generic()) },
												)
											}
										>
											<ArchiveIcon data-icon="inline-start" />
											{m.project_archive()}
										</Button>
									) : null}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
