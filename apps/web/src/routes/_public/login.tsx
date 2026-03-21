import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/ui/pages/login-page";

export const Route = createFileRoute("/_public/login")({
  component: LoginPage,
});
