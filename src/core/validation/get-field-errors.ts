import type { ZodError } from "zod";

type MessageFactory = () => string;

export function getFieldErrors<Field extends string>(
	error: ZodError,
	messages: Record<Field, MessageFactory>,
): Partial<Record<Field, string>> {
	const errors: Partial<Record<Field, string>> = {};

	for (const issue of error.issues) {
		const field = issue.path[0];
		if (typeof field === "string" && field in messages) {
			const validatedField = field as Field;
			errors[validatedField] ??= messages[validatedField]();
		}
	}

	return errors;
}
