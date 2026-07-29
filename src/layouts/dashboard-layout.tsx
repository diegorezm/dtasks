import { Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "#/components/ui/sidebar";
import { DashboardSidebar } from "#/features/dashboard/components/dashboard-sidebar";

export function DashboardLayout({
	user,
	workspaceName,
	children,
}: {
	user: { name?: string | null; email: string; image?: string | null };
	workspaceName?: string;
	children?: ReactNode;
}) {
	return (
		<SidebarProvider>
			<DashboardSidebar user={user} workspaceName={workspaceName} />
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
