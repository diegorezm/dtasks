import { createFileRoute } from "@tanstack/react-router";
import { InvitationRoute } from "#/features/workspaces/routes";
export const Route = createFileRoute("/__public/invite/$invitationId")({
	component: InvitationRoute,
});
