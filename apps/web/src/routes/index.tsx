import { env } from "@dtask/env/web";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: ConnectivityPage,
});

function ConnectivityPage() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const base = (env?.VITE_SERVER_URL ?? "").replace(/\/+$/, "");
        if (!base) {
          setOk(false);
          setErr("Server URL (VITE_SERVER_URL) is not configured");
          return;
        }
        const healthUrl = `${base}/health`;
        const res = await fetch(healthUrl, { cache: "no-store" });
        if (!res.ok) {
          setOk(false);
          setErr(`Health check failed: ${res.status}`);
          return;
        }
        setOk(true);
      } catch (e: any) {
        setOk(false);
        setErr(String(e?.message ?? e));
      }
    };
    check();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>API Connectivity</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <StatusCard
          title="Server Health"
          status={ok === null ? "loading" : ok ? "ok" : "error"}
          detail={err ?? "Health endpoint checked"}
        />
        <StatusCard
          title="Client Configuration"
          status={ok === null ? "loading" : ok ? "ok" : "error"}
          detail={`Base URL: ${env?.VITE_SERVER_URL ?? "not set"}`}
          note={
            ok
              ? "Health check passed"
              : ok === false
                ? "Server unreachable"
                : "Checking..."
          }
        />
      </div>
      <p style={{ marginTop: 12, color: "#555" }}>
        This panel uses fetch to query the server health endpoint to verify
        connectivity.
      </p>
    </div>
  );
}

function StatusCard({
  title,
  status,
  detail,
  note,
}: {
  title: string;
  status?: string;
  detail?: string;
  note?: string;
}) {
  const color = status === "ok" ? "green" : status === "error" ? "red" : "gray";
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>{title}</strong>
        <span style={{ color }}>{status ?? ""}</span>
      </div>
      <div style={{ marginTop: 6 }}>{detail}</div>
      {note && <div style={{ marginTop: 6, color: "#555" }}>{note}</div>}
    </div>
  );
}
