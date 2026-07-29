import { AuthShell } from "../components/auth-shell";
import { SignInForm } from "../components/sign-in-form";

export function SignInPage() {
	return (
		<AuthShell
			mode="sign-in"
			title="Back to the work."
			description="Sign in to see what moved, what needs you, and what comes next."
			footerPrompt="New to DTasks?"
			footerText="Create an account"
			footerTo="/sign-up"
		>
			<SignInForm />
		</AuthShell>
	);
}
