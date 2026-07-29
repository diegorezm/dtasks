import { createFileRoute } from "@tanstack/react-router";
import { TaskBoardRoute } from "#/features/tasks/routes";
export const Route = createFileRoute(
	"/__private/dashboard/$workspaceId/projects/$projectId",
)({ component: TaskBoardRoute });
