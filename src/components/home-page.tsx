import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { companies, stats } from "@/data/content";
import { Btn, Footer, Wave } from "@/components/chrome";
import { Mark } from "@/components/marks";

const STORIES = [
  ["Our existing", "financial system", "is archaic..."],
  ["Novel tech stacks have", "enabled a new form", "of markets..."],
  ["We bridge Wall Street's", "top capital allocators to", "digital finance"],
] as const;

const STORY_PHOTOS = [
  { src: "/photos/terminal.jpg", alt: "An old trading terminal" },
  { src: "/photos/rack.jpg", alt: "A room of server racks" },
  { src: "/photos/office.jpg", alt: "The team in the studio" },
];

const QUOTE = "Investing at the intersection of fintech and blockchain since 2019.";

function clamp(n: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, n));
}

function power1(t: number) {
  const x = clamp(t);
  return x < 0.5 ? 2 * x * x : 1 - ((-2 * x + 2) ** 2) / 2;
}

function power3(t: number) {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - ((-2 * x + 2) ** 3) / 2;
}

function band(t: number, a: number, b: number, c: number, d: number) {
  return clamp((t - a) / (b - a)) * (1 - clamp((t - c) / (d - c)));
}

function useProgress(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setP(1);
        return;
      }
      setP(clamp(-el.getBoundingClientRect().top / total));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, enabled]);
  return enabled ? p : 1;
}

function usePass(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      setP(clamp((window.innerHeight - rect.top) / total));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, enabled]);
  return enabled ? p : 0;
}

function lineAt(index: number, t: number) {
  let text: string = STORIES[0][index];
  let hot = false;
  for (let i = 1; i < STORIES.length; i++) {
    const next: string = STORIES[i][index];
    const delay = index * 0.1;
    const wipe0 = i - 0.25 + delay;
    const wipe1 = wipe0 + 0.25;
    const type0 = i + delay;
    const type1 = type0 + 0.25;
    if (t < wipe0) break;
    hot = true;
    if (t < wipe1) {
      const n = Math.max(1, Math.round((1 - (t - wipe0) / 0.25) * text.length));
      return { text: text.slice(0, n), hot: true };
    }
    if (t < type0) return { text: next.charAt(0), hot: true };
    if (t < type1) {
      const n = Math.max(1, Math.round(((t - type0) / 0.25) * next.length));
      return { text: next.slice(0, n), hot: true };
    }
    text = next;
    hot = false;
  }
  return { text, hot };
}

function blinkOn(t: number) {
  for (let i = 0; i < STORIES.length; i++) {
    if (t >= i + 0.25 && t < i + 1.05) return true;
  }
  return false;
}

type Pose = { x: number; y: number; s: number; r: number };

function mix(a: Pose, b: Pose, t: number): Pose {
  const ye = power1(t);
  const xe = power3(t);
  return {
    x: a.x + (b.x - a.x) * xe,
    y: a.y + (b.y - a.y) * ye,
    s: a.s + (b.s - a.s) * xe,
    r: a.r + (b.r - a.r) * xe,
  };
}

const CENTER: Pose = { x: 0, y: 0, s: 1, r: 8 };
const SIDE: Pose = { x: 58, y: -72, s: 0.62, r: 16 };
const WAIT: Pose = { x: 58, y: 64, s: 0.72, r: 16 };
const BELOW: Pose = { x: 58, y: 150, s: 0.72, r: 16 };
const ABOVE: Pose = { x: 58, y: -160, s: 0.55, r: 16 };

function poseAt(i: number, t: number): Pose {
  const u = (a: number, b: number) => clamp((t - a) / (b - a));
  if (i === 0) return t < 1 ? mix(CENTER, SIDE, u(0, 1)) : mix(SIDE, ABOVE, u(1, 2));
  if (i === 1) return t < 1 ? mix(WAIT, CENTER, u(0, 1)) : mix(CENTER, SIDE, u(1, 2));
  return t < 1 ? mix(BELOW, WAIT, u(0, 1)) : mix(WAIT, CENTER, u(1, 2));
}

function Slot({
  a,
  b,
  alt,
  className,
  delay,
}: {
  a: string;
  b: string;
  alt: string;
  className: string;
  delay: string;
}) {
  return (
    <span className={`slot ${className}`} aria-hidden="true">
      <img src={a} alt={alt} />
      <img className="alt" src={b} alt="" style={{ animationDelay: delay }} />
    </span>
  );
}

function Squiggle({ flip }: { flip?: boolean }) {
  return (
    <svg className={`squiggle ${flip ? "flip" : ""}`} viewBox="0 0 54 40" aria-hidden="true">
      <path d="M8 6c8 7 8 21 0 28" />
      <path d="M22 6c8 7 8 21 0 28" />
      <path d="M36 6c8 7 8 21 0 28" />
    </svg>
  );
}

function LoopRow({
  kind,
  parts,
  photo,
  alt,
  photoFirst,
}: {
  kind: "serif" | "pixel";
  parts: string[];
  photo: string;
  alt: string;
  photoFirst?: boolean;
}) {
  const item = (key: string) => (
    <span className="loop-item" key={key}>
      {photoFirst ? <img className="inline-photo" src={photo} alt="" /> : null}
      {parts.map((part) => (
        <span key={part}>{part}</span>
      ))}
      {photoFirst ? null : <img className="inline-photo" src={photo} alt={alt} />}
    </span>
  );
  return (
    <div className={`giant-row ${kind}`}>
      <div className="loop-track">
        {item("a")}
        {item("b")}
      </div>
    </div>
  );
}

export function HomePage() {
  const storyRef = useRef<HTMLElement>(null);
  const approachRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const capRef = useRef<HTMLElement>(null);
  const bridgeRef = useRef<HTMLElement>(null);
  const [calm, setCalm] = useState(false);
  const [compact, setCompact] = useState(false);
  const motion = !calm && !compact;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 900px)");
    const apply = () => {
      setCalm(reduce.matches);
      setCompact(narrow.matches);
    };
    apply();
    reduce.addEventListener("change", apply);
    narrow.addEventListener("change", apply);
    return () => {
      reduce.removeEventListener("change", apply);
      narrow.removeEventListener("change", apply);
    };
  }, []);

  const storyP = useProgress(storyRef, motion);
  const approachP = useProgress(approachRef, motion);
  const quoteP = useProgress(quoteRef, motion);
  const statP = useProgress(statsRef, motion);
  const capPass = usePass(capRef, motion);
  const bridgePass = usePass(bridgeRef, motion);

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView();
  }, []);

  const storyT = storyP * 2.95;
  const lines = [0, 1, 2].map((i) => lineAt(i, storyT));
  const blinking = blinkOn(storyT) || lines.some((line) => line.hot);

  const t = approachP * 11;
  const ghostO = calm || compact ? 0 : 1 - clamp((t - 0.35) / 0.85);
  const finO = calm || compact ? 0 : band(t, 0.45, 1.35, 2.4, 3.15);
  const dataO = calm || compact ? 0 : band(t, 2.45, 3.2, 5.65, 6.35);
  const chainO = calm || compact ? 0 : band(t, 5.95, 6.55, 8.45, 9.15);
  const fullO = calm || compact ? 1 : clamp((t - 8.65) / 1.05);
  const spread = calm || compact ? 1 : power3(clamp(t / 1.05));
  const candles = calm || compact ? 1 : clamp((t - 0.75) / 1.25);
  const zoom = calm || compact ? 1 : 1 + power3(clamp((t - 10.05) / 0.95)) * 14;
  const cover = calm || compact ? 0 : clamp((t - 10.4) / 0.6);
  const copyFade = calm || compact ? 1 : 1 - clamp((t - 9.5) / 0.8);

  const openH = calm || compact ? 1 : clamp(quoteP / 0.34);
  const openW = calm || compact ? 1 : clamp((quoteP - 0.28) / 0.4);
  const subO = calm || compact ? 1 : clamp((quoteP - 0.62) / 0.22);
  const quoteChars = QUOTE.split("");

  return (
    <main>
      <section className="hero" data-theme="light">
        <h1 className="hero-lockup" aria-label="Advancing the Economic Networks of the Future">
          <span className="hero-line line-a">
            <span className="word">Advancing</span>
            <Slot className="slot-a" a="/photos/exchange.jpg" b="/photos/boards.jpg" alt="" delay="0s" />
          </span>
          <span className="hero-line line-b">
            <Slot className="slot-b" a="/photos/facade.jpg" b="/photos/cables.jpg" alt="" delay="0.35s" />
            <span className="word">the Economic</span>
          </span>
          <span className="hero-line line-c">
            <span className="word">Networks of</span>
            <Slot className="slot-c" a="/photos/street.jpg" b="/photos/servers.jpg" alt="" delay="0.7s" />
          </span>
          <span className="hero-line line-d">
            <Slot className="slot-d" a="/photos/columns.jpg" b="/photos/terminal.jpg" alt="" delay="1.05s" />
            <span className="word">the Future</span>
          </span>
        </h1>
      </section>

      <section className="story-pin" data-theme="dark" data-wave="78" ref={storyRef}>
        <Wave tone="ink" />
        <div className="story-sticky">
          <button
            type="button"
            className="scroll-hint"
            onClick={() => {
              const top = (storyRef.current?.offsetTop ?? 0) + window.innerHeight * 1.1;
              window.scrollTo({ top, behavior: "smooth" });
            }}
          >
            <i />
            <span>Scroll</span>
          </button>
          <div className="story-stage" aria-hidden="true">
            {STORY_PHOTOS.map((photo, i) => {
              const pose = motion ? poseAt(i, storyT) : i === 0 ? CENTER : ABOVE;
              return (
                <div
                  key={photo.src}
                  className="story-photo"
                  style={{
                    transform: `translate3d(${pose.x}%, ${pose.y}%, 0) scale(${pose.s})`,
                    borderRadius: pose.r,
                    zIndex: Math.round(pose.s * 10),
                  }}
                >
                  <img src={photo.src} alt={photo.alt} />
                </div>
              );
            })}
          </div>
          <div className="story-copy">
            <div className="story-anim" aria-hidden={compact}>
              {lines.map((line, i) => (
                <p className="story-line" key={STORIES[0][i]}>
                  <span>{line.text}</span>
                  <i className={blinking || line.hot ? "blinky on" : "blinky"} />
                </p>
              ))}
            </div>
            <div className="story-static">
              {STORIES.map((story) => (
                <p key={story[0]}>{story.join(" ")}</p>
              ))}
            </div>
          </div>
          <aside className="innovators">
            <h3>The Innovators</h3>
            <p>Meet the teams building the next generation of capitalism.</p>
            <Btn to="/portfolio">View Portfolio</Btn>
          </aside>
        </div>
      </section>

      <section className="band band-cream" data-theme="light" data-wave="78" ref={capRef}>
        <Wave tone="cream" />
        <div
          className="giant"
          style={{ transform: motion ? `translate3d(-${capPass * 18}vw, 0, 0)` : undefined }}
          aria-label="Wall Street capitalism, running on blockchain rails"
        >
          <LoopRow
            kind="serif"
            parts={["Capitalism", "Wall Street"]}
            photo="/photos/crowd.jpg"
            alt="A trading floor crowd"
          />
          <LoopRow
            kind="pixel"
            parts={["Running on Blockchain Rails"]}
            photo="/photos/servers.jpg"
            alt="Server racks"
          />
        </div>
      </section>

      <section className="founders" id="portfolio" data-theme="dark" data-wave="78">
        <Wave tone="ink" />
        <div className="founders-grid">
          <div>
            <h2>Next-gen markets need next-gen founders</h2>
            <p>We back exceptional teams engineering the next generation of financial markets.</p>
            <Btn to="/portfolio">View Portfolio</Btn>
          </div>
          <div className="pcard-list">
            {companies.slice(0, 3).map((c) => (
              <Link key={c.id} to="/portfolio" hash={c.id} className="pcard">
                <span className="pcard-idx">{c.index}</span>
                <span className="pcard-name">
                  <Mark name={c.name} />
                  {c.name}
                </span>
                <span className="pcard-go" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="approach-pin"
        id="approach"
        data-theme="light"
        data-wave="78"
        ref={approachRef}
      >
        <Wave tone="cream" />
        <div className="approach-sticky">
          <div
            className="approach-grid"
            style={{ opacity: copyFade, ["--spread" as string]: String(spread) } as CSSProperties}
          >
            <div
              className="venn"
              aria-hidden="true"
              style={{ transform: `scale(${zoom})` }}
            >
              <div className="venn-layer layer-ghost" style={{ opacity: ghostO }}>
                <div className="blob b1">Finance</div>
                <div className="blob b2">Data</div>
                <div className="blob b3">Blockchain</div>
              </div>
              <div className="venn-layer layer-prim" style={{ opacity: finO }}>
                <div className="disc">
                  <span>Financial Primitives</span>
                  <div className="candles" style={{ transform: `scaleY(${candles})` }}>
                    <i /><i /><i /><i /><i /><i /><i />
                  </div>
                </div>
              </div>
              <div className="venn-layer layer-data" style={{ opacity: dataO }}>
                <div className="disc dots">
                  <span>Immutable Data</span>
                </div>
              </div>
              <div className="venn-layer layer-chain" style={{ opacity: chainO }}>
                <div className="disc rails">
                  <span>Blockchain Rails</span>
                </div>
              </div>
              <div className="venn-layer layer-full" style={{ opacity: fullO }}>
                <div className="blob b1">
                  Financial
                  <br />
                  Primitives
                </div>
                <div className="blob b2">
                  Immutable
                  <br />
                  Data
                </div>
                <div className="blob b3">
                  Blockchain
                  <br />
                  Rails
                </div>
                <span className="venn-tri" style={{ opacity: fullO }} />
              </div>
            </div>
            <div className="approach-copy">
              <h2>Our Unique Approach</h2>
              <p>
                We invest in teams building at the intersection of blockchain technology, financial
                markets, and data at the earliest stages.
              </p>
              <Btn to="/contact">Get in Touch</Btn>
            </div>
          </div>
          <div className="approach-cover" style={{ opacity: cover }} />
        </div>
      </section>

      <div className="dark-run">
        <section className="quotes-pin" ref={quoteRef} data-theme="dark">
          <div className="quotes-sticky">
            <div className="since-head">
              <Squiggle />
              <h2
                className="reveal-title"
                style={{
                  clipPath: `inset(${(1 - openH) * 100}% ${(1 - openW) * 46}% 0 ${(1 - openW) * 46}%)`,
                }}
              >
                {quoteChars.map((ch, i) => (
                  <span
                    key={`${ch}-${i}`}
                    style={{ opacity: openW >= (i + 1) / quoteChars.length ? 1 : 0.08 }}
                  >
                    {ch}
                  </span>
                ))}
              </h2>
              <Squiggle flip />
            </div>
            <div
              className="since-row"
              style={{
                opacity: subO,
                transform: motion ? `translate3d(0, ${(1 - subO) * 28}px, 0)` : undefined,
              }}
            >
              <p>
                The digital finance shift is creating billions in economic value via reduced
                inefficiencies and the creation of new markets. Our firm is solely focused on this
                evolution.
              </p>
              <Btn to="/team">Meet the Team</Btn>
            </div>
          </div>
        </section>

        <section className="stats-pin" ref={statsRef} data-theme="dark">
          <div className="stats-sticky">
            <div
              className="stats-shift"
              style={motion ? { transform: `translate3d(-${statP * 42}%, 0, 0)` } : undefined}
            >
              <div className="stats-track">
                {[0, 1].map((copy) =>
                  stats.map((s) => (
                    <article key={`${copy}-${s.n}`} className="stat" aria-hidden={copy === 1}>
                      <b>{s.n}</b>
                      <span>{s.l}</span>
                    </article>
                  )),
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="band band-bridge" data-theme="light" data-wave="78" ref={bridgeRef}>
        <Wave tone="cream" />
        <div
          className="giant"
          style={{ transform: motion ? `translate3d(-${bridgePass * 16}vw, 0, 0)` : undefined }}
          aria-label="Bridging the old with the new"
        >
          <LoopRow
            kind="serif"
            parts={["Bridging the Old"]}
            photo="/photos/skyline.jpg"
            alt="Lower Manhattan and the bridge"
            photoFirst
          />
          <LoopRow
            kind="pixel"
            parts={["With the New"]}
            photo="/photos/boards.jpg"
            alt="Electronic quote boards"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
