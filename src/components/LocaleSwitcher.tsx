import { Globe2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { m } from "#/paraglide/messages";
import { getLocale, setLocale } from "#/paraglide/runtime";

const localeOptions = [
	{ value: "en", shortLabel: "EN", label: () => m.language_english() },
	{
		value: "pt-BR",
		shortLabel: "PT",
		label: () => m.language_portuguese_brazil(),
	},
] as const;

type SupportedLocale = (typeof localeOptions)[number]["value"];

function isSupportedLocale(locale: string): locale is SupportedLocale {
	return localeOptions.some((option) => option.value === locale);
}

export default function ParaglideLocaleSwitcher() {
	const currentLocale = getLocale();

	return (
		<div className="flex h-9 items-center rounded-lg border border-border/70 bg-background/55 p-0.5 shadow-xs backdrop-blur-sm">
			<Globe2
				className="mx-2 size-3.5 text-muted-foreground"
				aria-hidden="true"
			/>
			<ToggleGroup
				type="single"
				value={currentLocale}
				onValueChange={(locale) => {
					if (isSupportedLocale(locale)) setLocale(locale);
				}}
				spacing={0}
				className="gap-0"
				aria-label={m.language_label()}
			>
				{localeOptions.map((locale) => (
					<ToggleGroupItem
						key={locale.value}
						value={locale.value}
						aria-label={locale.label()}
						className="h-7 min-w-9 rounded-md px-2 font-mono text-[0.6875rem] font-bold tracking-[0.08em] text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:shadow-sm"
					>
						{locale.shortLabel}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
		</div>
	);
}
