import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import type { DragEvent } from "react";
import { useEffect, useState } from "react";
import { Skeleton } from "#/components/ui/skeleton";
import { routeParamId } from "#/core/convex/id";
import { rememberRecentProject } from "#/core/project-preferences";
import { m } from "#/paraglide/messages";
import { api } from "../../../../convex/_generated/api";
import { CreateTaskDialog } from "../components/create-task-dialog";
import { TaskBoardColumn } from "../components/task-board-column";
import { TaskBoardFilters } from "../components/task-board-filters";
import {
	CreateTaskTrigger,
	TaskBoardHeader,
} from "../components/task-board-header";
import { columns, type TaskStatus } from "../components/task-board-types";
import {
	type TaskBoardView,
	TaskBoardViewControls,
} from "../components/task-board-view-controls";
import { TaskListView } from "../components/task-list-view";
import { useTaskCreateStore } from "../hooks/use-task-create-store";

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
	const [actionError, setActionError] = useState<string>();
	const [draggedTaskId, setDraggedTaskId] = useState<string>();
	const [overStatus, setOverStatus] = useState<TaskStatus>();
	const [query, setQuery] = useState("");
	const [priorityFilter, setPriorityFilter] = useState("all");
	const [assigneeFilter, setAssigneeFilter] = useState("all");
	const [view, setView] = useState<TaskBoardView>("board");
	const [visibleStatuses, setVisibleStatuses] = useState<TaskStatus[]>([
		...columns,
	]);
	const [preferencesReady, setPreferencesReady] = useState(false);
	const createStatus = useTaskCreateStore((state) => state.status);
	const openTaskCreate = useTaskCreateStore((state) => state.openForStatus);
	const preferenceKey = `dtasks:task-view:${workspaceId}:${projectId}`;

	useEffect(() => {
		if (project.data) rememberRecentProject(workspaceId, projectId);
	}, [project.data, projectId, workspaceId]);

	useEffect(() => {
		try {
			const saved = localStorage.getItem(preferenceKey);
			if (saved) {
				const preferences: unknown = JSON.parse(saved);
				if (isTaskViewPreferences(preferences)) {
					setView(preferences.view);
					setVisibleStatuses(preferences.visibleStatuses);
				}
			}
		} catch {
			// Preferences are optional and should never block the board.
		} finally {
			setPreferencesReady(true);
		}
	}, [preferenceKey]);

	useEffect(() => {
		if (!preferencesReady) return;
		localStorage.setItem(
			preferenceKey,
			JSON.stringify({ view, visibleStatuses }),
		);
	}, [preferenceKey, preferencesReady, view, visibleStatuses]);

	function createTask(form: FormData, close: () => void) {
		create.mutate(
			{
				projectId: routeParamId<"projects">(projectId),
				title: String(form.get("title")),
				description: String(form.get("description")),
				priority: priorityFromForm(form.get("priority")),
				assigneeId: String(form.get("assignee") || "") || undefined,
				dueDate: String(form.get("dueDate") || "") || undefined,
				status: createStatus,
			},
			{
				onError: () => setActionError(m.error_generic()),
				onSuccess: () => {
					setActionError(undefined);
					close();
				},
			},
		);
	}

	function handleDragStart(event: DragEvent<HTMLElement>, taskId: string) {
		setDraggedTaskId(taskId);
		event.dataTransfer.effectAllowed = "move";
		event.dataTransfer.setData("text/plain", taskId);
	}

	function handleDrop(status: TaskStatus) {
		const task = tasks.data?.find((item) => item._id === draggedTaskId);
		setDraggedTaskId(undefined);
		setOverStatus(undefined);
		if (!task || task.status === status) return;
		move.mutate(
			{ taskId: task._id, status },
			{ onError: () => setActionError(m.error_generic()) },
		);
	}

	if (project.isLoading || tasks.isLoading || members.isLoading)
		return <TaskBoardSkeleton />;
	if (!project.data || tasks.error)
		return (
			<section
				className="flex min-h-72 flex-col items-center justify-center rounded-[1.75rem] bg-muted/35 px-6 text-center"
				role="alert"
			>
				<p className="text-lg font-semibold tracking-[-0.02em]">
					{m.task_board_error_title()}
				</p>
				<p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
					{m.error_generic()}
				</p>
			</section>
		);

	const archived = project.data.status === "archived";
	const taskList = tasks.data ?? [];
	const completed = taskList.filter((task) => task.status === "done").length;
	const progress = taskList.length
		? Math.round((completed / taskList.length) * 100)
		: 0;
	const normalizedQuery = query.trim().toLocaleLowerCase();
	const filteredTasks = taskList.filter((task) => {
		const matchesQuery =
			normalizedQuery.length === 0 ||
			task.title.toLocaleLowerCase().includes(normalizedQuery) ||
			task.description?.toLocaleLowerCase().includes(normalizedQuery);
		const matchesPriority =
			priorityFilter === "all" || task.priority === priorityFilter;
		const matchesAssignee =
			assigneeFilter === "all" ||
			(assigneeFilter === "unassigned"
				? !task.assigneeId
				: task.assigneeId === assigneeFilter);

		return matchesQuery && matchesPriority && matchesAssignee;
	});

	return (
		<div className="flex min-w-0 flex-col gap-5">
			<TaskBoardHeader
				workspaceId={workspaceId}
				project={project.data}
				progress={progress}
				completed={completed}
				total={taskList.length}
			>
				<CreateTaskTrigger onClick={() => openTaskCreate("backlog")} />
			</TaskBoardHeader>
			<CreateTaskDialog
				members={members.data ?? []}
				isPending={create.isPending}
				error={actionError}
				onSubmit={createTask}
			/>

			{actionError ? (
				<p
					className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
					role="alert"
				>
					{actionError}
				</p>
			) : null}

			<div className="flex flex-col gap-3 lg:flex-row lg:items-center">
				<TaskBoardFilters
					className="min-w-0 flex-1 border-b-0 pb-0"
					query={query}
					priority={priorityFilter}
					assignee={assigneeFilter}
					members={members.data ?? []}
					resultCount={filteredTasks.length}
					totalCount={taskList.length}
					onQueryChange={setQuery}
					onPriorityChange={setPriorityFilter}
					onAssigneeChange={setAssigneeFilter}
					onClear={() => {
						setQuery("");
						setPriorityFilter("all");
						setAssigneeFilter("all");
					}}
				/>
				<TaskBoardViewControls
					view={view}
					visibleStatuses={visibleStatuses}
					onViewChange={setView}
					onVisibleStatusesChange={setVisibleStatuses}
				/>
			</div>

			<section aria-label={m.task_board_label()}>
				{view === "board" ? (
					<div className="-mx-1 overflow-x-auto px-1 pb-5">
						<div
							className="grid min-w-max gap-3 xl:min-w-0"
							style={{
								gridTemplateColumns: `repeat(${visibleStatuses.length}, minmax(17rem, 1fr))`,
							}}
						>
							{columns
								.filter((status) => visibleStatuses.includes(status))
								.map((status) => (
									<TaskBoardColumn
										key={status}
										status={status}
										tasks={filteredTasks.filter(
											(task) => task.status === status,
										)}
										members={members.data ?? []}
										archived={archived}
										isDropTarget={
											overStatus === status && draggedTaskId !== undefined
										}
										draggedTaskId={draggedTaskId}
										isRemoving={remove.isPending}
										onDragEnter={(event, laneStatus) => {
											if (!archived && draggedTaskId) {
												event.preventDefault();
												setOverStatus(laneStatus);
											}
										}}
										onDragOver={(event) => {
											if (!archived && draggedTaskId) event.preventDefault();
										}}
										onDrop={(event, laneStatus) => {
											event.preventDefault();
											if (!archived) handleDrop(laneStatus);
										}}
										onDragStart={handleDragStart}
										onDragEnd={() => {
											setDraggedTaskId(undefined);
											setOverStatus(undefined);
										}}
										onAddTask={openTaskCreate}
										onRemove={(taskId) => {
											if (window.confirm(m.task_delete_confirm()))
												remove.mutate(
													{ taskId },
													{ onError: () => setActionError(m.error_generic()) },
												);
										}}
									/>
								))}
						</div>
					</div>
				) : (
					<TaskListView
						tasks={filteredTasks}
						members={members.data ?? []}
						visibleStatuses={visibleStatuses}
						archived={archived}
						isMoving={move.isPending}
						isRemoving={remove.isPending}
						onMove={(taskId, status) =>
							move.mutate(
								{ taskId, status },
								{ onError: () => setActionError(m.error_generic()) },
							)
						}
						onRemove={(taskId) => {
							if (window.confirm(m.task_delete_confirm()))
								remove.mutate(
									{ taskId },
									{ onError: () => setActionError(m.error_generic()) },
								);
						}}
					/>
				)}
			</section>
		</div>
	);
}

function isTaskViewPreferences(value: unknown): value is {
	view: TaskBoardView;
	visibleStatuses: TaskStatus[];
} {
	if (!value || typeof value !== "object") return false;
	const preferences = value as Record<string, unknown>;
	return (
		(preferences.view === "board" || preferences.view === "list") &&
		Array.isArray(preferences.visibleStatuses) &&
		preferences.visibleStatuses.length > 0 &&
		preferences.visibleStatuses.every((status) =>
			columns.includes(status as (typeof columns)[number]),
		)
	);
}

function TaskBoardSkeleton() {
	return (
		<output className="flex flex-col gap-7" aria-label={m.loading()}>
			<div className="border-b pb-6">
				<Skeleton className="h-4 w-28" />
				<Skeleton className="mt-10 h-11 w-2/5 min-w-56" />
				<Skeleton className="mt-4 h-5 w-3/5 min-w-64" />
			</div>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
				{columns.map((status) => (
					<div key={status} className="rounded-xl border bg-muted/45 p-3">
						<Skeleton className="mb-4 h-5 w-24" />
						<Skeleton className="h-36 rounded-xl" />
						<Skeleton className="mt-3 h-28 rounded-xl" />
					</div>
				))}
			</div>
		</output>
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
