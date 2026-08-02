const recentProjectsLimit = 5;

export function recentProjectsKey(workspaceId: string) {
	return `dtasks:recent-projects:${workspaceId}`;
}

export function readRecentProjectIds(workspaceId: string) {
	try {
		const value: unknown = JSON.parse(
			localStorage.getItem(recentProjectsKey(workspaceId)) ?? "[]",
		);
		return Array.isArray(value)
			? value.filter(
					(projectId): projectId is string => typeof projectId === "string",
				)
			: [];
	} catch {
		return [];
	}
}

export function rememberRecentProject(workspaceId: string, projectId: string) {
	const recentProjectIds = readRecentProjectIds(workspaceId).filter(
		(recentProjectId) => recentProjectId !== projectId,
	);
	localStorage.setItem(
		recentProjectsKey(workspaceId),
		JSON.stringify(
			[projectId, ...recentProjectIds].slice(0, recentProjectsLimit),
		),
	);
}
