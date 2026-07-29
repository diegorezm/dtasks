import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import ParaglideLocaleSwitcher from "#/components/LocaleSwitcher";
import { Button } from "#/components/ui/button";
import { brand } from "#/core/branding/brand";
import { BrandLogo } from "#/core/branding/brand-logo";
import { UserButton } from "#/features/auth/components/user-button";
import { m } from "#/paraglide/messages";

export function LandingHeader() {
	return (
		<header className="page-wrap pt-5 sm:pt-7">
			<nav
				className="island-shell flex items-center justify-between rounded-2xl px-4 py-3 sm:px-5"
				aria-label={m.nav_main()}
			>
				<a
					className="no-underline"
					href="#top"
					aria-label={m.brand_home({ brand: brand.name })}
				>
					<BrandLogo />
				</a>
				<div className="hidden items-center gap-7 text-sm font-semibold sm:flex">
					<a className="nav-link" href="#workflow">
						{m.nav_workflow()}
					</a>
					<a className="nav-link" href="#visibility">
						{m.nav_visibility()}
					</a>
					<a className="nav-link" href="#start">
						{m.nav_get_started()}
					</a>
				</div>
				<div className="flex items-center gap-3">
					<ParaglideLocaleSwitcher />
					<UserButton
						className="hidden sm:inline-flex"
						fallback={
							<Button asChild className="hidden sm:inline-flex">
								<Link to="/dashboard">{m.start_workspace()}</Link>
							</Button>
						}
					/>
				</div>
				<Link
					className="grid size-9 place-items-center rounded-lg text-foreground sm:hidden"
					to="/dashboard"
					aria-label={m.nav_get_started()}
				>
					<Menu size={20} />
				</Link>
			</nav>
		</header>
	);
}
