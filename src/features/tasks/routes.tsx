import { useParams } from "@tanstack/react-router";
import { TaskBoardPage } from "./views/task-board-page";

export function TaskBoardRoute() {
	const { projectId, workspaceId } = useParams({
		from: "/__private/dashboard/$workspaceId/projects/$projectId",
	});

	return <TaskBoardPage projectId={projectId} workspaceId={workspaceId} />;
}
