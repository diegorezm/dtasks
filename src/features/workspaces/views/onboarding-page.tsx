import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Circle, LoaderCircle } from "lucide-react";
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
		setError(undefined);
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
		<div className="flex min-h-[calc(100vh-9rem)] items-center justify-center py-8 sm:py-12">
			<Card className="w-full max-w-4xl overflow-hidden rounded-2xl border-border/70 bg-card py-0 shadow-[0_20px_60px_-30px_color-mix(in_oklab,var(--foreground)_35%,transparent)] lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-0">
				<div className="relative min-h-[22rem] overflow-hidden bg-foreground p-7 text-background sm:p-10 lg:min-h-full">
					<div className="absolute -top-20 -right-16 size-56 rounded-full bg-primary/30 blur-3xl" />
					<div className="absolute -bottom-20 -left-16 size-48 rounded-full bg-secondary/20 blur-3xl" />
					<div className="relative flex h-full flex-col justify-between gap-12">
						<div className="flex items-center gap-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-background/60">
							<Circle
								className="size-2 fill-primary text-primary"
								aria-hidden="true"
							/>
							<span aria-hidden="true">DTasks</span>
						</div>
						<div className="relative mx-auto w-full max-w-xs lg:mx-0">
							<div className="absolute -top-5 -left-3 h-32 w-24 -rotate-6 rounded-lg border border-background/15 bg-background/5" />
							<div className="absolute -right-3 -bottom-5 h-32 w-24 rotate-6 rounded-lg border border-background/15 bg-background/5" />
							<div className="relative rounded-xl border border-background/15 bg-background/10 p-3 shadow-2xl backdrop-blur-sm">
								<div className="mb-5 flex items-center justify-between border-b border-background/10 pb-3">
									<div className="flex gap-1.5">
										<span className="size-1.5 rounded-full bg-background/30" />
										<span className="size-1.5 rounded-full bg-background/30" />
										<span className="size-1.5 rounded-full bg-primary" />
									</div>
									<div className="h-1.5 w-12 rounded-full bg-background/20" />
								</div>
								<div className="grid grid-cols-3 gap-2">
									{["w-9/12", "w-7/12", "w-10/12"].map((width, index) => (
										<div key={width} className="space-y-2">
											<div className="h-1.5 w-6 rounded-full bg-background/30" />
											<div className="space-y-1.5 rounded-md bg-background/10 p-1.5">
												<div
													className={`h-1.5 ${width} rounded-full bg-background/45`}
												/>
												<div className="h-1.5 w-5/12 rounded-full bg-background/20" />
												{index === 1 ? (
													<Check
														className="mt-2 size-3 text-primary"
														aria-hidden="true"
													/>
												) : null}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
						<p className="max-w-xs font-serif text-2xl leading-tight text-background/85">
							{m.workspace_onboarding_description()}
						</p>
					</div>
				</div>
				<div className="p-7 sm:p-10 lg:p-14">
					<CardHeader className="gap-4 p-0">
						<p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary">
							<span aria-hidden="true">01 / </span>
							{m.workspace_name()}
						</p>
						<CardTitle className="display-title max-w-md text-4xl leading-[0.98] tracking-[-0.04em] sm:text-5xl">
							{m.workspace_onboarding_title()}
						</CardTitle>
						<CardDescription className="max-w-md text-base leading-7">
							{m.workspace_onboarding_description()}
						</CardDescription>
					</CardHeader>
					<CardContent className="mt-10 p-0">
						<form onSubmit={submit}>
							<FieldGroup className="gap-6">
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
										className="h-12 rounded-lg bg-background px-4 text-base shadow-none"
									/>
									{error ? <FieldError>{error}</FieldError> : null}
								</Field>
								<Button
									type="submit"
									disabled={create.isPending}
									className="h-12 w-full justify-between rounded-lg px-4 sm:w-auto sm:min-w-44"
								>
									{create.isPending ? (
										<>
											<LoaderCircle
												className="animate-spin"
												aria-hidden="true"
											/>
											{m.workspace_creating()}
										</>
									) : (
										<>
											{m.workspace_create()}
											<ArrowRight aria-hidden="true" />
										</>
									)}
								</Button>
							</FieldGroup>
						</form>
					</CardContent>
				</div>
			</Card>
		</div>
	);
}
