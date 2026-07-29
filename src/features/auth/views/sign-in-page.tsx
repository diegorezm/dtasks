import { m } from "#/paraglide/messages";
import { AuthShell } from "../components/auth-shell";
import { SignInForm } from "../components/sign-in-form";

export function SignInPage() {
	return (
		<AuthShell
			mode="sign-in"
			title={m.signin_title()}
			description={m.signin_description()}
			footerPrompt={m.signin_footer_prompt()}
			footerText={m.signin_footer_link()}
			footerTo="/sign-up"
		>
			<SignInForm />
		</AuthShell>
	);
}
