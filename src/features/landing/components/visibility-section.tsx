import { ArrowRight, Check } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";

const customerItems = [
	{ title: "Homepage copy", status: "Ready for review" },
	{ title: "Review visual direction", status: "In progress" },
	{ title: "Confirm content map", status: "Next up" },
];

export function VisibilitySection() {
	return (
		<section
			id="visibility"
			className="page-wrap grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]"
		>
			<CustomerPreview />
			<div>
				<p className="island-kicker mb-4">Visibility without noise</p>
				<h2 className="display-title text-4xl leading-tight tracking-[-0.04em] text-foreground sm:text-5xl">
					Customers stay informed. Teams stay focused.
				</h2>
				<p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
					Keep internal planning private while customer-facing work stays
					current and easy to follow.
				</p>
				<Button asChild variant="link" className="mt-7 px-0 font-bold">
					<a href="#start">
						Set up shared project visibility <ArrowRight size={18} />
					</a>
				</Button>
			</div>
		</section>
	);
}

function CustomerPreview() {
	return (
		<Card className="island-shell gap-0 rounded-2xl p-5 sm:p-7">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-bold text-foreground">Customer view</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Northstar / Website refresh
					</p>
				</div>
				<span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">
					Client access
				</span>
			</div>
			<div className="mt-7 space-y-3">
				{customerItems.map((item) => (
					<CustomerItem key={item.title} {...item} />
				))}
			</div>
			<p className="mt-6 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
				Shared project detail. Customer sees only work connected to this
				project.
			</p>
		</Card>
	);
}

function CustomerItem({ title, status }: { title: string; status: string }) {
	const complete = status === "Ready for review";

	return (
		<Card className="flex-row items-center gap-3 rounded-xl border-border bg-card p-3">
			<span className={complete ? "text-foreground" : "text-primary"}>
				{complete ? (
					<Check size={18} />
				) : (
					<span className="block size-3 rounded-full border-2 border-current" />
				)}
			</span>
			<span className="min-w-0 flex-1 text-sm font-bold text-foreground">
				{title}
			</span>
			<span className="text-xs font-semibold text-muted-foreground">
				{status}
			</span>
		</Card>
	);
}
