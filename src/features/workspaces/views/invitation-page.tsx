import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { routeParamId } from "#/core/convex/id";
import { m } from "#/paraglide/messages";
import { api } from "../../../../convex/_generated/api";
export function InvitationPage({ invitationId }: { invitationId: string }) {
	const navigate = useNavigate();
	const context = useRouteContext({ from: "__root__" });
	const invitation = useQuery(
		context.convexQueryClient.queryOptions(api.invitations.getPublic, {
			invitationId: routeParamId<"workspaceInvitations">(invitationId),
		}),
	);
	const accept = useMutation({
		mutationFn: useConvexMutation(api.invitations.accept),
	});
	const [actionError, setActionError] = useState<string>();
	if (invitation.isLoading) return <p>{m.loading()}</p>;
	if (
		!invitation.data ||
		invitation.data.expired ||
		invitation.data.status !== "pending"
	)
		return <p>{m.invite_invalid()}</p>;
	if (!context.isAuthenticated)
		return (
			<Card>
				<CardHeader>
					<CardTitle>{invitation.data.workspaceName}</CardTitle>
					<CardDescription>{m.invite_signin()}</CardDescription>
				</CardHeader>
				<CardContent>
					<Button asChild>
						<Link
							to="/sign-in"
							search={{ redirect: `/invite/${invitationId}` }}
						>
							{m.invite_signin()}
						</Link>
					</Button>
				</CardContent>
			</Card>
		);
	return (
		<Card>
			<CardHeader>
				<CardTitle>{invitation.data.workspaceName}</CardTitle>
			</CardHeader>
			<CardContent>
				<Button
					disabled={accept.isPending}
					onClick={() =>
						accept.mutate(
							{
								invitationId:
									routeParamId<"workspaceInvitations">(invitationId),
							},
							{
								onError: () => setActionError(m.error_generic()),
								onSuccess: (workspaceId) =>
									void navigate({
										to: "/dashboard/$workspaceId/projects",
										params: { workspaceId },
									}),
							},
						)
					}
				>
					{m.invite_accept()}
				</Button>
				{actionError ? (
					<p className="mt-3 text-sm text-destructive" role="alert">
						{actionError}
					</p>
				) : null}
			</CardContent>
		</Card>
	);
}
