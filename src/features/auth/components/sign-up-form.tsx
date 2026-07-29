import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { type SubmitEvent, useState } from "react";
import { Button } from "#/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { getFieldErrors } from "#/core/validation/get-field-errors";
import { m } from "#/paraglide/messages";
import { signUpSchema } from "../schemas/auth-schemas";
import { GoogleAuthButton } from "./google-auth-button";
import { authClient } from "../auth-client";

const validationMessages = {
	name: m.validation_name,
	email: m.validation_email,
	password: m.validation_password,
};

type SignUpErrors = Partial<Record<keyof typeof validationMessages, string>>;

export function SignUpForm() {
	const navigate = useNavigate();
	const [error, setError] = useState<string>();
	const [fieldErrors, setFieldErrors] = useState<SignUpErrors>({});
	const [isPending, setIsPending] = useState(false);

	async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(undefined);
		setFieldErrors({});

		const formData = new FormData(event.currentTarget);
		const parsed = signUpSchema.safeParse({
			name: formData.get("name"),
			email: formData.get("email"),
			password: formData.get("password"),
		});

		if (!parsed.success) {
			setFieldErrors(getFieldErrors(parsed.error, validationMessages));
			return;
		}

		setIsPending(true);
		const result = await authClient.signUp.email(parsed.data);

		setIsPending(false);

		if (result.error) {
			setError(result.error.message ?? m.signup_error());
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
					data-invalid={Boolean(fieldErrors.name) || undefined}
				>
					<FieldLabel htmlFor="name">{m.field_name()}</FieldLabel>
					<Input
						id="name"
						name="name"
						autoComplete="name"
						placeholder={m.placeholder_name()}
						required
						disabled={isPending}
						aria-invalid={Boolean(fieldErrors.name)}
						className="h-11"
					/>
					{fieldErrors.name ? (
						<FieldError>{fieldErrors.name}</FieldError>
					) : null}
				</Field>
				<Field
					data-disabled={isPending || undefined}
					data-invalid={Boolean(fieldErrors.email) || undefined}
				>
					<FieldLabel htmlFor="email">{m.field_work_email()}</FieldLabel>
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
						autoComplete="new-password"
						minLength={8}
						required
						disabled={isPending}
						aria-invalid={Boolean(fieldErrors.password)}
						placeholder={m.placeholder_password_min()}
						className="h-11"
					/>
					{fieldErrors.password ? (
						<FieldError>{fieldErrors.password}</FieldError>
					) : (
						<FieldDescription>{m.password_hint()}</FieldDescription>
					)}
				</Field>
				{error ? <FieldError>{error}</FieldError> : null}
				<Button type="submit" size="lg" className="w-full" disabled={isPending}>
					{isPending ? (
						<LoaderCircle className="animate-spin" data-icon="inline-start" />
					) : null}
					{isPending ? m.signup_pending() : m.signup_submit()}
					{isPending ? null : <ArrowRight data-icon="inline-end" />}
				</Button>
			</FieldGroup>
		</form>
	);
}
