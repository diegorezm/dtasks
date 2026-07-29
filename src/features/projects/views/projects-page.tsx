import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useRouteContext } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Badge } from "#/components/ui/badge";
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
import { Textarea } from "#/components/ui/textarea";
import { routeParamId } from "#/core/convex/id";
import { m } from "#/paraglide/messages";
import { api } from "../../../../convex/_generated/api";
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
		return <p>{m.loading()}</p>;
	if (projects.error || !workspace.data) return <p>{m.error_generic()}</p>;
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="font-mono text-xs uppercase text-muted-foreground">
						{workspace.data.name}
					</p>
					<h1 className="display-title text-4xl">{m.projects_title()}</h1>
				</div>
				<Dialog
					open={open}
					onOpenChange={(nextOpen) => {
						setOpen(nextOpen);
						if (!nextOpen) setActionError(undefined);
					}}
				>
					<DialogTrigger asChild>
						<Button>
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
			{(projects.data ?? []).length === 0 ? (
				<Card>
					<CardContent className="p-6 text-muted-foreground">
						{m.projects_empty()}
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{(projects.data ?? []).map((project) => (
						<Card key={project._id}>
							<CardHeader>
								<CardTitle className="truncate">
									<Link
										to="/dashboard/$workspaceId/projects/$projectId"
										params={{ workspaceId, projectId: project._id }}
									>
										{project.name}
									</Link>
								</CardTitle>
								<CardDescription className="line-clamp-2">
									{project.description}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex items-center justify-between gap-3">
								<Badge variant="outline">
									{m.project_progress({ progress: project.completion })}
								</Badge>
								<span className="text-sm text-muted-foreground">
									{project.taskCount} {m.tasks()}
								</span>
								{members.data?.find((member) => member.id === user._id)
									?.role === "owner" ? (
									<Button
										size="sm"
										variant="ghost"
										disabled={archive.isPending}
										onClick={() =>
											archive.mutate(
												{ projectId: project._id },
												{ onError: () => setActionError(m.error_generic()) },
											)
										}
									>
										{m.project_archive()}
									</Button>
								) : null}
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
