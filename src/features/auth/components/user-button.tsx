import { Link } from "@tanstack/react-router";
import { ChevronDownIcon, LayoutDashboardIcon, LogOutIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { m } from "#/paraglide/messages";
import { authClient } from "../auth-client";

type UserButtonProps = {
	className?: string;
	fallback?: ReactNode;
};

export function UserButton({ className, fallback = null }: UserButtonProps) {
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return (
			<Button disabled size="sm" variant="ghost" className={className}>
				{m.user_loading()}
			</Button>
		);
	}

	if (!session?.user) {
		return fallback;
	}

	const userInitial = session.user.name?.charAt(0).toUpperCase() || "U";
	const userName = session.user.name || session.user.email;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant="outline"
					size="sm"
					className={className}
					aria-label={m.user_menu()}
				>
					{session.user.image ? (
						<img
							src={session.user.image}
							alt=""
							className="size-6 rounded-full object-cover"
						/>
					) : (
						<span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs">
							{userInitial}
						</span>
					)}
					<span className="max-w-32 truncate">{userName}</span>
					<ChevronDownIcon data-icon="inline-end" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-56">
				<DropdownMenuLabel>
					<span className="block truncate">{userName}</span>
					<span className="block truncate text-xs font-normal text-muted-foreground">
						{session.user.email}
					</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link to="/dashboard">
							<LayoutDashboardIcon />
							{m.user_menu_dashboard()}
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						variant="destructive"
						onSelect={() => {
							void authClient.signOut({
								fetchOptions: {
									onSuccess: () => window.location.reload(),
								},
							});
						}}
					>
						<LogOutIcon />
						{m.sign_out()}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
