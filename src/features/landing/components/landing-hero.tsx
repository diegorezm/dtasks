import { Link } from "@tanstack/react-router";
import {
	ArrowRight,
	CircleCheck,
	Clock3,
	MoveRight,
	Sparkles,
} from "lucide-react";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { brand } from "#/core/branding/brand";

export function LandingHero() {
	return (
		<section
			id="top"
			className="page-wrap grid items-center gap-12 pb-18 pt-16 sm:pb-28 sm:pt-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16"
		>
			<div className="rise-in">
				<p className="island-kicker mb-5 flex items-center gap-2">
					<Sparkles size={15} /> Work, visible end to end
				</p>
				<h1 className="display-title max-w-2xl text-5xl leading-[0.97] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
					Every project has a next clear move.
				</h1>
				<p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
					{brand.name} gives delivery teams one live workflow, then gives
					customers a calm view of exactly what concerns them.
				</p>
				<div className="mt-8 flex flex-col gap-3 sm:flex-row">
					<Button asChild size="lg">
						<Link to="/dashboard">
							Start a workspace <ArrowRight size={18} />
						</Link>
					</Button>
					<Button asChild variant="outline" size="lg">
						<a href="#workflow">
							See work in motion <MoveRight size={18} />
						</a>
					</Button>
				</div>
				<p className="mt-5 text-sm text-muted-foreground">
					Built for teams delivering work with customers in the loop.
				</p>
			</div>

			<WorkflowPreview />
		</section>
	);
}

function WorkflowPreview() {
	return (
		<div className="relative mx-auto w-full max-w-2xl rise-in [animation-delay:130ms]">
			<div className="absolute -inset-5 -z-10 rounded-[2rem] bg-primary/10 blur-2xl" />
			<Card className="island-shell gap-0 overflow-hidden rounded-2xl p-3 sm:p-4">
				<div className="flex items-center justify-between border-b border-border px-2 pb-3 text-xs font-bold text-muted-foreground">
					<span>Northstar / Website refresh</span>
					<span className="rounded-full bg-primary/10 px-2 py-1 text-foreground">
						Live board
					</span>
				</div>
				<div className="grid gap-3 pt-3 sm:grid-cols-3">
					<BoardColumn title="Next up" count="02">
						<Task title="Confirm content map" tag="Content" />
						<Task title="Review visual direction" tag="Design" />
					</BoardColumn>
					<BoardColumn title="In progress" count="02" accent>
						<Task title="Build responsive pages" tag="Development" active />
						<Task title="Prepare handoff notes" tag="Delivery" />
					</BoardColumn>
					<BoardColumn title="Ready to share" count="01">
						<Task title="Homepage copy" tag="Approved" done />
					</BoardColumn>
				</div>
				<div className="mt-3 flex items-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-xs text-primary-foreground/70">
					<CircleCheck size={15} className="shrink-0 text-primary-foreground" />
					<span>
						Customer update ready: Homepage copy moved to{" "}
						<strong className="text-primary-foreground">Ready to share</strong>.
					</span>
				</div>
			</Card>
			<div className="absolute -bottom-5 -left-4 hidden max-w-52 rounded-xl border border-border bg-card p-3 shadow-[0_12px_28px_rgba(0,0,0,0.1)] backdrop-blur sm:block">
				<p className="text-xs font-bold text-foreground">No status-chasing</p>
				<p className="mt-1 text-xs leading-5 text-muted-foreground">
					Shared board holds current answer.
				</p>
			</div>
		</div>
	);
}

function BoardColumn({
	children,
	title,
	count,
	accent = false,
}: {
	children: React.ReactNode;
	title: string;
	count: string;
	accent?: boolean;
}) {
	return (
		<section className={accent ? "rounded-xl bg-primary/10 p-2.5" : "p-2.5"}>
			<div className="mb-2 flex items-center justify-between px-1">
				<h2 className="text-xs font-bold text-foreground">{title}</h2>
				<span className="text-xs text-muted-foreground">{count}</span>
			</div>
			<div className="space-y-2">{children}</div>
		</section>
	);
}

function Task({
	title,
	tag,
	active = false,
	done = false,
}: {
	title: string;
	tag: string;
	active?: boolean;
	done?: boolean;
}) {
	return (
		<Card className="gap-0 rounded-lg border-border bg-card p-2.5 shadow-[0_3px_8px_rgba(0,0,0,0.05)]">
			<div className="flex gap-2">
				<span
					className={
						done
							? "mt-0.5 text-foreground"
							: active
								? "mt-0.5 text-primary"
								: "mt-0.5 text-muted-foreground"
					}
				>
					{done ? (
						<CircleCheck size={14} />
					) : active ? (
						<Clock3 size={14} />
					) : (
						<span className="mt-1 block size-2 rounded-full border border-current" />
					)}
				</span>
				<p className="text-xs font-bold leading-5 text-foreground">{title}</p>
			</div>
			<span className="mt-2 inline-block rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
				{tag}
			</span>
		</Card>
	);
}
