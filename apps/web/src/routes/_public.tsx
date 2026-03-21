import { PublicLayout } from "@/features/landing/ui/components/public-layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});
