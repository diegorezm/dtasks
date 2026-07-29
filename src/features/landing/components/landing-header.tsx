import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "#/components/ui/button";
import { brand } from "#/core/branding/brand";
import { BrandLogo } from "#/core/branding/brand-logo";

export function LandingHeader() {
	return (
		<header className="page-wrap pt-5 sm:pt-7">
			<nav
				className="island-shell flex items-center justify-between rounded-2xl px-4 py-3 sm:px-5"
				aria-label="Main navigation"
			>
				<a
					className="no-underline"
					href="#top"
					aria-label={`${brand.name} home`}
				>
					<BrandLogo />
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
					<Link to="/dashboard">Start a workspace</Link>
				</Button>
				<Link
					className="grid size-9 place-items-center rounded-lg text-foreground sm:hidden"
					to="/dashboard"
					aria-label="Get started"
				>
					<Menu size={20} />
				</Link>
			</nav>
		</header>
	);
}
