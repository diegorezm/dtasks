import { createFileRoute } from "@tanstack/react-router";
import { OnboardingRoute } from "#/features/workspaces/routes";
export const Route = createFileRoute("/__private/onboarding")({
	component: OnboardingRoute,
});
