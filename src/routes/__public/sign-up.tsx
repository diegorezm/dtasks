import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignUpPage } from "#/features/auth/views/sign-up-page";

export const Route = createFileRoute("/__public/sign-up")({
	beforeLoad: ({ context }) => {
		if (context.isAuthenticated) {
			throw redirect({ to: "/" });
		}
	},
	component: SignUpPage,
});
