import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import type { FunctionReturnType } from "convex/server";
import {
	CopyIcon,
	CrownIcon,
	LinkIcon,
	LogOutIcon,
	ShieldCheckIcon,
	Trash2Icon,
	UserPlusIcon,
	UsersIcon,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Separator } from "#/components/ui/separator";
import { Skeleton } from "#/components/ui/skeleton";
import { routeParamId } from "#/core/convex/id";
import { m } from "#/paraglide/messages";
import { api } from "../../../../convex/_generated/api";
import { useWorkspaceAccess, type WorkspaceAccess } from "../workspace-access";

type WorkspaceRole = WorkspaceAccess["role"];
type AssignableRole = Exclude<WorkspaceRole, "owner">;

const assignableRoles: readonly AssignableRole[] = [
	"admin",
	"member",
	"viewer",
];

export function WorkspaceMembersPage({ workspaceId }: { workspaceId: string }) {
	const { convexQueryClient } = useRouteContext({ from: "__root__" });
	const navigate = useNavigate();
	const access = useWorkspaceAccess();
	const workspace = useQuery(
		convexQueryClient.queryOptions(api.workspaces.get, {
			workspaceId: routeParamId<"workspaces">(workspaceId),
		}),
	);
	const members = useQuery(
		convexQueryClient.queryOptions(api.workspaces.listMembers, {
			workspaceId: routeParamId<"workspaces">(workspaceId),
		}),
	);
	const invitations = useQuery({
		...convexQueryClient.queryOptions(api.invitations.list, {
			workspaceId: routeParamId<"workspaces">(workspaceId),
		}),
		enabled: access.can("members.invite"),
	});
	const invite = useMutation({
		mutationFn: useConvexMutation(api.invitations.create),
		onSuccess: () => void invitations.refetch(),
	});
	const revoke = useMutation({
		mutationFn: useConvexMutation(api.invitations.revoke),
		onSuccess: () => void invitations.refetch(),
	});
	const updateRole = useMutation({
		mutationFn: useConvexMutation(api.workspaceMembers.updateRole),
		onSuccess: () => void members.refetch(),
	});
	const remove = useMutation({
		mutationFn: useConvexMutation(api.workspaceMembers.remove),
		onSuccess: () => void members.refetch(),
	});
	const leave = useMutation({
		mutationFn: useConvexMutation(api.workspaceMembers.leave),
	});
	const transfer = useMutation({
		mutationFn: useConvexMutation(api.workspaceMembers.transferOwnership),
	});
	const [actionError, setActionError] = useState<string>();
	const [invitationLink, setInvitationLink] = useState<string>();
	const [transferOpen, setTransferOpen] = useState(false);

	const pendingInvitations = (invitations.data ?? []).filter(
		(invitation) =>
			invitation.status === "pending" && invitation.expiresAt > Date.now(),
	);
	const transferableMembers = (members.data ?? []).filter(
		(member) => member.role !== "owner",
	);

	function submitInvitation(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setActionError(undefined);
		setInvitationLink(undefined);
		const formElement = event.currentTarget;
		const form = new FormData(formElement);
		invite.mutate(
			{
				workspaceId: routeParamId<"workspaces">(workspaceId),
				email: String(form.get("email")),
				role: roleFromForm(form.get("role")),
			},
			{
				onError: () => setActionError(m.error_generic()),
				onSuccess: (invitationId) => {
					const link = `${window.location.origin}/invite/${invitationId}`;
					setInvitationLink(link);
					formElement.reset();
				},
			},
		);
	}

	if (workspace.isLoading || members.isLoading) return <MembersSkeleton />;
	if (!workspace.data || members.error) return <p>{m.error_generic()}</p>;

	return (
		<div className="flex flex-col gap-8">
			<header className="flex flex-col gap-3 border-b border-border/70 pb-7">
				<div className="flex items-center gap-2 text-primary">
					<UsersIcon className="size-4" aria-hidden="true" />
					<p className="font-mono text-xs font-semibold uppercase tracking-[0.16em]">
						{workspace.data.name}
					</p>
				</div>
				<h1 className="display-title text-4xl tracking-[-0.04em] sm:text-5xl">
					{m.workspace_members_title()}
				</h1>
				<p className="max-w-2xl text-sm leading-6 text-muted-foreground">
					{m.workspace_members_description()}
				</p>
			</header>

			{actionError ? (
				<p className="text-sm text-destructive" role="alert">
					{actionError}
				</p>
			) : null}

			<div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,0.75fr)]">
				<Card>
					<CardHeader>
						<CardTitle>{m.workspace_members_active()}</CardTitle>
						<CardDescription>
							{m.workspace_members_count({ count: members.data?.length ?? 0 })}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-0">
						{members.data?.map((member, index) => (
							<div key={member.membershipId}>
								{index > 0 ? <Separator /> : null}
								<MemberRow
									member={member}
									actorRole={access.role}
									currentUserId={access.userId}
									isPending={updateRole.isPending || remove.isPending}
									onRoleChange={(role) => {
										setActionError(undefined);
										updateRole.mutate(
											{
												workspaceId: routeParamId<"workspaces">(workspaceId),
												membershipId: member.membershipId,
												role,
											},
											{ onError: () => setActionError(m.error_generic()) },
										);
									}}
									onRemove={() => {
										if (!window.confirm(m.workspace_member_remove_confirm()))
											return;
										setActionError(undefined);
										remove.mutate(
											{
												workspaceId: routeParamId<"workspaces">(workspaceId),
												membershipId: member.membershipId,
											},
											{ onError: () => setActionError(m.error_generic()) },
										);
									}}
								/>
							</div>
						))}
					</CardContent>
				</Card>

				<div className="flex flex-col gap-6">
					{access.can("members.invite") ? (
						<Card>
							<CardHeader>
								<CardTitle>{m.invite_members()}</CardTitle>
								<CardDescription>
									{m.workspace_invite_description()}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={submitInvitation}>
									<FieldGroup>
										<Field>
											<FieldLabel htmlFor="invite-email">
												{m.invite_email()}
											</FieldLabel>
											<Input
												id="invite-email"
												name="email"
												type="email"
												required
											/>
										</Field>
										<Field>
											<FieldLabel>{m.workspace_role()}</FieldLabel>
											<Select name="role" defaultValue="member">
												<SelectTrigger className="w-full">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{inviteRolesFor(access.role).map((role) => (
															<SelectItem key={role} value={role}>
																{roleLabel(role)}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
										</Field>
										{invite.error ? (
											<FieldError>{m.error_generic()}</FieldError>
										) : null}
										<Button type="submit" disabled={invite.isPending}>
											<UserPlusIcon data-icon="inline-start" />
											{m.invite_create()}
										</Button>
									</FieldGroup>
								</form>
							</CardContent>
							{invitationLink ? (
								<CardFooter className="flex-col items-stretch gap-3">
									<p className="text-xs text-muted-foreground">
										{m.invite_link_ready()}
									</p>
									<div className="flex gap-2">
										<Input
											value={invitationLink}
											readOnly
											aria-label={m.invite_link_ready()}
										/>
										<Button
											type="button"
											variant="outline"
											size="icon"
											aria-label={m.invite_copy()}
											onClick={() =>
												void navigator.clipboard.writeText(invitationLink)
											}
										>
											<CopyIcon />
										</Button>
									</div>
								</CardFooter>
							) : null}
						</Card>
					) : null}

					{access.can("members.invite") ? (
						<Card>
							<CardHeader>
								<CardTitle>{m.invite_pending()}</CardTitle>
								<CardDescription>
									{m.workspace_pending_description()}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-3">
								{pendingInvitations.length ? (
									pendingInvitations.map((invitation) => (
										<div
											key={invitation._id}
											className="flex items-center gap-3 rounded-lg border p-3"
										>
											<LinkIcon
												className="size-4 shrink-0 text-muted-foreground"
												aria-hidden="true"
											/>
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm font-medium">
													{invitation.email}
												</p>
												<p className="text-xs text-muted-foreground">
													{roleLabel(invitation.role)}
												</p>
											</div>
											<Button
												variant="ghost"
												size="icon-sm"
												aria-label={m.workspace_invitation_revoke()}
												disabled={revoke.isPending}
												onClick={() =>
													revoke.mutate(
														{ invitationId: invitation._id },
														{
															onError: () => setActionError(m.error_generic()),
														},
													)
												}
											>
												<Trash2Icon />
											</Button>
										</div>
									))
								) : (
									<p className="text-sm text-muted-foreground">
										{m.workspace_pending_empty()}
									</p>
								)}
							</CardContent>
						</Card>
					) : null}

					<Card>
						<CardHeader>
							<CardTitle>{m.workspace_access_title()}</CardTitle>
							<CardDescription>
								{m.workspace_access_description()}
							</CardDescription>
							<CardAction>
								<RoleBadge role={access.role} />
							</CardAction>
						</CardHeader>
						<CardContent>
							<p className="text-sm leading-6 text-muted-foreground">
								{roleDescription(access.role)}
							</p>
						</CardContent>
						<CardFooter className="flex-wrap gap-2">
							{access.can("ownership.transfer") ? (
								<Dialog open={transferOpen} onOpenChange={setTransferOpen}>
									<DialogTrigger asChild>
										<Button variant="outline">
											<CrownIcon data-icon="inline-start" />
											{m.workspace_transfer_ownership()}
										</Button>
									</DialogTrigger>
									<TransferDialog
										members={transferableMembers}
										isPending={transfer.isPending}
										onSubmit={(membershipId) =>
											transfer.mutate(
												{
													workspaceId: routeParamId<"workspaces">(workspaceId),
													membershipId,
												},
												{
													onError: () => setActionError(m.error_generic()),
													onSuccess: () => window.location.reload(),
												},
											)
										}
									/>
								</Dialog>
							) : (
								<Button
									variant="outline"
									disabled={leave.isPending}
									onClick={() => {
										if (!window.confirm(m.workspace_leave_confirm())) return;
										leave.mutate(
											{ workspaceId: routeParamId<"workspaces">(workspaceId) },
											{
												onError: () => setActionError(m.error_generic()),
												onSuccess: () => void navigate({ to: "/dashboard" }),
											},
										);
									}}
								>
									<LogOutIcon data-icon="inline-start" />
									{m.workspace_leave()}
								</Button>
							)}
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
}

type Member = FunctionReturnType<typeof api.workspaces.listMembers>[number];

function MemberRow({
	member,
	actorRole,
	currentUserId,
	isPending,
	onRoleChange,
	onRemove,
}: {
	member: Member;
	actorRole: WorkspaceRole;
	currentUserId: string;
	isPending: boolean;
	onRoleChange: (role: AssignableRole) => void;
	onRemove: () => void;
}) {
	const displayName =
		member.name || member.email || m.workspace_unknown_member();
	const isCurrentUser = member.id === currentUserId;
	const manageable = !isCurrentUser && canManageTarget(actorRole, member.role);
	const availableRoles = rolesForManager(actorRole);

	return (
		<div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
			<Avatar size="lg">
				{member.image ? (
					<AvatarImage src={member.image} alt={displayName} />
				) : null}
				<AvatarFallback>{initials(displayName)}</AvatarFallback>
			</Avatar>
			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-center gap-2">
					<p className="truncate font-medium">{displayName}</p>
					{isCurrentUser ? (
						<Badge variant="secondary">{m.workspace_you()}</Badge>
					) : null}
				</div>
				{member.email && member.email !== member.name ? (
					<p className="truncate text-sm text-muted-foreground">
						{member.email}
					</p>
				) : null}
			</div>
			<div className="flex items-center gap-2 sm:justify-end">
				{manageable ? (
					<Select
						value={member.role}
						onValueChange={(value) => {
							const role = assignableRole(value);
							if (role) onRoleChange(role);
						}}
						disabled={isPending}
					>
						<SelectTrigger size="sm" className="min-w-28">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{availableRoles.map((role) => (
									<SelectItem key={role} value={role}>
										{roleLabel(role)}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				) : (
					<RoleBadge role={member.role} />
				)}
				{manageable ? (
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label={m.workspace_member_remove()}
						disabled={isPending}
						onClick={onRemove}
					>
						<Trash2Icon />
					</Button>
				) : null}
			</div>
		</div>
	);
}

function TransferDialog({
	members,
	isPending,
	onSubmit,
}: {
	members: Member[];
	isPending: boolean;
	onSubmit: (membershipId: Member["membershipId"]) => void;
}) {
	const [membershipId, setMembershipId] = useState<Member["membershipId"]>();
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>{m.workspace_transfer_ownership()}</DialogTitle>
				<DialogDescription>
					{m.workspace_transfer_description()}
				</DialogDescription>
			</DialogHeader>
			<Field>
				<FieldLabel>{m.workspace_new_owner()}</FieldLabel>
				<Select
					onValueChange={(value) => {
						const member = members.find(
							(candidate) => candidate.membershipId === value,
						);
						setMembershipId(member?.membershipId);
					}}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder={m.workspace_select_member()} />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{members.map((member) => (
								<SelectItem
									key={member.membershipId}
									value={member.membershipId}
								>
									{member.name || member.email || m.workspace_unknown_member()}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</Field>
			<DialogFooter>
				<Button
					disabled={!membershipId || isPending}
					onClick={() => membershipId && onSubmit(membershipId)}
				>
					<CrownIcon data-icon="inline-start" />
					{m.workspace_transfer_confirm()}
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}

function RoleBadge({ role }: { role: WorkspaceRole }) {
	return (
		<Badge variant={role === "owner" ? "default" : "secondary"}>
			{role === "owner" ? (
				<CrownIcon data-icon="inline-start" />
			) : (
				<ShieldCheckIcon data-icon="inline-start" />
			)}
			{roleLabel(role)}
		</Badge>
	);
}

function canManageTarget(actor: WorkspaceRole, target: WorkspaceRole) {
	return actor === "owner"
		? target !== "owner"
		: actor === "admin" && (target === "member" || target === "viewer");
}

function rolesForManager(role: WorkspaceRole): readonly AssignableRole[] {
	return role === "owner" ? assignableRoles : ["member", "viewer"];
}

function inviteRolesFor(role: WorkspaceRole): readonly AssignableRole[] {
	return rolesForManager(role);
}

function roleFromForm(value: FormDataEntryValue | null): AssignableRole {
	if (typeof value !== "string") return "member";
	return assignableRole(value) ?? "member";
}

function assignableRole(value: string): AssignableRole | undefined {
	if (value === "admin" || value === "member" || value === "viewer")
		return value;
	return undefined;
}

function roleLabel(role: WorkspaceRole) {
	if (role === "owner") return m.workspace_role_owner();
	if (role === "admin") return m.workspace_role_admin();
	if (role === "member") return m.workspace_role_member();
	return m.workspace_role_viewer();
}

function roleDescription(role: WorkspaceRole) {
	if (role === "owner") return m.workspace_role_owner_description();
	if (role === "admin") return m.workspace_role_admin_description();
	if (role === "member") return m.workspace_role_member_description();
	return m.workspace_role_viewer_description();
}

function initials(value: string) {
	return value
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();
}

function MembersSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<Skeleton className="h-12 w-72" />
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,0.75fr)]">
				<Skeleton className="h-96 rounded-xl" />
				<Skeleton className="h-72 rounded-xl" />
			</div>
		</div>
	);
}
