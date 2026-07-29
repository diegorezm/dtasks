import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowRight,
	Check,
	CircleCheck,
	Clock3,
	Eye,
	Menu,
	MessageCircleMore,
	MoveRight,
	Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<main className="pb-12 sm:pb-20">
			<header className="page-wrap pt-5 sm:pt-7">
				<nav
					className="island-shell flex items-center justify-between rounded-2xl px-4 py-3 sm:px-5"
					aria-label="Main navigation"
				>
					<a
						className="flex items-center gap-2.5 no-underline"
						href="#top"
						aria-label="DTasks home"
					>
						<span className="grid size-8 place-items-center rounded-lg bg-[var(--sea-ink)] text-sm font-extrabold text-white">
							D
						</span>
						<span className="font-extrabold tracking-[-0.04em] text-[var(--sea-ink)]">
							DTasks
						</span>
					</a>
					<div className="hidden items-center gap-7 text-sm font-semibold sm:flex">
						<a className="nav-link" href="#workflow">
							Workflow
						</a>
						<a className="nav-link" href="#visibility">
							Visibility
						</a>
						<a className="nav-link" href="#start">
							Get started
						</a>
					</div>
					<a
						className="hidden rounded-lg bg-[var(--sea-ink)] px-4 py-2 text-sm font-bold text-white no-underline hover:bg-[var(--palm)] sm:block"
						href="#start"
					>
						Start a workspace
					</a>
					<a
						className="grid size-9 place-items-center rounded-lg text-[var(--sea-ink)] sm:hidden"
						href="#start"
						aria-label="Get started"
					>
						<Menu size={20} />
					</a>
				</nav>
			</header>

			<section
				id="top"
				className="page-wrap grid items-center gap-12 pb-18 pt-16 sm:pb-28 sm:pt-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16"
			>
				<div className="rise-in">
					<p className="island-kicker mb-5 flex items-center gap-2">
						<Sparkles size={15} /> Work, visible end to end
					</p>
					<h1 className="display-title max-w-2xl text-5xl leading-[0.97] tracking-[-0.055em] text-[var(--sea-ink)] sm:text-6xl lg:text-7xl">
						Every project has a next clear move.
					</h1>
					<p className="mt-6 max-w-xl text-lg leading-8 text-[var(--sea-ink-soft)]">
						DTasks gives delivery teams one live workflow, then gives customers
						a calm view of exactly what concerns them.
					</p>
					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<a
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--sea-ink)] px-5 py-3.5 font-bold text-white no-underline shadow-[0_12px_25px_rgba(23,58,64,0.2)] hover:-translate-y-0.5 hover:bg-[var(--palm)]"
							href="#start"
						>
							Start a workspace <ArrowRight size={18} />
						</a>
						<a
							className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-white/55 px-5 py-3.5 font-bold text-[var(--sea-ink)] no-underline hover:-translate-y-0.5 hover:bg-white/85"
							href="#workflow"
						>
							See work in motion <MoveRight size={18} />
						</a>
					</div>
					<p className="mt-5 text-sm text-[var(--sea-ink-soft)]">
						Built for teams delivering work with customers in loop.
					</p>
				</div>

				<div className="relative mx-auto w-full max-w-2xl rise-in [animation-delay:130ms]">
					<div className="absolute -inset-5 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_62%_35%,rgba(79,184,178,0.33),transparent_56%)] blur-2xl" />
					<div className="island-shell overflow-hidden rounded-2xl p-3 sm:p-4">
						<div className="flex items-center justify-between border-b border-[var(--line)] px-2 pb-3 text-xs font-bold text-[var(--sea-ink-soft)]">
							<span>Northstar / Website refresh</span>
							<span className="rounded-full bg-[rgba(79,184,178,0.18)] px-2 py-1 text-[var(--palm)]">
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
						<div className="mt-3 flex items-center gap-2 rounded-xl bg-[var(--sea-ink)] px-3 py-2.5 text-xs text-[#d7ece8]">
							<CircleCheck size={15} className="shrink-0 text-[#7ed3bf]" />
							<span>
								Customer update ready: Homepage copy moved to{" "}
								<strong className="text-white">Ready to share</strong>.
							</span>
						</div>
					</div>
					<div className="absolute -bottom-5 -left-4 hidden max-w-52 rounded-xl border border-[var(--chip-line)] bg-[var(--chip-bg)] p-3 shadow-[0_12px_28px_rgba(23,58,64,0.14)] backdrop-blur sm:block">
						<p className="text-xs font-bold text-[var(--sea-ink)]">
							No status-chasing
						</p>
						<p className="mt-1 text-xs leading-5 text-[var(--sea-ink-soft)]">
							Shared board holds current answer.
						</p>
					</div>
				</div>
			</section>

			<section
				id="workflow"
				className="border-y border-[var(--line)] bg-white/35 py-16 sm:py-24"
			>
				<div className="page-wrap">
					<div className="max-w-2xl">
						<p className="island-kicker mb-4">One delivery rhythm</p>
						<h2 className="display-title text-4xl leading-tight tracking-[-0.045em] text-[var(--sea-ink)] sm:text-5xl">
							From incoming ask to customer-ready update.
						</h2>
					</div>
					<div className="mt-12 grid gap-7 md:grid-cols-3">
						<FlowStep
							icon={<Clock3 size={20} />}
							title="Capture work"
							text="Turn requests into scoped tasks the whole team can place and prioritize."
						/>
						<FlowStep
							icon={<MessageCircleMore size={20} />}
							title="Keep context close"
							text="Make progress visible where decisions happen, instead of scattered across status messages."
						/>
						<FlowStep
							icon={<Eye size={20} />}
							title="Share right view"
							text="Give invited customers a clear window into their tickets and current status."
						/>
					</div>
				</div>
			</section>

			<section
				id="visibility"
				className="page-wrap grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]"
			>
				<div className="island-shell rounded-2xl p-5 sm:p-7">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-bold text-[var(--sea-ink)]">
								Customer view
							</p>
							<p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
								Northstar / Website refresh
							</p>
						</div>
						<span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-1 text-xs font-bold text-[var(--palm)]">
							Client access
						</span>
					</div>
					<div className="mt-7 space-y-3">
						<CustomerItem title="Homepage copy" status="Ready for review" />
						<CustomerItem
							title="Review visual direction"
							status="In progress"
						/>
						<CustomerItem title="Confirm content map" status="Next up" />
					</div>
					<p className="mt-6 border-t border-[var(--line)] pt-4 text-xs leading-5 text-[var(--sea-ink-soft)]">
						Shared project detail. Customer sees only work connected to this
						project.
					</p>
				</div>
				<div>
					<p className="island-kicker mb-4">Visibility without noise</p>
					<h2 className="display-title text-4xl leading-tight tracking-[-0.045em] text-[var(--sea-ink)] sm:text-5xl">
						Customers stay informed. Teams stay focused.
					</h2>
					<p className="mt-5 max-w-xl text-lg leading-8 text-[var(--sea-ink-soft)]">
						Keep internal planning private while customer-facing work stays
						current and easy to follow.
					</p>
					<a
						className="mt-7 inline-flex items-center gap-2 font-bold text-[var(--lagoon-deep)] no-underline hover:text-[var(--palm)]"
						href="#start"
					>
						Set up shared project visibility <ArrowRight size={18} />
					</a>
				</div>
			</section>

			<section id="start" className="page-wrap">
				<div className="overflow-hidden rounded-3xl bg-[var(--sea-ink)] px-6 py-12 text-center shadow-[0_24px_50px_rgba(23,58,64,0.2)] sm:px-12 sm:py-16">
					<p className="island-kicker text-[#8de5db]">
						Ready when work starts moving
					</p>
					<h2 className="display-title mx-auto mt-4 max-w-2xl text-4xl leading-tight tracking-[-0.045em] text-white sm:text-5xl">
						Put project clarity in one place.
					</h2>
					<p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#afcdc8]">
						Create workspace for team, projects, and customer visibility.
					</p>
					<a
						className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--lagoon)] px-5 py-3.5 font-bold text-[var(--sea-ink)] no-underline hover:-translate-y-0.5 hover:bg-[#8de5db]"
						href="mailto:hello@dtasks.example"
					>
						Talk about DTasks <ArrowRight size={18} />
					</a>
				</div>
			</section>

			<footer className="page-wrap mt-12 flex flex-col gap-3 border-t border-[var(--line)] pt-6 text-sm text-[var(--sea-ink-soft)] sm:flex-row sm:items-center sm:justify-between">
				<span>© 2026 DTasks</span>
				<span>Project work, clearly shared.</span>
			</footer>
		</main>
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
		<section
			className={
				accent ? "rounded-xl bg-[rgba(79,184,178,0.1)] p-2.5" : "p-2.5"
			}
		>
			<div className="mb-2 flex items-center justify-between px-1">
				<h2 className="text-xs font-bold text-[var(--sea-ink)]">{title}</h2>
				<span className="text-xs text-[var(--sea-ink-soft)]">{count}</span>
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
		<article className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] p-2.5 shadow-[0_3px_8px_rgba(23,58,64,0.05)]">
			<div className="flex gap-2">
				<span
					className={
						done
							? "mt-0.5 text-[var(--palm)]"
							: active
								? "mt-0.5 text-[var(--lagoon-deep)]"
								: "mt-0.5 text-[var(--sea-ink-soft)]"
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
				<p className="text-xs font-bold leading-5 text-[var(--sea-ink)]">
					{title}
				</p>
			</div>
			<span className="mt-2 inline-block rounded-md bg-[var(--sand)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--sea-ink-soft)]">
				{tag}
			</span>
		</article>
	);
}

function FlowStep({
	icon,
	title,
	text,
}: {
	icon: React.ReactNode;
	title: string;
	text: string;
}) {
	return (
		<article className="border-t border-[var(--lagoon)] pt-5">
			<div className="mb-5 grid size-10 place-items-center rounded-xl bg-[rgba(79,184,178,0.16)] text-[var(--lagoon-deep)]">
				{icon}
			</div>
			<h3 className="text-xl font-extrabold tracking-[-0.03em] text-[var(--sea-ink)]">
				{title}
			</h3>
			<p className="mt-3 max-w-sm leading-7 text-[var(--sea-ink-soft)]">
				{text}
			</p>
		</article>
	);
}

function CustomerItem({ title, status }: { title: string; status: string }) {
	const complete = status === "Ready for review";
	return (
		<div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-white/65 p-3">
			<span
				className={
					complete ? "text-[var(--palm)]" : "text-[var(--lagoon-deep)]"
				}
			>
				{complete ? (
					<Check size={18} />
				) : (
					<span className="block size-3 rounded-full border-2 border-current" />
				)}
			</span>
			<span className="min-w-0 flex-1 text-sm font-bold text-[var(--sea-ink)]">
				{title}
			</span>
			<span className="text-xs font-semibold text-[var(--sea-ink-soft)]">
				{status}
			</span>
		</div>
	);
}
