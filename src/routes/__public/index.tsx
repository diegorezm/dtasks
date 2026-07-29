import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "#/features/landing/views/landing-page";

export const Route = createFileRoute("/__public/")({
	component: LandingPage,
});
