import { Button } from "#/components/ui/button";
import { Field, FieldDescription } from "#/components/ui/field";
import { m } from "#/paraglide/messages";

export function GoogleAuthButton() {
	return (
		<Field data-disabled>
			<Button
				type="button"
				variant="outline"
				size="lg"
				className="w-full"
				disabled
			>
				<svg data-icon="inline-start" viewBox="0 0 24 24" aria-hidden="true">
					<path
						fill="#4285F4"
						d="M21.6 12.23c0-.71-.06-1.4-.19-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.4"
					/>
					<path
						fill="#34A853"
						d="M12 22c2.7 0 4.98-.9 6.63-2.43l-3.24-2.54c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.61A10 10 0 0 0 12 22"
					/>
					<path
						fill="#FBBC05"
						d="M6.39 13.86A6 6 0 0 1 6.07 12c0-.65.11-1.28.32-1.86V7.53H3.04A10 10 0 0 0 2 12c0 1.61.39 3.13 1.04 4.47z"
					/>
					<path
						fill="#EA4335"
						d="M12 6.01c1.47 0 2.79.51 3.83 1.5l2.87-2.88A9.65 9.65 0 0 0 12 2a10 10 0 0 0-8.96 5.53l3.35 2.61C7.18 7.77 9.39 6.01 12 6.01"
					/>
				</svg>
				{m.continue_google()}
			</Button>
			<FieldDescription className="text-center">
				{m.google_coming_later()}
			</FieldDescription>
		</Field>
	);
}
