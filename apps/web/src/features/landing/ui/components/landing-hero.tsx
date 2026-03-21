import { Button } from "@dtask/ui/components/button";
import { Link } from "@tanstack/react-router";

const mockBoard = [
  {
    title: "To Do",
    color: "bg-muted",
    tickets: [
      { id: "DT-12", title: "Update API docs", tag: "docs", priority: "low" },
      { id: "DT-13", title: "Fix mobile layout", tag: "bug", priority: "high" },
    ],
  },
  {
    title: "In Progress",
    color: "bg-primary/10",
    tickets: [
      {
        id: "DT-09",
        title: "Customer portal v2",
        tag: "feature",
        priority: "high",
      },
      {
        id: "DT-10",
        title: "Email notifications",
        tag: "feature",
        priority: "med",
      },
    ],
  },
  {
    title: "Done",
    color: "bg-green-500/10",
    tickets: [
      {
        id: "DT-07",
        title: "Kanban drag & drop",
        tag: "feature",
        priority: "high",
      },
      { id: "DT-08", title: "Real-time sync", tag: "infra", priority: "high" },
    ],
  },
];

const tagColors: Record<string, string> = {
  bug: "bg-red-100 text-red-700",
  feature: "bg-blue-100 text-blue-700",
  docs: "bg-yellow-100 text-yellow-700",
  infra: "bg-purple-100 text-purple-700",
};

const priorityColors: Record<string, string> = {
  high: "bg-red-400",
  med: "bg-yellow-400",
  low: "bg-green-400",
};

export function LandingHero() {
  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-16 px-6 py-20 lg:flex-row lg:items-center lg:justify-between lg:gap-12 mx-auto max-w-6xl">
      <div className="flex max-w-xl flex-col gap-8">
        <div className="flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground w-fit">
          <span className="size-1.5 rounded-full bg-primary" />
          Real-time kanban powered by Cloudflare
        </div>

        <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
          Ticketing your team
          <br />
          <span className="text-primary">will actually use.</span>
        </h1>

        <p className="text-lg leading-relaxed text-muted-foreground">
          Kanban boards, customer portals, and real-time updates!
        </p>

        <div className="flex flex-wrap gap-3">
          <Link to="/register">
            <Button size="lg" className="px-8">
              Get started for free
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="lg" className="px-8">
              See how it works
            </Button>
          </a>
        </div>

        <p className="text-xs text-muted-foreground">
          No credit card required · Free to start
        </p>
      </div>

      {/* Mock kanban board */}
      <div className="w-full max-w-xl shrink-0 rounded-2xl border bg-muted/40 p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Project / dtask
          </span>
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400" />
            <span className="size-2.5 rounded-full bg-yellow-400" />
            <span className="size-2.5 rounded-full bg-green-400" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {mockBoard.map((col) => (
            <div key={col.title} className={`rounded-xl p-3 ${col.color}`}>
              <p className="mb-3 text-xs font-semibold text-muted-foreground">
                {col.title}
              </p>
              <div className="flex flex-col gap-2">
                {col.tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-lg border bg-background p-2.5 shadow-sm"
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {ticket.id}
                      </span>
                      <span
                        className={`size-1.5 rounded-full ${priorityColors[ticket.priority]}`}
                      />
                    </div>
                    <p className="text-xs font-medium leading-snug">
                      {ticket.title}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${tagColors[ticket.tag]}`}
                      >
                        {ticket.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
