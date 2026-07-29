import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { m } from "#/paraglide/messages";
import { api } from "../../../../convex/_generated/api";
export function OnboardingPage() {
	const navigate = useNavigate();
	const create = useMutation({
		mutationFn: useConvexMutation(api.workspaces.create),
	});
	const [error, setError] = useState<string>();
	async function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const name =
			new FormData(e.currentTarget).get("name")?.toString().trim() ?? "";
		if (!name || name.length > 80) return setError(m.error_generic());
		try {
			const workspaceId = await create.mutateAsync({ name });
			await navigate({
				to: "/dashboard/$workspaceId/projects",
				params: { workspaceId },
			});
		} catch {
			setError(m.error_generic());
		}
	}
	return (
		<div className="mx-auto max-w-lg pt-12">
			<Card>
				<CardHeader>
					<CardTitle>{m.workspace_onboarding_title()}</CardTitle>
					<CardDescription>
						{m.workspace_onboarding_description()}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={submit}>
						<FieldGroup>
							<Field data-invalid={Boolean(error) || undefined}>
								<FieldLabel htmlFor="workspace-name">
									{m.workspace_name()}
								</FieldLabel>
								<Input
									id="workspace-name"
									name="name"
									required
									maxLength={80}
									placeholder={m.workspace_name_placeholder()}
									disabled={create.isPending}
								/>
								{error ? <FieldError>{error}</FieldError> : null}
							</Field>
							<Button type="submit" disabled={create.isPending}>
								{create.isPending
									? m.workspace_creating()
									: m.workspace_create()}
							</Button>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
