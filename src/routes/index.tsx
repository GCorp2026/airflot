import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/chrome";
import { HomePage } from "@/components/home-page";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <SiteShell initialTheme="light">
      <HomePage />
    </SiteShell>
  );
}
