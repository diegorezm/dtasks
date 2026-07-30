import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import type { DragEvent } from "react";
import { useState } from "react";
import { routeParamId } from "#/core/convex/id";
import { m } from "#/paraglide/messages";
import { api } from "../../../../convex/_generated/api";
import { CreateTaskDialog } from "../components/create-task-dialog";
import { TaskBoardColumn } from "../components/task-board-column";
import {
	CreateTaskTrigger,
	TaskBoardHeader,
} from "../components/task-board-header";
import { columns, type TaskStatus } from "../components/task-board-types";

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

	function createTask(form: FormData, close: () => void) {
		create.mutate(
			{
				projectId: routeParamId<"projects">(projectId),
				title: String(form.get("title")),
				description: String(form.get("description")),
				priority: priorityFromForm(form.get("priority")),
				assigneeId: String(form.get("assignee") || "") || undefined,
				dueDate: String(form.get("dueDate") || "") || undefined,
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

	function handleDragStart(event: DragEvent<HTMLDivElement>, taskId: string) {
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
		return <p>{m.loading()}</p>;
	if (!project.data || tasks.error) return <p>{m.error_generic()}</p>;

	const archived = project.data.status === "archived";
	const taskList = tasks.data ?? [];
	const completed = taskList.filter((task) => task.status === "done").length;
	const progress = taskList.length
		? Math.round((completed / taskList.length) * 100)
		: 0;

	return (
		<div className="flex min-w-0 flex-col gap-6">
			<TaskBoardHeader
				workspaceId={workspaceId}
				project={project.data}
				progress={progress}
			>
				<CreateTaskDialog
					members={members.data ?? []}
					isPending={create.isPending}
					error={actionError}
					onSubmit={createTask}
				>
					<CreateTaskTrigger />
				</CreateTaskDialog>
			</TaskBoardHeader>

			{actionError ? (
				<p className="text-sm text-destructive" role="alert">
					{actionError}
				</p>
			) : null}

			<div className="-mx-1 overflow-x-auto px-1 pb-4">
				<div className="grid min-w-max grid-flow-col auto-cols-[minmax(288px,1fr)] gap-4 xl:grid-flow-row xl:grid-cols-5">
					{columns.map((status, columnIndex) => (
						<TaskBoardColumn
							key={status}
							status={status}
							columnIndex={columnIndex}
							tasks={taskList.filter((task) => task.status === status)}
							members={members.data ?? []}
							archived={archived}
							isDropTarget={
								overStatus === status && draggedTaskId !== undefined
							}
							draggedTaskId={draggedTaskId}
							isMoving={move.isPending}
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
					))}
				</div>
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
