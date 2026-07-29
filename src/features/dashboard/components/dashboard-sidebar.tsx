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

export function DashboardSidebar({ user }: DashboardSidebarProps) {
	const initials = (user.name || user.email)
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<Sidebar collapsible="icon" variant="inset">
			<SidebarHeader className="px-3 py-4">
				<BrandLogo className="group-data-[collapsible=icon]:[&>span:last-child]:hidden" />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>{m.dashboard_workspace()}</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{primaryNavigation.map((item) => (
								<SidebarMenuItem key={item.label()}>
									<SidebarMenuButton
										isActive={item.active}
										tooltip={item.label()}
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
				<SidebarGroup className="mt-auto">
					<SidebarGroupContent>
						<SidebarMenu>
							{secondaryNavigation.map((item) => (
								<SidebarMenuItem key={item.label()}>
									<SidebarMenuButton tooltip={item.label()}>
										<item.icon />
										<span>{item.label()}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="border-t border-sidebar-border p-3">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							tooltip={m.sign_out()}
							onClick={() => {
								void authClient.signOut({
									fetchOptions: { onSuccess: () => window.location.reload() },
								});
							}}
						>
							<Avatar size="sm">
								{user.image ? <AvatarImage src={user.image} alt="" /> : null}
								<AvatarFallback>{initials}</AvatarFallback>
							</Avatar>
							<span className="min-w-0 flex-1">
								<span className="block truncate font-medium">
									{user.name || user.email}
								</span>
								<span className="block truncate text-xs text-muted-foreground">
									{user.email}
								</span>
							</span>
							<LogOutIcon />
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
