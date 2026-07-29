import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useRouteContext } from "@tanstack/react-router";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import {
	Dialog,
	DialogContent,
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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Textarea } from "#/components/ui/textarea";
import { routeParamId } from "#/core/convex/id";
import { m } from "#/paraglide/messages";
import { api } from "../../../../convex/_generated/api";

const columns = ["backlog", "todo", "in_progress", "review", "done"] as const;
const label = (status: (typeof columns)[number]) => m[`status_${status}`]();
export function TaskBoardPage({
	workspaceId,
	projectId,
}: {
	workspaceId: string;
	projectId: string;
}) {
	const context = useRouteContext({ from: "__root__" });
	const project = useQuery(
		context.convexQueryClient.queryOptions(api.projects.get, {
			workspaceId: routeParamId<"workspaces">(workspaceId),
			projectId: routeParamId<"projects">(projectId),
		}),
	);
	const tasks = useQuery(
		context.convexQueryClient.queryOptions(api.tasks.listByProject, {
			workspaceId: routeParamId<"workspaces">(workspaceId),
			projectId: routeParamId<"projects">(projectId),
		}),
	);
	const members = useQuery(
		context.convexQueryClient.queryOptions(api.workspaces.listMembers, {
			workspaceId: routeParamId<"workspaces">(workspaceId),
		}),
	);
	const create = useMutation({
		mutationFn: useConvexMutation(api.tasks.create),
		onSuccess: () => void tasks.refetch(),
	});
	const move = useMutation({
		mutationFn: useConvexMutation(api.tasks.move),
		onSuccess: () => void tasks.refetch(),
	});
	const remove = useMutation({
		mutationFn: useConvexMutation(api.tasks.remove),
		onSuccess: () => void tasks.refetch(),
	});
	const [open, setOpen] = useState(false);
	const [actionError, setActionError] = useState<string>();
	function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const f = new FormData(e.currentTarget);
		create.mutate(
			{
				projectId: routeParamId<"projects">(projectId),
				title: String(f.get("title")),
				description: String(f.get("description")),
				priority: priorityFromForm(f.get("priority")),
				assigneeId: String(f.get("assignee") || "") || undefined,
				dueDate: String(f.get("dueDate") || "") || undefined,
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
	if (project.isLoading || tasks.isLoading || members.isLoading)
		return <p>{m.loading()}</p>;
	if (!project.data || tasks.error) return <p>{m.error_generic()}</p>;
	const archived = project.data.status === "archived";
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<Button variant="ghost" size="sm" asChild>
						<Link
							to="/dashboard/$workspaceId/projects"
							params={{ workspaceId }}
						>
							{m.back_to_projects()}
						</Link>
					</Button>
					<h1 className="display-title text-4xl">{project.data.name}</h1>
					{project.data.description ? (
						<p className="text-muted-foreground">{project.data.description}</p>
					) : null}
				</div>
				{!archived ? (
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button>
								<PlusIcon data-icon="inline-start" />
								{m.task_create()}
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>{m.task_create()}</DialogTitle>
							</DialogHeader>
							<form onSubmit={submit}>
								<FieldGroup>
									<Field data-invalid={Boolean(actionError) || undefined}>
										<FieldLabel htmlFor="task-title">
											{m.task_title()}
										</FieldLabel>
										<Input
											id="task-title"
											name="title"
											required
											maxLength={200}
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor="task-description">
											{m.task_description()}
										</FieldLabel>
										<Textarea
											id="task-description"
											name="description"
											maxLength={10000}
										/>
									</Field>
									{actionError ? <FieldError>{actionError}</FieldError> : null}
									<Field>
										<FieldLabel>{m.task_priority()}</FieldLabel>
										<Select name="priority" defaultValue="none">
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{["none", "low", "medium", "high"].map((value) => (
														<SelectItem key={value} value={value}>
															{m[`priority_${value}` as "priority_none"]()}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</Field>
									<Field>
										<FieldLabel>{m.task_assignee()}</FieldLabel>
										<Select name="assignee">
											<SelectTrigger>
												<SelectValue placeholder={m.task_unassigned()} />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{members.data?.map((member) => (
														<SelectItem key={member.id} value={member.id}>
															{member.name || member.email || member.id}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</Field>
									<Field>
										<FieldLabel htmlFor="due-date">
											{m.task_due_date()}
										</FieldLabel>
										<Input id="due-date" name="dueDate" type="date" />
									</Field>
									<Button type="submit" disabled={create.isPending}>
										{m.task_save()}
									</Button>
								</FieldGroup>
							</form>
						</DialogContent>
					</Dialog>
				) : (
					<Badge>{m.project_archived()}</Badge>
				)}
			</div>
			{actionError ? (
				<p className="text-sm text-destructive" role="alert">
					{actionError}
				</p>
			) : null}
			<div className="grid min-w-0 grid-flow-col auto-cols-[minmax(260px,1fr)] gap-4 overflow-x-auto pb-3 xl:grid-flow-row xl:grid-cols-5">
				{columns.map((status, index) => (
					<section
						key={status}
						className="flex min-h-96 flex-col gap-3 rounded-lg bg-muted/50 p-3"
					>
						<h2 className="font-medium">{label(status)}</h2>
						{tasks.data
							?.filter((task) => task.status === status)
							.map((task) => (
								<Card key={task._id}>
									<CardContent className="flex flex-col gap-3 p-3">
										<button
											type="button"
											className="text-left font-medium"
											onClick={() =>
												!archived &&
												window.alert(task.description || task.title)
											}
										>
											{task.title}
										</button>
										<div className="flex flex-wrap gap-2">
											<Badge variant="outline">
												{m[`priority_${task.priority}` as "priority_none"]()}
											</Badge>
											{task.dueDate ? (
												<Badge variant="secondary">
													{new Intl.DateTimeFormat(undefined, {
														dateStyle: "medium",
													}).format(new Date(`${task.dueDate}T00:00:00`))}
												</Badge>
											) : null}
										</div>
										<div className="flex items-center justify-between">
											<Button
												aria-label={m.status_backlog()}
												size="icon-sm"
												variant="ghost"
												disabled={archived || index === 0 || move.isPending}
												onClick={() =>
													move.mutate(
														{ taskId: task._id, status: columns[index - 1] },
														{
															onError: () => setActionError(m.error_generic()),
														},
													)
												}
											>
												<ChevronLeftIcon />
											</Button>
											<Button
												size="sm"
												variant="ghost"
												disabled={archived || remove.isPending}
												onClick={() => {
													if (window.confirm(m.task_delete_confirm()))
														remove.mutate(
															{ taskId: task._id },
															{
																onError: () =>
																	setActionError(m.error_generic()),
															},
														);
												}}
											>
												{m.task_delete()}
											</Button>
											<Button
												aria-label={m.status_done()}
												size="icon-sm"
												variant="ghost"
												disabled={
													archived ||
													index === columns.length - 1 ||
													move.isPending
												}
												onClick={() =>
													move.mutate(
														{ taskId: task._id, status: columns[index + 1] },
														{
															onError: () => setActionError(m.error_generic()),
														},
													)
												}
											>
												<ChevronRightIcon />
											</Button>
										</div>
									</CardContent>
								</Card>
							)) ?? (
							<p className="text-sm text-muted-foreground">
								{m.column_empty()}
							</p>
						)}
					</section>
				))}
			</div>
		</div>
	);
}

function priorityFromForm(
	value: FormDataEntryValue | null,
): "none" | "low" | "medium" | "high" {
	const priority = typeof value === "string" ? value : "none";

	switch (priority) {
		case "low":
		case "medium":
		case "high":
		case "none":
			return priority;
		default:
			return "none";
	}
}
