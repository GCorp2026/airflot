import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell, Footer } from "@/components/chrome";
import { team } from "@/data/content";

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [{ title: "Team — New Form" }] }),
  component: TeamPage,
});

function TeamPage() {
  const [open, setOpen] = useState(0);

  return (
    <SiteShell initialTheme="light">
      <main className="subpage sub-light" data-theme="light">
        <header className="sub-hero">
          <p className="eyebrow">Meet the team</p>
          <h1>Our people live on the edge of financial innovation.</h1>
          <p className="lede">
            Traditional institutional investing experience, paired with a bias for blockchain-enabled
            markets. The office is in New York.
          </p>
        </header>
        <div className="tlist">
          {team.map((person, i) => {
            const on = open === i;
            return (
              <article key={person.name} className={on ? "trow open" : "trow"}>
                <button
                  type="button"
                  className="ttrigger"
                  aria-expanded={on}
                  onClick={() => setOpen(on ? -1 : i)}
                >
                  <span className="mono" aria-hidden="true">
                    {person.initials}
                  </span>
                  <span className="tname">{person.name}</span>
                  <span className="trole">{person.role}</span>
                  <span className="tplus" aria-hidden="true">
                    {on ? "–" : "+"}
                  </span>
                </button>
                {on ? <p className="tbio">{person.bio}</p> : null}
              </article>
            );
          })}
        </div>
        <section className="office-note">
          <img src="/photos/office.jpg" alt="The New York studio" />
          <div>
            <h2>New York hustle</h2>
            <p>
              Our offices are in NYC, where we partner with some of the world’s leading capital
              allocators investing in digital assets.
            </p>
            <Link to="/contact" className="btn">
              Get in Touch
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </SiteShell>
  );
}
