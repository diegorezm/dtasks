import { createFileRoute } from "@tanstack/react-router";
import { ProjectsRoute } from "#/features/projects/routes";
export const Route = createFileRoute(
	"/__private/dashboard/$workspaceId/projects/",
)({
	component: ProjectsRoute,
});
