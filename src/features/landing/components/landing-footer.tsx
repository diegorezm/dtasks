import { brand } from "#/core/branding/brand";
import { m } from "#/paraglide/messages";

export function LandingFooter() {
	return (
		<footer className="page-wrap mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
			<span>© 2026 {brand.name}</span>
			<span>{m.footer_description()}</span>
		</footer>
	);
}
