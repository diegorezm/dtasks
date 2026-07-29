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
import { BrandLogo } from "#/core/branding/brand-logo";
import { authClient } from "#/features/auth/auth-client";
import { m } from "#/paraglide/messages";

type DashboardSidebarProps = {
	user: {
		name?: string | null;
		email: string;
		image?: string | null;
	};
	workspaceName?: string;
};

const primaryNavigation = [
	{ label: m.dashboard_nav_overview, icon: LayoutDashboardIcon, active: true },
	{ label: m.dashboard_nav_projects, icon: FolderKanbanIcon },
	{ label: m.dashboard_nav_inbox, icon: MessageSquareTextIcon, badge: "4" },
	{ label: m.dashboard_nav_customers, icon: UsersIcon },
	{ label: m.dashboard_nav_reports, icon: ChartNoAxesColumnIncreasingIcon },
];

const secondaryNavigation = [
	{ label: m.dashboard_nav_notifications, icon: BellIcon },
	{ label: m.dashboard_nav_settings, icon: Settings2Icon },
	{ label: m.dashboard_nav_help, icon: CircleHelpIcon },
];

export function DashboardSidebar({
	user,
	workspaceName,
}: DashboardSidebarProps) {
	const initials = (user.name || user.email)
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<Sidebar collapsible="icon" variant="inset">
			<SidebarHeader className="gap-4 px-3 py-4">
				<BrandLogo className="px-1 group-data-[collapsible=icon]:[&>span:last-child]:hidden" />
				<div className="group-data-[collapsible=icon]:hidden">
					<div className="flex items-center gap-3 rounded-xl border border-sidebar-border/70 bg-sidebar-accent/35 p-3 shadow-sm">
						<div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary text-primary-foreground shadow-sm">
							<div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_42%,currentColor_43%,currentColor_48%,transparent_49%,transparent_68%,currentColor_69%,currentColor_74%,transparent_75%)] opacity-20" />
							<FolderKanbanIcon
								className="relative size-4"
								aria-hidden="true"
							/>
						</div>
						<div className="min-w-0">
							<p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/50">
								{m.dashboard_workspace()}
							</p>
							<p className="truncate text-sm font-semibold">
								{workspaceName ?? "DTasks"}
							</p>
						</div>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent className="px-2">
				<SidebarGroup className="px-0 py-2">
					<SidebarGroupLabel className="px-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-sidebar-foreground/45">
						{m.dashboard_workspace()}
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{primaryNavigation.map((item) => (
								<SidebarMenuItem key={item.label()}>
									<SidebarMenuButton
										isActive={item.active}
										tooltip={item.label()}
										className="relative h-10 rounded-lg px-3 text-sidebar-foreground/70 data-[active=true]:font-semibold data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm data-[active=true]:before:absolute data-[active=true]:before:inset-y-2 data-[active=true]:before:left-0 data-[active=true]:before:w-0.5 data-[active=true]:before:rounded-full data-[active=true]:before:bg-primary"
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
