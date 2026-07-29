import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "#/components/ui/button";
import { brand } from "#/core/branding/brand";
import { m } from "#/paraglide/messages";

export function LandingCta() {
	return (
		<section id="start" className="page-wrap">
			<div className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center shadow-[0_24px_50px_rgba(0,0,0,0.14)] sm:px-12 sm:py-16">
				<p className="island-kicker text-primary-foreground">
					{m.cta_kicker()}
				</p>
				<h2 className="display-title mx-auto mt-4 max-w-2xl text-4xl leading-tight tracking-[-0.04em] text-primary-foreground sm:text-5xl">
					{m.cta_title()}
				</h2>
				<p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-primary-foreground/70">
					{m.cta_description()}
				</p>
				<Button
					asChild
					size="lg"
					className="mt-8 rounded-xl bg-primary-foreground font-bold text-primary hover:-translate-y-0.5 hover:bg-primary-foreground/90"
				>
					<Link to="/dashboard">
						{m.cta_start({ brand: brand.name })} <ArrowRight size={18} />
					</Link>
				</Button>
			</div>
		</section>
	);
}
