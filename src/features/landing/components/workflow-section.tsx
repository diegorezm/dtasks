import { Clock3, Eye, MessageCircleMore } from "lucide-react";

const steps = [
	{
		icon: Clock3,
		title: "Capture work",
		text: "Turn requests into scoped tasks the whole team can place and prioritize.",
	},
	{
		icon: MessageCircleMore,
		title: "Keep context close",
		text: "Make progress visible where decisions happen, instead of scattered across status messages.",
	},
	{
		icon: Eye,
		title: "Share right view",
		text: "Give invited customers a clear window into their tickets and current status.",
	},
];

export function WorkflowSection() {
	return (
		<section
			id="workflow"
			className="border-y border-border bg-muted/30 py-16 sm:py-24"
		>
			<div className="page-wrap">
				<div className="max-w-2xl">
					<p className="island-kicker mb-4">One delivery rhythm</p>
					<h2 className="display-title text-4xl leading-tight tracking-[-0.04em] text-foreground sm:text-5xl">
						From incoming ask to customer-ready update.
					</h2>
				</div>
				<div className="mt-12 grid gap-7 md:grid-cols-3">
					{steps.map((step) => (
						<FlowStep key={step.title} {...step} />
					))}
				</div>
			</div>
		</section>
	);
}

function FlowStep({
	icon: Icon,
	title,
	text,
}: {
	icon: typeof Clock3;
	title: string;
	text: string;
}) {
	return (
		<article className="border-t border-primary pt-5">
			<div className="mb-5 grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
				<Icon size={20} />
			</div>
			<h3 className="text-xl font-extrabold tracking-[-0.03em] text-foreground">
				{title}
			</h3>
			<p className="mt-3 max-w-sm leading-7 text-muted-foreground">{text}</p>
		</article>
	);
}
