import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__private/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/__private/dashboard/"!</div>;
}
