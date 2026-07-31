import { useQuery } from "@tanstack/react-query";
import {
	Link,
	Outlet,
	useMatch,
	useRouteContext,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";
import { Separator } from "#/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "#/components/ui/sidebar";
import { routeParamId } from "#/core/convex/id";
import { DashboardSidebar } from "#/features/dashboard/components/dashboard-sidebar";
import { m } from "#/paraglide/messages";
import { api } from "../../convex/_generated/api";

export function DashboardLayout({
	user,
	workspaceId,
	workspaceName,
	children,
}: {
	user: { name?: string | null; email: string; image?: string | null };
	workspaceId: string;
	workspaceName?: string;
	children?: ReactNode;
}) {
	return (
		<SidebarProvider>
			<DashboardSidebar
				user={user}
				workspaceId={workspaceId}
				workspaceName={workspaceName}
			/>
			<SidebarInset>
				<header className="flex h-16 items-center gap-3 border-b px-4">
					<SidebarTrigger />
					<Separator orientation="vertical" className="h-4" />
					<DashboardBreadcrumbs
						workspaceId={workspaceId}
						workspaceName={workspaceName}
					/>
				</header>
				<main className="mx-auto w-full max-w-[1500px] p-4 md:p-7">
					{children ?? <Outlet />}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}

type DashboardBreadcrumbsProps = {
	workspaceId: string;
	workspaceName?: string;
};

function DashboardBreadcrumbs({
	workspaceId,
	workspaceName,
}: DashboardBreadcrumbsProps) {
	const projectMatch = useMatch({
		from: "/__private/dashboard/$workspaceId/projects/$projectId",
		shouldThrow: false,
	});

	if (projectMatch) {
		return (
			<ProjectBreadcrumbs
				workspaceId={workspaceId}
				workspaceName={workspaceName}
				projectId={projectMatch.params.projectId}
			/>
		);
	}

	return <ProjectsBreadcrumbs workspaceName={workspaceName} />;
}

function ProjectsBreadcrumbs({ workspaceName }: { workspaceName?: string }) {
	return (
		<Breadcrumb
			aria-label={m.projects()}
			className="min-w-0 flex-1 overflow-hidden"
		>
			<BreadcrumbList className="w-full flex-nowrap">
				<WorkspaceBreadcrumbItem workspaceName={workspaceName} />
				<BreadcrumbSeparator className="hidden sm:block" />
				<BreadcrumbItem>
					<BreadcrumbPage className="truncate">{m.projects()}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}

function ProjectBreadcrumbs({
	workspaceId,
	workspaceName,
	projectId,
}: DashboardBreadcrumbsProps & { projectId: string }) {
	const { convexQueryClient } = useRouteContext({ from: "__root__" });
	const project = useQuery(
		convexQueryClient.queryOptions(api.projects.get, {
			workspaceId: routeParamId<"workspaces">(workspaceId),
			projectId: routeParamId<"projects">(projectId),
		}),
	);

	return (
		<Breadcrumb
			aria-label={m.projects()}
			className="min-w-0 flex-1 overflow-hidden"
		>
			<BreadcrumbList className="w-full flex-nowrap">
				<WorkspaceBreadcrumbItem workspaceName={workspaceName} />
				<BreadcrumbSeparator className="hidden sm:block" />
				<BreadcrumbItem>
					<BreadcrumbLink
						asChild
						className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
					>
						<Link
							to="/dashboard/$workspaceId/projects"
							params={{ workspaceId }}
						>
							{m.projects()}
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem className="min-w-0">
					<BreadcrumbPage className="block truncate">
						{project.data?.name ?? m.loading()}
					</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}

function WorkspaceBreadcrumbItem({
	workspaceName,
}: {
	workspaceName?: string;
}) {
	return (
		<BreadcrumbItem className="hidden min-w-0 sm:inline-flex">
			<span className="truncate text-muted-foreground">
				{workspaceName ?? "DTasks"}
			</span>
		</BreadcrumbItem>
	);
}
