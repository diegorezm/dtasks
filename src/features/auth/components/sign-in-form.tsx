import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "#/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { m } from "#/paraglide/messages";
import { authClient } from "../auth-client";
import { GoogleAuthButton } from "./google-auth-button";

export function SignInForm() {
	const navigate = useNavigate();
	const [error, setError] = useState<string>();
	const [isPending, setIsPending] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(undefined);
		setIsPending(true);

		const formData = new FormData(event.currentTarget);
		const result = await authClient.signIn.email({
			email: String(formData.get("email")),
			password: String(formData.get("password")),
		});

		setIsPending(false);

		if (result.error) {
			result.error.message ?? m.signin_error();
			return;
		}

		await navigate({ to: "/" });
	}

	return (
		<form onSubmit={handleSubmit}>
			<FieldGroup>
				<GoogleAuthButton />
				<Field data-disabled={isPending || undefined}>
					<FieldLabel htmlFor="email">{m.field_email()}</FieldLabel>
					<Input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						placeholder="name@company.com"
						required
						disabled={isPending}
						className="h-11"
					/>
				</Field>
				<Field data-disabled={isPending || undefined}>
					<FieldLabel htmlFor="password">{m.field_password()}</FieldLabel>
					<Input
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						required
						disabled={isPending}
						placeholder={m.placeholder_password()}
						className="h-11"
					/>
				</Field>
				{error ? <FieldError>{error}</FieldError> : null}
				<Button type="submit" size="lg" className="w-full" disabled={isPending}>
					{isPending ? (
						<LoaderCircle className="animate-spin" data-icon="inline-start" />
					) : null}
					{isPending ? m.signin_pending() : m.signin_submit()}
					{isPending ? null : <ArrowRight data-icon="inline-end" />}
				</Button>
			</FieldGroup>
		</form>
	);
}
