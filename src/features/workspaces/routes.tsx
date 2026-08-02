import { useParams } from "@tanstack/react-router";
import { InvitationPage } from "./views/invitation-page";
import { OnboardingPage } from "./views/onboarding-page";
import { WorkspaceMembersPage } from "./views/workspace-members-page";

export function OnboardingRoute() {
	return <OnboardingPage />;
}

export function InvitationRoute() {
	const { invitationId } = useParams({
		from: "/__public/invite/$invitationId",
	});

	return <InvitationPage invitationId={invitationId} />;
}

export function WorkspaceMembersRoute() {
	const { workspaceId } = useParams({
		from: "/__private/dashboard/$workspaceId/settings/members",
	});
	return <WorkspaceMembersPage workspaceId={workspaceId} />;
}
