import type { FunctionReturnType } from "convex/server";
import { createContext, type ReactNode, useContext } from "react";
import type { api } from "../../../convex/_generated/api";

export type WorkspaceAccess = FunctionReturnType<
	typeof api.workspaces.getMyAccess
>;
export type WorkspacePermission = WorkspaceAccess["permissions"][number];

const WorkspaceAccessContext = createContext<WorkspaceAccess | undefined>(
	undefined,
);

export function WorkspaceAccessProvider({
	access,
	children,
}: {
	access: WorkspaceAccess;
	children: ReactNode;
}) {
	return (
		<WorkspaceAccessContext.Provider value={access}>
			{children}
		</WorkspaceAccessContext.Provider>
	);
}

export function useWorkspaceAccess() {
	const access = useContext(WorkspaceAccessContext);
	if (!access) {
		throw new Error("useWorkspaceAccess must be used inside a workspace route");
	}
	return {
		...access,
		can(permission: WorkspacePermission) {
			return access.permissions.some((candidate) => candidate === permission);
		},
	};
}
