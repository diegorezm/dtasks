import { Link } from "@tanstack/react-router";
import { Check, Circle, Clock3, UsersRound } from "lucide-react";
import type { ReactNode } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { BrandLogo } from "#/core/branding/brand-logo";
import { m } from "#/paraglide/messages";

interface AuthShellProps {
	children: ReactNode;
	description: string;
	footerPrompt: string;
	footerText: string;
	footerTo: "/sign-in" | "/sign-up";
	mode: "sign-in" | "sign-up";
	title: string;
}

const projectCopy = {
	"sign-in": {
		eyebrow: () => m.project_signin_eyebrow(),
		heading: () => m.project_signin_heading(),
		body: () => m.project_signin_body(),
		status: () => m.project_signin_status(),
	},
	"sign-up": {
		eyebrow: () => m.project_signup_eyebrow(),
		heading: () => m.project_signup_heading(),
		body: () => m.project_signup_body(),
		status: () => m.project_signup_status(),
	},
} as const;

function ProjectBrief({ mode }: Pick<AuthShellProps, "mode">) {
	const copy = projectCopy[mode];

	return (
		<section className="relative hidden min-h-screen overflow-hidden bg-secondary lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14">
			<div
				className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full border-72 border-background/40"
				aria-hidden="true"
			/>
			<Link
				to="/"
				aria-label="DTasks home"
				className="relative w-fit rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
			>
				<BrandLogo />
			</Link>

			<div className="relative mx-auto flex w-full max-w-xl flex-col gap-9 py-12">
				<div className="flex max-w-lg flex-col gap-4">
					<p className="island-kicker">{copy.eyebrow()}</p>
					<h1 className="display-title text-5xl leading-[0.98] tracking-[-0.045em] text-foreground xl:text-6xl">
						{copy.heading()}
					</h1>
					<p className="max-w-md text-base leading-7 text-muted-foreground">
						{copy.body()}
					</p>
				</div>

				<div className="relative mx-3">
					<div
						className="absolute inset-0 translate-x-4 translate-y-4 rotate-2 rounded-2xl border bg-background/60"
						aria-hidden="true"
					/>
					<div className="relative -rotate-1 rounded-2xl border bg-card p-6 shadow-xl transition-transform duration-500 hover:rotate-0">
						<div className="flex items-start justify-between gap-6 border-b pb-5">
							<div className="flex flex-col gap-2">
								<p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
									{m.project_label()}
								</p>
								<h2 className="text-xl font-semibold tracking-tight">
									{m.project_title()}
								</h2>
							</div>
							<ul className="flex -space-x-2" aria-label={m.project_members()}>
								{["AM", "DK", "JL"].map((initials) => (
									<li
										key={initials}
										className="grid size-9 place-items-center rounded-full border-2 border-card bg-accent text-[0.65rem] font-bold"
									>
										{initials}
									</li>
								))}
							</ul>
						</div>

						<div className="flex flex-col gap-1 py-4">
							<div className="flex items-center gap-3 rounded-lg px-2 py-3">
								<span className="grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
									<Check className="size-3.5" aria-hidden="true" />
								</span>
								<span className="flex-1 text-sm font-medium line-through opacity-60">
									{m.task_approve()}
								</span>
								<span className="font-mono text-xs text-muted-foreground">
									{m.task_done()}
								</span>
							</div>
							<div className="flex items-center gap-3 rounded-lg bg-accent px-2 py-3">
								<Circle className="size-6 text-primary" aria-hidden="true" />
								<span className="flex-1 text-sm font-semibold">
									{m.task_share()}
								</span>
								<span className="rounded-md bg-background px-2 py-1 font-mono text-[0.65rem] font-bold">
									{m.task_today()}
								</span>
							</div>
							<div className="flex items-center gap-3 rounded-lg px-2 py-3">
								<Clock3
									className="size-6 text-muted-foreground"
									aria-hidden="true"
								/>
								<span className="flex-1 text-sm font-medium">
									{m.task_collect()}
								</span>
								<span className="font-mono text-xs text-muted-foreground">
									{m.task_friday()}
								</span>
							</div>
						</div>

						<div className="flex items-center justify-between border-t pt-5 text-sm">
							<span className="flex items-center gap-2 text-muted-foreground">
								<UsersRound className="size-4" aria-hidden="true" />
								{m.team_customer()}
							</span>
							<span className="font-semibold">{copy.status()}</span>
						</div>
					</div>
				</div>
			</div>

			<p className="relative font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
				{m.shared_project_clarity()}
			</p>
		</section>
	);
}

export function AuthShell({
	children,
	description,
	footerPrompt,
	footerText,
	footerTo,
	mode,
	title,
}: AuthShellProps) {
	return (
		<main className="grid min-h-screen lg:grid-cols-[minmax(0,1.08fr)_minmax(28rem,0.92fr)]">
			<ProjectBrief mode={mode} />
			<section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
				<Link
					to="/"
					aria-label="DTasks home"
					className="absolute left-5 top-6 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 lg:hidden"
				>
					<BrandLogo />
				</Link>
				<Card className="w-full max-w-md border-0 bg-transparent shadow-none">
					<CardHeader className="gap-3 px-0">
						<p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary">
							{mode === "sign-in" ? m.signin_eyebrow() : m.signup_eyebrow()}
						</p>
						<CardTitle className="display-title text-4xl leading-none tracking-[-0.04em]">
							{title}
						</CardTitle>
						<CardDescription className="max-w-sm text-base leading-6">
							{description}
						</CardDescription>
					</CardHeader>
					<CardContent className="px-0">{children}</CardContent>
					<CardFooter className="gap-1 px-0 text-sm text-muted-foreground">
						<span>{footerPrompt}</span>
						<Link
							to={footerTo}
							className="rounded-sm font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							{footerText}
						</Link>
					</CardFooter>
				</Card>
			</section>
		</main>
	);
}
