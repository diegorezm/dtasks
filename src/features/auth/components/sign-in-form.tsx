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
import { getFieldErrors } from "#/core/validation/get-field-errors";
import { m } from "#/paraglide/messages";
import { authClient } from "../auth-client";
import { signInSchema } from "../schemas/auth-schemas";
import { GoogleAuthButton } from "./google-auth-button";

const validationMessages = {
	email: m.validation_email,
	password: m.validation_password,
};

type SignInErrors = Partial<Record<keyof typeof validationMessages, string>>;

export function SignInForm() {
	const navigate = useNavigate();
	const [error, setError] = useState<string>();
	const [fieldErrors, setFieldErrors] = useState<SignInErrors>({});
	const [isPending, setIsPending] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(undefined);
		setFieldErrors({});

		const formData = new FormData(event.currentTarget);
		const parsed = signInSchema.safeParse({
			email: formData.get("email"),
			password: formData.get("password"),
		});

		if (!parsed.success) {
			setFieldErrors(getFieldErrors(parsed.error, validationMessages));
			return;
		}

		setIsPending(true);
		const result = await authClient.signIn.email(parsed.data);

		setIsPending(false);

		if (result.error) {
			setError(result.error.message ?? m.signin_error());
			return;
		}

		await navigate({ to: "/" });
	}

	return (
		<form onSubmit={handleSubmit} noValidate>
			<FieldGroup>
				<GoogleAuthButton />
				<Field
					data-disabled={isPending || undefined}
					data-invalid={Boolean(fieldErrors.email) || undefined}
				>
					<FieldLabel htmlFor="email">{m.field_email()}</FieldLabel>
					<Input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						placeholder="name@company.com"
						required
						disabled={isPending}
						aria-invalid={Boolean(fieldErrors.email)}
						className="h-11"
					/>
					{fieldErrors.email ? (
						<FieldError>{fieldErrors.email}</FieldError>
					) : null}
				</Field>
				<Field
					data-disabled={isPending || undefined}
					data-invalid={Boolean(fieldErrors.password) || undefined}
				>
					<FieldLabel htmlFor="password">{m.field_password()}</FieldLabel>
					<Input
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						required
						disabled={isPending}
						aria-invalid={Boolean(fieldErrors.password)}
						placeholder={m.placeholder_password()}
						className="h-11"
					/>
					{fieldErrors.password ? (
						<FieldError>{fieldErrors.password}</FieldError>
					) : null}
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
