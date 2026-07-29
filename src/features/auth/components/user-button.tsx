import { Button } from "#/components/ui/button";
import { authClient } from "../auth-client";

export function UserButton() {
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return (
			<Button disabled size="sm" variant="ghost">
				Loading user…
			</Button>
		);
	}

	if (!session?.user) {
		return null;
	}

	const userInitial = session.user.name?.charAt(0).toUpperCase() || "U";

	return (
		<Button
			type="button"
			variant="outline"
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
			<span>Sign out</span>
		</Button>
	);
}
