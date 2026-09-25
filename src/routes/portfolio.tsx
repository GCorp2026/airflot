import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell, Footer } from "@/components/chrome";
import { Mark } from "@/components/marks";
import { companies, tags, type Tag } from "@/data/content";

export const Route = createFileRoute("/portfolio")({
  head: () => ({ meta: [{ title: "Portfolio — New Form" }] }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const [tag, setTag] = useState<"All" | Tag>("All");
  const list = tag === "All" ? companies : companies.filter((c) => c.tag === tag);

  return (
    <SiteShell initialTheme="dark">
      <main className="subpage sub-dark" data-theme="dark">
        <header className="sub-hero">
          <p className="eyebrow">The portfolio</p>
          <h1>Next-gen markets need next-gen founders</h1>
          <p className="lede">
            We back exceptional teams engineering the next generation of financial markets. A
            selection of companies building on blockchain rails.
          </p>
        </header>
        <div className="filters" role="tablist" aria-label="Filter portfolio">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tag === t}
              className={tag === t ? "chip on" : "chip"}
              onClick={() => setTag(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="plist">
          {list.map((c) => (
            <article key={c.id} id={c.id} className="prow">
              <span className="pcard-idx">{c.index}</span>
              <div className="prow-main">
                <h2>
                  <Mark name={c.name} />
                  {c.name}
                </h2>
                <p>{c.blurb}</p>
              </div>
              <span className="ptag">{c.tag}</span>
            </article>
          ))}
        </div>
        <div className="sub-cta">
          <p>Building at the intersection? We write first checks.</p>
          <Link to="/contact" className="btn">
            Get in Touch
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </main>
      <Footer />
    </SiteShell>
  );
}
