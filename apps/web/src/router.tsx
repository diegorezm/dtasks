import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import Loader from "./components/loader";

import "./index.css";
import { createQueryClient } from "./lib/query-client";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
	const queryClient = createQueryClient();
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		context: {},
		defaultPendingComponent: () => <Loader />,
		defaultNotFoundComponent: () => <div>Not Found</div>,
		Wrap: ({ children }) => <>{children}</>,
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
		// handleRedirects: true,
	});

	return router;
};

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
