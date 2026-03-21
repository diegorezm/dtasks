import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/features/landing/ui/pages/landing-page";

export const Route = createFileRoute("/_public/")({
  component: LandingPage,
});
