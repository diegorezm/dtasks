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

const projectAccents = [
	{ bar: "bg-primary", tint: "bg-primary/10", text: "text-primary" },
	{ bar: "bg-chart-2", tint: "bg-chart-2/10", text: "text-chart-2" },
	{ bar: "bg-chart-3", tint: "bg-chart-3/10", text: "text-chart-3" },
	{ bar: "bg-chart-4", tint: "bg-chart-4/10", text: "text-chart-4" },
];

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
				<div className="overflow-hidden border-y border-border/70">
					{projectList.map((project, index) => {
						const accent = projectAccents[index % projectAccents.length];
						return (
							<article
								key={project._id}
								className="group relative grid gap-5 px-2 py-5 transition-colors before:absolute before:inset-y-4 before:left-0 before:w-0.5 before:rounded-full before:bg-transparent hover:bg-primary/5 hover:before:bg-primary md:grid-cols-[3.5rem_minmax(0,1.35fr)_minmax(12rem,0.8fr)_auto] md:items-center md:px-4"
							>
								<div
									className={`flex size-11 shrink-0 items-center justify-center rounded-full ${accent.tint} ${accent.text}`}
								>
									<span className="font-mono text-xs font-semibold">
										{String(index + 1).padStart(2, "0")}
									</span>
								</div>
								<div className="min-w-0 space-y-1">
									<h2 className="truncate font-serif text-xl font-semibold tracking-[-0.02em]">
										<Link
											to="/dashboard/$workspaceId/projects/$projectId"
											params={{ workspaceId, projectId: project._id }}
											className="inline-flex max-w-full items-center gap-2 rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
										>
											<span className="truncate underline-offset-4 group-hover:underline group-focus-within:underline">
												{project.name}
											</span>
											<ArrowUpRightIcon
												className="size-4 shrink-0 text-primary opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
												aria-hidden="true"
											/>
										</Link>
									</h2>
									<p className="line-clamp-2 text-sm text-muted-foreground">
										{project.description || m.projects_empty()}
									</p>
								</div>
								<div className="min-w-0 space-y-2">
									<div className="flex items-center justify-between gap-3 font-mono text-xs">
										<span className="text-muted-foreground">
											{m.project_progress({ progress: project.completion })}
										</span>
										<span className="font-semibold">{project.completion}%</span>
									</div>
									<div className="h-1 overflow-hidden rounded-full bg-muted">
										<div
											className={`h-full ${accent.bar} transition-[width]`}
											style={{ width: `${project.completion}%` }}
										/>
									</div>
								</div>
								<div className="flex flex-wrap items-center justify-between gap-3 md:justify-end">
									<span className="flex items-center gap-1.5 whitespace-nowrap font-mono text-xs text-muted-foreground">
										<CheckCircle2Icon className="size-3.5" aria-hidden="true" />
										{project.taskCount} {m.tasks()}
									</span>

									{members.data?.find((member) => member.id === user._id)
										?.role === "owner" ? (
										<Button
											size="sm"
											variant="ghost"
											className="justify-self-start text-muted-foreground hover:text-destructive md:justify-self-end"
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
							</article>
						);
					})}
				</div>
			)}
		</div>
	);
}
