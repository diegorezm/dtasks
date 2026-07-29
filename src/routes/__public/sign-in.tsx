import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignInPage } from "#/features/auth/views/sign-in-page";

export const Route = createFileRoute("/__public/sign-in")({
	validateSearch: (search: Record<string, unknown>) => ({
		redirect:
			typeof search.redirect === "string" && /^\/(?!\/)/.test(search.redirect)
				? search.redirect
				: undefined,
	}),
	beforeLoad: ({ context }) => {
		if (context.isAuthenticated) {
			throw redirect({ to: "/" });
		}
	},
	component: SignInPage,
});
