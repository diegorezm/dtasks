import { Kanban, Zap, Link2, Tag, Users, LayoutTemplate } from "lucide-react";

const features = [
  {
    icon: Kanban,
    title: "Kanban boards",
    description:
      "Drag-and-drop boards with custom columns, tags, and filters. Your workflow, your way.",
    accent: "bg-blue-50 text-blue-600",
  },
  {
    icon: Zap,
    title: "Real-time updates",
    description:
      "Powered by Cloudflare Durable Objects. Every move, every comment — instant across your whole team.",
    accent: "bg-yellow-50 text-yellow-600",
  },
  {
    icon: Link2,
    title: "Customer portals",
    description:
      "Share a branded portal with your customers. They submit tickets, you handle them.",
    accent: "bg-purple-50 text-purple-600",
  },
  {
    icon: Tag,
    title: "Custom tags & filters",
    description:
      "Organize tickets your way with custom tags, priorities, and powerful filters.",
    accent: "bg-green-50 text-green-600",
  },
  {
    icon: Users,
    title: "Team collaboration",
    description:
      "Assign tickets, leave comments, and track progress together in one place.",
    accent: "bg-orange-50 text-orange-600",
  },
  {
    icon: LayoutTemplate,
    title: "Customer submissions",
    description:
      "Let customers create and track their own tickets through your customizable portal.",
    accent: "bg-red-50 text-red-600",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="px-6 py-24 border-t">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 max-w-xl">
          <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
            Features
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            Everything your team needs
          </h2>
          <p className="text-lg text-muted-foreground">
            Without the bloat, without the learning curve.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 rounded-2xl overflow-hidden border">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-4 bg-background p-8 hover:bg-muted/30 transition-colors"
            >
              <div
                className={`size-10 rounded-lg flex items-center justify-center ${f.accent}`}
              >
                <f.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
