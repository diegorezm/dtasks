export const workspaceRoles = ["owner", "admin", "member", "viewer"] as const;

export type WorkspaceRole = (typeof workspaceRoles)[number];

export const workspacePermissions = [
	"workspace.view",
	"workspace.update",
	"members.view",
	"members.invite",
	"members.manage",
	"projects.view",
	"projects.create",
	"projects.update",
	"projects.archive",
	"tasks.view",
	"tasks.create",
	"tasks.update",
	"tasks.move",
	"tasks.delete",
	"ownership.transfer",
] as const;

export type WorkspacePermission = (typeof workspacePermissions)[number];

export const permissionsByRole: Readonly<
	Record<WorkspaceRole, readonly WorkspacePermission[]>
> = {
	owner: workspacePermissions,
	admin: [
		"workspace.view",
		"workspace.update",
		"members.view",
		"members.invite",
		"members.manage",
		"projects.view",
		"projects.create",
		"projects.update",
		"projects.archive",
		"tasks.view",
		"tasks.create",
		"tasks.update",
		"tasks.move",
		"tasks.delete",
	],
	member: [
		"workspace.view",
		"members.view",
		"projects.view",
		"projects.create",
		"projects.update",
		"tasks.view",
		"tasks.create",
		"tasks.update",
		"tasks.move",
		"tasks.delete",
	],
	viewer: ["workspace.view", "members.view", "projects.view", "tasks.view"],
};

export function hasPermission(
	role: WorkspaceRole,
	permission: WorkspacePermission,
) {
	return permissionsByRole[role].includes(permission);
}

export function canManageMemberRole(
	actorRole: WorkspaceRole,
	targetRole: WorkspaceRole,
	nextRole?: Exclude<WorkspaceRole, "owner">,
) {
	if (targetRole === "owner") return false;
	if (actorRole === "owner") return true;
	if (actorRole !== "admin" || targetRole === "admin") return false;
	return (
		nextRole === undefined || nextRole === "member" || nextRole === "viewer"
	);
}

export function canInviteRole(
	actorRole: WorkspaceRole,
	role: Exclude<WorkspaceRole, "owner">,
) {
	return (
		actorRole === "owner" ||
		(actorRole === "admin" && (role === "member" || role === "viewer"))
	);
}
