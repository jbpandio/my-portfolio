"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { PROJECTS } from "./data";
import { prefersReducedMotion } from "./primitives";

const END = 4400;

/** Milliseconds since mount, driving the terminal boot sequence. */
function useBootClock() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const skip = prefersReducedMotion();
    const t0 = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const dt = skip ? END : now - t0;
      setT(dt);
      if (dt < END) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return t;
}

function usePhtClock() {
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Manila", hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return clock;
}

export default function Hero({
  kbd,
  onOpenPalette,
  onOpenProject,
  onNav,
}: {
  kbd: string;
  onOpenPalette: () => void;
  onOpenProject: (i: number) => void;
  onNav: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const t = useBootClock();
  const clock = usePhtClock();
  const type = (s: string, at: number) => s.slice(0, Math.max(0, Math.floor((t - at) / 38)));
  const on = (at: number) => (t >= at ? "on" : "");
  const caret = <span className="caret" />;

  return (
    <section id="top" className="hero">
      <div className="hero-body">
        <div className="hero-line">
          <div>
            <span className="ac">$</span> {type("whoami", 250)}
            {t < 650 && caret}
          </div>
          <h1 className={`fade ${on(650)}`}>James Benedict Pandio</h1>
        </div>
        <div className="hero-line">
          <div>
            <span className="ac">$</span> {type("cat role.txt", 1000)}
            {t >= 650 && t < 1550 && caret}
          </div>
          <div className={`role fade ${on(1550)}`}>Full Stack Developer &amp; AI Automation</div>
        </div>
        <div className="hero-line">
          <div>
            <span className="ac">$</span> {type("cat intro.txt", 1850)}
            {t >= 1550 && t < 2400 && caret}
          </div>
          <div className={`mu fade ${on(2400)}`}>I build apps and automate workflows. Based in Pampanga, PH.</div>
        </div>
        <div className="hero-line">
          <div>
            <span className="ac">$</span> {type("ls ./work", 2700)}
            {t >= 2400 && t < 3200 && caret}
          </div>
          <div className={`dirs fade ${on(3200)}`}>
            {PROJECTS.map((p, i) => (
              <a
                key={p.slug}
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenProject(i);
                }}
              >
                {p.slug}/
              </a>
            ))}
          </div>
        </div>
        <div className={`fade ${on(3500)}`} aria-hidden="true">
          <span className="ac">$</span> <span className="caret blink" />
        </div>
      </div>
      <div className="status-bar">
        <span className="avail">
          <span className="dot" />
          open to full-time &amp; freelance
        </span>
        <span suppressHydrationWarning>PHT {clock}</span>
        <button className="wide-only" onClick={onOpenPalette}>
          press {kbd} to navigate
        </button>
        <a href="#work" onClick={onNav} className="link-hover" style={{ marginLeft: "auto" }}>
          scroll ↓
        </a>
      </div>
    </section>
  );
}
