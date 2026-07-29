import type { ReactNode } from "react";
import { Button } from "#/components/ui/button";
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

	return (
		<Button
			type="button"
			variant="outline"
			className={className}
			onClick={() => {
				void authClient.signOut({
					fetchOptions: {
						onSuccess: () => window.location.reload(),
					},
				});
			}}
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
			<span>{m.sign_out()}</span>
		</Button>
	);
}
