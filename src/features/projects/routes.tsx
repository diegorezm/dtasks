import { useParams } from "@tanstack/react-router";
import { ProjectsPage } from "./views/projects-page";

export function ProjectsRoute() {
	const { workspaceId } = useParams({
		from: "/__private/dashboard/$workspaceId/projects/",
	});

	return <ProjectsPage workspaceId={workspaceId} />;
}
