import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/features/auth/ui/pages/register-page";

export const Route = createFileRoute("/_public/register")({
	component: RegisterPage,
});
