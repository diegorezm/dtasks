import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { DashboardPage } from "#/features/dashboard/views/dashboard-page";

export const Route = createFileRoute("/__private/dashboard/$workspaceId/")({
	component: OverviewRoute,
});

function OverviewRoute() {
	const { user } = useRouteContext({ from: "/__private" });
	return <DashboardPage user={user} />;
}
