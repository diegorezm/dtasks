/**
 * The single source of truth for the product's customer-facing identity.
 * Update this object (and BrandLogo for a new visual mark) when rebranding.
 */
export const brand = {
	name: "DTasks",
	mark: "D",
	tagline: "Shared project clarity",
	description: "Project work, clearly shared.",
	contactEmail: "hello@dtasks.example",
} as const;
