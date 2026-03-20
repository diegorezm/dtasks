import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: ConnectivityPage,
});

function ConnectivityPage() {
  return <div>a</div>;
}
