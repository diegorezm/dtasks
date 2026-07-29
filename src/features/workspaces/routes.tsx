import { useParams } from "@tanstack/react-router";
import { InvitationPage } from "./views/invitation-page";
import { OnboardingPage } from "./views/onboarding-page";

export function OnboardingRoute() {
	return <OnboardingPage />;
}

export function InvitationRoute() {
	const { invitationId } = useParams({
		from: "/__public/invite/$invitationId",
	});

	return <InvitationPage invitationId={invitationId} />;
}
