import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/__public")({
	component: Outlet,
});
