import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start";
import { createServerFn } from "@tanstack/react-start";
import { api } from "../../../convex/_generated/api";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;

if (!convexUrl || !convexSiteUrl) {
	throw new Error(
		"Missing VITE_CONVEX_URL or VITE_CONVEX_SITE_URL environment variable",
	);
}

export const {
	handler,
	getToken,
	fetchAuthQuery,
	fetchAuthMutation,
	fetchAuthAction,
} = convexBetterAuthReactStart({
	convexUrl,
	convexSiteUrl,
});

export const getCurrentUser = createServerFn({ method: "GET" }).handler(() =>
	fetchAuthQuery(api.auth.getCurrentUser),
);
