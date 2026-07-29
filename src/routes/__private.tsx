import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getCurrentUser } from "#/features/auth/auth-server";

export const Route = createFileRoute("/__private")({
	beforeLoad: async () => {
		const user = await getCurrentUser();

		if (!user) {
			throw redirect({ to: "/sign-in", search: { redirect: undefined } });
		}

		return { user };
	},
	component: Outlet,
});
