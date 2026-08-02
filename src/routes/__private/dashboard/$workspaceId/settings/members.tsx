import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceMembersRoute } from "#/features/workspaces/routes";

export const Route = createFileRoute(
	"/__private/dashboard/$workspaceId/settings/members",
)({ component: WorkspaceMembersRoute });
