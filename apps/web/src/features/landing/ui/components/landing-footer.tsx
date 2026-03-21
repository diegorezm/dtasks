export function LandingFooter() {
  return (
    <footer className="border-t px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <span className="text-sm font-bold tracking-tight">dtask</span>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} dtask.
        </p>
      </div>
    </footer>
  );
}
