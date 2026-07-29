import type * as React from "react";

import { cn } from "#/lib/utils";

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-group"
			className={cn("flex w-full flex-col gap-5", className)}
			{...props}
		/>
	);
}

function Field({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field"
			className={cn(
				"group/field flex w-full flex-col gap-2 data-[disabled]:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

function FieldLabel({ className, ...props }: React.ComponentProps<"label">) {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: Consumers associate this reusable label with htmlFor.
		<label
			data-slot="field-label"
			className={cn(
				"text-sm font-medium leading-none group-data-[invalid=true]/field:text-destructive",
				className,
			)}
			{...props}
		/>
	);
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="field-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

function FieldError({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="field-error"
			role="alert"
			className={cn("text-sm text-destructive", className)}
			{...props}
		/>
	);
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel };
