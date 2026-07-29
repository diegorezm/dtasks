import { Menu } from "lucide-react";
import { Button } from "#/components/ui/button";

export function LandingHeader() {
	return (
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
					<span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-extrabold text-primary-foreground">
						D
					</span>
					<span className="font-extrabold tracking-[-0.04em] text-foreground">
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
				<Button
					asChild
					className="hidden rounded-lg bg-primary text-sm font-bold text-primary-foreground hover:bg-primary/90 sm:inline-flex"
				>
					<a href="#start">Start a workspace</a>
				</Button>
				<a
					className="grid size-9 place-items-center rounded-lg text-foreground sm:hidden"
					href="#start"
					aria-label="Get started"
				>
					<Menu size={20} />
				</a>
			</nav>
		</header>
	);
}
