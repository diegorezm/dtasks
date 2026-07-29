import { createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "../../../../convex/_generated/api";

export const Route = createFileRoute("/__private/dashboard/")({
	loader: async ({ context }) => {
		const workspaces = await context.queryClient.ensureQueryData(
			context.convexQueryClient.queryOptions(api.workspaces.listMine, {}),
		);
		throw redirect({
			to: workspaces[0] ? "/dashboard/$workspaceId/projects" : "/onboarding",
			params: workspaces[0] ? { workspaceId: workspaces[0]._id } : {},
		});
	},
	component: () => null,
});
