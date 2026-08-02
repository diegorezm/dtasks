import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Outlet,
	redirect,
	useRouteContext,
} from "@tanstack/react-router";
import { routeParamId } from "#/core/convex/id";
import { DashboardLayout } from "#/layouts/dashboard-layout";
import { api } from "../../../../convex/_generated/api";
export const Route = createFileRoute("/__private/dashboard/$workspaceId")({
	component: WorkspaceLayout,
});
function WorkspaceLayout() {
	const { workspaceId } = Route.useParams();
	const { user } = useRouteContext({ from: "/__private" });
	const { convexQueryClient } = useRouteContext({ from: "__root__" });
	const workspace = useQuery(
		convexQueryClient.queryOptions(api.workspaces.get, {
			workspaceId: routeParamId<"workspaces">(workspaceId),
		}),
	);
	const access = useQuery(
		convexQueryClient.queryOptions(api.workspaces.getMyAccess, {
			workspaceId: routeParamId<"workspaces">(workspaceId),
		}),
	);
	if (workspace.isLoading || access.isLoading) return null;
	if (!workspace.data || !access.data) throw redirect({ to: "/dashboard" });
	return (
		<DashboardLayout
			access={access.data}
			user={user}
			workspaceId={workspaceId}
			workspaceName={workspace.data.name}
		>
			<Outlet />
		</DashboardLayout>
	);
}
