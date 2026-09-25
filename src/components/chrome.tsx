import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

const NAV = [
  { href: "/", label: "Index", hash: "" },
  { href: "/portfolio", label: "Portfolio", hash: "" },
  { href: "/team", label: "The Team", hash: "" },
  { href: "/", label: "Approach", hash: "approach" },
  { href: "/contact", label: "Contact", hash: "" },
];

function SoundToggle() {
  const [on, setOn] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => stopRef.current?.();
  }, []);

  function toggle() {
    if (stopRef.current) {
      stopRef.current();
      stopRef.current = null;
      setOn(false);
      return;
    }
    const ctx = new AudioContext();
    void ctx.resume();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const a = ctx.createOscillator();
    const b = ctx.createOscillator();
    a.type = "sine";
    b.type = "triangle";
    a.frequency.value = 92;
    b.frequency.value = 138;
    filter.type = "lowpass";
    filter.frequency.value = 420;
    gain.gain.value = 0.018;
    a.connect(filter);
    b.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    a.start();
    b.start();
    stopRef.current = () => {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
      a.stop(ctx.currentTime + 0.1);
      b.stop(ctx.currentTime + 0.1);
      window.setTimeout(() => void ctx.close(), 180);
    };
    setOn(true);
  }

  return (
    <button
      type="button"
      className={`bars ${on ? "is-on" : ""}`}
      aria-pressed={on}
      aria-label={on ? "Mute ambient tone" : "Play ambient tone"}
      onClick={toggle}
    >
      <i />
      <i />
      <i />
    </button>
  );
}

export function SiteShell({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    const onScroll = () => {
      const y = 28;
      let next: Theme = initialTheme;
      document.querySelectorAll<HTMLElement>("[data-theme]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const wave = Number(el.dataset.wave || 0);
        if (r.top - wave <= y && r.bottom >= y) {
          const t = el.dataset.theme;
          if (t === "light" || t === "dark") next = t;
        }
      });
      setTheme(next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [initialTheme, pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <header className={`site-header theme-${theme}`}>
        <Link
          to="/"
          className="logo"
          aria-label="New Form, home"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <span className="logo-full">
            <span className="logo-new">New</span>Form
          </span>
          <span className="logo-n">N</span>
        </Link>
        <div className="top-actions">
          <button type="button" className="menu-label" onClick={() => setOpen(true)}>
            Menu
          </button>
          <SoundToggle />
        </div>
      </header>
      <div className={`menu ${open ? "is-open" : ""}`} hidden={!open}>
        <div className="menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="menu-top">
            <span className="logo-full">
              <span className="logo-new">New</span>Form
            </span>
            <button type="button" className="menu-close" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
          <nav className="menu-nav">
            {NAV.map((item, i) => (
              <Link
                key={item.label}
                to={item.href}
                hash={item.hash || undefined}
                className="menu-link"
                onClick={() => setOpen(false)}
              >
                <span className="menu-idx">0{i + 1}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="menu-foot">New York · Investing since 2019</p>
        </div>
      </div>
      <div id="content">{children}</div>
    </>
  );
}

export function Footer() {
  return (
    <div className="footer-wrap" data-theme="dark">
      <div className="totop-row">
        <button
          type="button"
          className="totop"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span>Top of Page</span>
          <span className="totop-hill" aria-hidden="true">
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
              <path d="M7 15V2M7 2L1.5 7.5M7 2l5.5 5.5" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
        </button>
      </div>
      <footer className="site-footer">
        <a className="mail" href="mailto:info@newformcap.com">
          info@newformcap.com
        </a>
        <div className="foot-links">
          <Link to="/">Home</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/team">Team</Link>
          <a href="https://www.linkedin.com/company/new-form-capital" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
}

export function Wave({ tone }: { tone: "ink" | "cream" }) {
  return (
    <svg className={`wave-cap tone-${tone}`} viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M0,80 C300,80 470,12 720,12 C970,12 1140,80 1440,80 L1440,100 L0,100 Z"
      />
    </svg>
  );
}

export function Btn({ to, hash, children }: { to: string; hash?: string; children: string }) {
  return (
    <Link to={to} hash={hash} className="btn">
      {children}
      <span className="btn-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
