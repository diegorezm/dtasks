import { Outlet } from "@tanstack/react-router";
import { LandingFooter } from "./landing-footer";
import { LandingNavbar } from "./landing-navbar";

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
}
