import { AuthShell } from "../components/auth-shell";
import { SignUpForm } from "../components/sign-up-form";

export function SignUpPage() {
	return (
		<AuthShell
			mode="sign-up"
			title="Make work clearer."
			description="Create your workspace, invite your team, and keep every project moving in one shared view."
			footerPrompt="Already have an account?"
			footerText="Sign in"
			footerTo="/sign-in"
		>
			<SignUpForm />
		</AuthShell>
	);
}
