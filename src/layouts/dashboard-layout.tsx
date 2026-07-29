import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { FolderKanbanIcon, LogOutIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "#/components/ui/sidebar";
import { BrandLogo } from "#/core/branding/brand-logo";
import { authClient } from "#/features/auth/auth-client";
import { m } from "#/paraglide/messages";

export function DashboardLayout({
	user,
	workspaceName,
	children,
}: {
	user: { name?: string | null; email: string };
	workspaceName?: string;
	children?: ReactNode;
}) {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	return (
		<SidebarProvider>
			<Sidebar collapsible="icon" variant="inset">
				<div className="px-3 py-4">
					<BrandLogo />
				</div>
				<SidebarContent>
					<SidebarGroup>
						<p className="px-2 pb-2 text-xs text-muted-foreground">
							{workspaceName ?? m.dashboard_workspace()}
						</p>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={pathname.includes("/projects")}
								>
									<Link
										to="/dashboard/$workspaceId/projects"
										params={{ workspaceId: pathname.split("/")[2] ?? "" }}
									>
										<FolderKanbanIcon />
										<span>{m.projects()}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								onClick={() =>
									void authClient.signOut({
										fetchOptions: {
											onSuccess: () => window.location.assign("/"),
										},
									})
								}
							>
								<Avatar size="sm">
									<AvatarFallback>
										{(user.name || user.email).slice(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<span className="truncate">{user.name || user.email}</span>
								<LogOutIcon />
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>
			<SidebarInset>
				<header className="flex h-16 items-center border-b px-4">
					<SidebarTrigger />
				</header>
				<main className="mx-auto w-full max-w-[1500px] p-4 md:p-7">
					{children ?? <Outlet />}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
