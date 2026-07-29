import type * as React from "react";
import { cn } from "#/lib/utils";
import { brand } from "./brand";

type BrandLogoProps = React.ComponentProps<"span">;

/** Replace this component when the product needs a new logo or wordmark. */
export function BrandLogo({ className, ...props }: BrandLogoProps) {
	return (
		<span className={cn("flex items-center gap-2.5", className)} {...props}>
			<span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-extrabold text-primary-foreground">
				{brand.mark}
			</span>
			<span className="font-extrabold tracking-[-0.04em] text-foreground">
				{brand.name}
			</span>
		</span>
	);
}
