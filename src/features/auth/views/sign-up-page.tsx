import { m } from "#/paraglide/messages";
import { AuthShell } from "../components/auth-shell";
import { SignUpForm } from "../components/sign-up-form";

export function SignUpPage() {
	return (
		<AuthShell
			mode="sign-up"
			title={m.signup_title()}
			description={m.signup_description()}
			footerPrompt={m.signup_footer_prompt()}
			footerText={m.signup_footer_link()}
			footerTo="/sign-in"
		>
			<SignUpForm />
		</AuthShell>
	);
}
