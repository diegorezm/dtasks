import type { Id, TableNames } from "../../../convex/_generated/dataModel";

/**
 * Converts a route parameter to Convex's opaque ID type. Convex validates the
 * table ID when the request reaches the backend.
 */
export function routeParamId<TableName extends TableNames>(value: string) {
	return value as Id<TableName>;
}
