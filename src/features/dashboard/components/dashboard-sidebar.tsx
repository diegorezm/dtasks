import { useQuery } from "@tanstack/react-query";
import {
	Link,
	useMatch,
	useRouteContext,
	useRouterState,
} from "@tanstack/react-router";
import {
	BellIcon,
	ChartNoAxesColumnIncreasingIcon,
	CircleHelpIcon,
	FolderKanbanIcon,
	LayoutDashboardIcon,
	LogOutIcon,
	MessageSquareTextIcon,
	MoreHorizontalIcon,
	Settings2Icon,
	UsersIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "#/components/ui/sidebar";
import { routeParamId } from "#/core/convex/id";
import { readRecentProjectIds } from "#/core/project-preferences";
import { authClient } from "#/features/auth/auth-client";
import { m } from "#/paraglide/messages";
import { api } from "../../../../convex/_generated/api";

type DashboardSidebarProps = {
	user: { name?: string | null; email: string; image?: string | null };
	workspaceName?: string;
	workspaceId: string;
};

const primaryNavigation = [
	{ label: m.dashboard_nav_inbox, icon: MessageSquareTextIcon, badge: "4" },
	{ label: m.dashboard_nav_customers, icon: UsersIcon },
	{ label: m.dashboard_nav_reports, icon: ChartNoAxesColumnIncreasingIcon },
];

const secondaryNavigation = [
	{ label: m.dashboard_nav_notifications, icon: BellIcon },
	{ label: m.dashboard_nav_help, icon: CircleHelpIcon },
];

const activeClass =
	"relative h-10 rounded-lg px-3 text-sidebar-foreground/70 data-[active=true]:font-semibold data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm data-[active=true]:before:absolute data-[active=true]:before:inset-y-2 data-[active=true]:before:left-0 data-[active=true]:before:w-0.5 data-[active=true]:before:rounded-full data-[active=true]:before:bg-primary";

export function DashboardSidebar({
	user,
	workspaceName,
	workspaceId,
}: DashboardSidebarProps) {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const { convexQueryClient } = useRouteContext({ from: "__root__" });
	const projects = useQuery(
		convexQueryClient.queryOptions(api.projects.list, {
			workspaceId: routeParamId<"workspaces">(workspaceId),
		}),
	);
	const overviewMatch = useMatch({
		from: "/__private/dashboard/$workspaceId/",
		shouldThrow: false,
	});
	const projectListMatch = useMatch({
		from: "/__private/dashboard/$workspaceId/projects/",
		shouldThrow: false,
	});
	const projectMatch = useMatch({
		from: "/__private/dashboard/$workspaceId/projects/$projectId",
		shouldThrow: false,
	});
	const membersMatch = useMatch({
		from: "/__private/dashboard/$workspaceId/settings/members",
		shouldThrow: false,
	});
	const [recentProjectIds, setRecentProjectIds] = useState<string[]>([]);

	useEffect(() => {
		if (!pathname) return;
		setRecentProjectIds(readRecentProjectIds(workspaceId));
	}, [pathname, workspaceId]);

	const recentProjects = recentProjectIds
		.map((projectId) =>
			projects.data?.find((project) => project._id === projectId),
		)
		.filter((project): project is NonNullable<typeof project> =>
			Boolean(project),
		);
	const initials = (user.name || user.email)
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<Sidebar collapsible="icon" variant="inset">
			<SidebarHeader className="gap-4 px-3 py-4">
				<div className="min-w-0 px-1 group-data-[collapsible=icon]:hidden">
					<p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/50">
						{m.dashboard_workspace()}
					</p>
					<p className="truncate text-base font-semibold">
						{workspaceName ?? "DTasks"}
					</p>
				</div>
			</SidebarHeader>
			<SidebarContent className="px-2">
				<SidebarGroup className="px-0 py-2">
					<SidebarGroupLabel className="px-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-sidebar-foreground/45">
						{m.dashboard_workspace()}
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={Boolean(overviewMatch)}
									tooltip={m.dashboard_nav_overview()}
									className={activeClass}
								>
									<Link to="/dashboard/$workspaceId" params={{ workspaceId }}>
										<LayoutDashboardIcon />
										<span>{m.dashboard_nav_overview()}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							{primaryNavigation.map((item) => (
								<SidebarMenuItem key={item.label()}>
									<SidebarMenuButton
										tooltip={item.label()}
										className="relative h-10 rounded-lg px-3 text-sidebar-foreground/70"
									>
										<item.icon />
										<span>{item.label()}</span>
										{item.badge ? (
											<span className="ml-auto font-mono text-xs">
												{item.badge}
											</span>
										) : null}
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup className="group-data-[collapsible=icon]:hidden">
					<SidebarGroupLabel>{m.dashboard_nav_projects()}</SidebarGroupLabel>
					<SidebarMenu>
						{recentProjects.map((project) => (
							<SidebarMenuItem key={project._id}>
								<SidebarMenuButton
									asChild
									isActive={projectMatch?.params.projectId === project._id}
								>
									<Link
										to="/dashboard/$workspaceId/projects/$projectId"
										params={{ workspaceId, projectId: project._id }}
									>
										<FolderKanbanIcon />
										<span>{project.name}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								isActive={Boolean(projectListMatch)}
								className="text-sidebar-foreground/70"
							>
								<Link
									to="/dashboard/$workspaceId/projects"
									params={{ workspaceId }}
								>
									<MoreHorizontalIcon />
									<span>{m.dashboard_nav_more()}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
				<SidebarGroup className="mt-auto px-0 py-2">
					<SidebarGroupLabel className="px-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-sidebar-foreground/45 group-data-[collapsible=icon]:hidden">
						{m.dashboard_nav_settings()}
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={Boolean(membersMatch)}
									tooltip={m.dashboard_nav_settings()}
									className="h-9 rounded-lg px-3 text-sidebar-foreground/60 hover:text-sidebar-accent-foreground"
								>
									<Link
										to="/dashboard/$workspaceId/settings/members"
										params={{ workspaceId }}
									>
										<Settings2Icon />
										<span>{m.dashboard_nav_settings()}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							{secondaryNavigation.map((item) => (
								<SidebarMenuItem key={item.label()}>
									<SidebarMenuButton
										tooltip={item.label()}
										className="h-9 rounded-lg px-3 text-sidebar-foreground/60 hover:text-sidebar-accent-foreground"
									>
										<item.icon />
										<span>{item.label()}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="border-t border-sidebar-border/70 p-2">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							variant="outline"
							tooltip={m.sign_out()}
							className="h-auto min-h-12 rounded-xl border-sidebar-border/70 bg-sidebar-accent/25 p-2.5 hover:border-sidebar-accent hover:bg-sidebar-accent group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:min-h-8! group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:p-1!"
							onClick={() => {
								void authClient.signOut({
									fetchOptions: { onSuccess: () => window.location.reload() },
								});
							}}
						>
							<Avatar
								size="sm"
								className="ring-2 ring-sidebar-background ring-offset-1 ring-offset-sidebar"
							>
								{user.image ? <AvatarImage src={user.image} alt="" /> : null}
								<AvatarFallback className="bg-primary/15 font-mono text-xs font-semibold text-primary">
									{initials}
								</AvatarFallback>
							</Avatar>
							<span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
								<span className="block truncate text-sm font-semibold">
									{user.name || user.email}
								</span>
								<span className="block truncate text-[0.68rem] text-sidebar-foreground/50">
									{user.email}
								</span>
							</span>
							<LogOutIcon
								className="size-4 text-sidebar-foreground/45 transition-colors group-hover/menu-item:text-destructive group-data-[collapsible=icon]:hidden"
								aria-hidden="true"
							/>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
