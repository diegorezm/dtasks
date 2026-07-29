import { LandingCta } from "#/features/landing/components/landing-cta";
import { LandingFooter } from "#/features/landing/components/landing-footer";
import { LandingHeader } from "#/features/landing/components/landing-header";
import { LandingHero } from "#/features/landing/components/landing-hero";
import { VisibilitySection } from "#/features/landing/components/visibility-section";
import { WorkflowSection } from "#/features/landing/components/workflow-section";

export function LandingPage() {
	return (
		<main className="pb-12 sm:pb-20">
			<LandingHeader />
			<LandingHero />
			<WorkflowSection />
			<VisibilitySection />
			<LandingCta />
			<LandingFooter />
		</main>
	);
}
