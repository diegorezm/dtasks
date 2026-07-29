import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "#/features/dashboard/views/dashboard-page";

export const Route = createFileRoute("/__private/dashboard/")({
	component: DashboardRoute,
});

function DashboardRoute() {
	const { user } = Route.useRouteContext();

	return <DashboardPage user={user} />;
}
