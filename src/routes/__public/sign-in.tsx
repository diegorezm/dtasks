import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignInPage } from "#/features/auth/views/sign-in-page";

export const Route = createFileRoute("/__public/sign-in")({
	beforeLoad: ({ context }) => {
		if (context.isAuthenticated) {
			throw redirect({ to: "/" });
		}
	},
	component: SignInPage,
});
