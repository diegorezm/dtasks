import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "#/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { authClient } from "../auth-client";
import { GoogleAuthButton } from "./google-auth-button";

export function SignUpForm() {
	const navigate = useNavigate();
	const [error, setError] = useState<string>();
	const [isPending, setIsPending] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(undefined);
		setIsPending(true);

		const formData = new FormData(event.currentTarget);
		const result = await authClient.signUp.email({
			name: String(formData.get("name")),
			email: String(formData.get("email")),
			password: String(formData.get("password")),
		});

		setIsPending(false);

		if (result.error) {
			setError(
				result.error.message ??
					"Unable to create your account. Please try again.",
			);
			return;
		}

		await navigate({ to: "/" });
	}

	return (
		<form onSubmit={handleSubmit}>
			<FieldGroup>
				<GoogleAuthButton />
				<Field data-disabled={isPending || undefined}>
					<FieldLabel htmlFor="name">Name</FieldLabel>
					<Input
						id="name"
						name="name"
						autoComplete="name"
						placeholder="Your name"
						required
						disabled={isPending}
						className="h-11"
					/>
				</Field>
				<Field data-disabled={isPending || undefined}>
					<FieldLabel htmlFor="email">Work email</FieldLabel>
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
					<FieldLabel htmlFor="password">Password</FieldLabel>
					<Input
						id="password"
						name="password"
						type="password"
						autoComplete="new-password"
						minLength={8}
						required
						disabled={isPending}
						placeholder="At least 8 characters"
						className="h-11"
					/>
					<FieldDescription>Use at least 8 characters.</FieldDescription>
				</Field>
				{error ? <FieldError>{error}</FieldError> : null}
				<Button type="submit" size="lg" className="w-full" disabled={isPending}>
					{isPending ? (
						<LoaderCircle className="animate-spin" data-icon="inline-start" />
					) : null}
					{isPending ? "Creating account…" : "Create workspace"}
					{isPending ? null : <ArrowRight data-icon="inline-end" />}
				</Button>
			</FieldGroup>
		</form>
	);
}
