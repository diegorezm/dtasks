import { Button } from "@dtask/ui/components/button";
import { Link } from "@tanstack/react-router";

export function LandingCTA() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight">
          Ready to ditch Jira?
        </h2>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Get your team set up in minutes. No migrations, no consultants, no
          pain.
        </p>
        <Link to="/register">
          <Button size="lg" className="px-10">
            Start for free
          </Button>
        </Link>
      </div>
    </section>
  );
}
