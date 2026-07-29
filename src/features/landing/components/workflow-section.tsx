import { Clock3, Eye, MessageCircleMore } from "lucide-react";
import { m } from "#/paraglide/messages";

const steps = [
	{
		icon: Clock3,
		title: () => m.workflow_capture_title(),
		text: () => m.workflow_capture_text(),
	},
	{
		icon: MessageCircleMore,
		title: () => m.workflow_context_title(),
		text: () => m.workflow_context_text(),
	},
	{
		icon: Eye,
		title: () => m.workflow_share_title(),
		text: () => m.workflow_share_text(),
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
					<p className="island-kicker mb-4">{m.workflow_kicker()}</p>
					<h2 className="display-title text-4xl leading-tight tracking-[-0.04em] text-foreground sm:text-5xl">
						{m.workflow_title()}
					</h2>
				</div>
				<div className="mt-12 grid gap-7 md:grid-cols-3">
					{steps.map((step) => (
						<FlowStep
							key={step.title()}
							icon={step.icon}
							title={step.title()}
							text={step.text()}
						/>
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
