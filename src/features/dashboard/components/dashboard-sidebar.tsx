import { Link, useMatch, useRouterState } from "@tanstack/react-router";
import {
	BellIcon,
	ChartNoAxesColumnIncreasingIcon,
	CircleHelpIcon,
	FolderKanbanIcon,
	LayoutDashboardIcon,
	LogOutIcon,
	MessageSquareTextIcon,
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
import { authClient } from "#/features/auth/auth-client";
import { m } from "#/paraglide/messages";

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
	{ label: m.dashboard_nav_settings, icon: Settings2Icon },
	{ label: m.dashboard_nav_help, icon: CircleHelpIcon },
];

function latestProjectKey(workspaceId: string) {
	return `dtasks:latest-project:${workspaceId}`;
}

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
	const [latestProjectId, setLatestProjectId] = useState<string>();

	useEffect(() => {
		if (!pathname) return;
		setLatestProjectId(
			localStorage.getItem(latestProjectKey(workspaceId)) ?? undefined,
		);
	}, [pathname, workspaceId]);

	const projectTarget = projectMatch?.params.projectId ?? latestProjectId;
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
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={Boolean(projectListMatch || projectMatch)}
									tooltip={m.dashboard_nav_projects()}
									className={activeClass}
								>
									<Link
										to={
											projectTarget
												? "/dashboard/$workspaceId/projects/$projectId"
												: "/dashboard/$workspaceId/projects"
										}
										params={
											projectTarget
												? { workspaceId, projectId: projectTarget }
												: { workspaceId }
										}
									>
										<FolderKanbanIcon />
										<span>{m.dashboard_nav_projects()}</span>
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
				<SidebarGroup className="mt-auto px-0 py-2">
					<SidebarGroupLabel className="px-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-sidebar-foreground/45 group-data-[collapsible=icon]:hidden">
						{m.dashboard_nav_settings()}
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
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
