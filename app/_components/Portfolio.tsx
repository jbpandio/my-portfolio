"use client";

import Lenis from "lenis";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import CommandPalette, { type Command } from "./CommandPalette";
import { EMAIL, GITHUB, LINKEDIN, PROJECTS, RESUME, SECTIONS, STACK, type SectionId } from "./data";
import Hero from "./Hero";
import Logo from "./Logo";
import { AvatarPlaceholder, Cursor, ImageSlot, Reveal, ScrollProgress, SectionHead } from "./primitives";
import ProjectSheet from "./ProjectSheet";

type Mode = "dark" | "light";
const nextFrame = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn));

export default function Portfolio() {
  const [mode, setMode] = useState<Mode>("dark");
  const [kbd, setKbd] = useState("Ctrl K");
  const [active, setActive] = useState<SectionId | "">("");
  const [menu, setMenu] = useState(false);
  const [menuIn, setMenuIn] = useState(false);
  const [pal, setPal] = useState(false);
  const [modal, setModal] = useState<number | null>(null);
  const [modalIn, setModalIn] = useState(false);
  const [copied, setCopied] = useState(false);
  const lenis = useRef<Lenis | null>(null);
  const timers = useRef<{ modal?: number; copy?: number }>({});

  // ── Setup: theme, platform, smooth scroll, active section ──
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- sync with values only known on the client */
    setMode(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    if (/Mac|iPhone|iPad/.test(navigator.platform || "")) setKbd("⌘K");
    /* eslint-enable react-hooks/set-state-in-effect */

    lenis.current = new Lenis({ lerp: 0.1, autoRaf: true });

    const so = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id as SectionId)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) so.observe(el);
    });

    const mq = window.matchMedia("(min-width: 760px)");
    const onWide = () => {
      if (!mq.matches) return;
      setMenu(false);
      setMenuIn(false);
    };
    mq.addEventListener("change", onWide);

    return () => {
      so.disconnect();
      mq.removeEventListener("change", onWide);
      lenis.current?.destroy();
      lenis.current = null;
    };
  }, []);

  // ── Lock page scroll while an overlay is open ──
  const locked = pal || modal !== null || menu;
  useEffect(() => {
    if (locked) lenis.current?.stop();
    else lenis.current?.start();
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }, [locked]);

  // ── Actions ──
  const closeMenu = () => {
    setMenu(false);
    setMenuIn(false);
  };

  const scrollToId = useCallback((id: string) => {
    const el = id === "#top" ? null : document.querySelector<HTMLElement>(id);
    if (id !== "#top" && !el) return;
    setMenu(false);
    setMenuIn(false);
    setPal(false);
    // Wait a tick so the scroll lock releases first. Both paths honour the
    // sections' scroll-margin-top, which clears the sticky header.
    setTimeout(() => {
      if (lenis.current) lenis.current.scrollTo(el ?? 0, { duration: 1.2 });
      else if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 40);
  }, []);

  const onNav = (e: MouseEvent<HTMLAnchorElement>) => {
    const id = e.currentTarget.getAttribute("href");
    if (!id || id[0] !== "#" || id === "#") return;
    e.preventDefault();
    scrollToId(id);
  };

  const toggleTheme = useCallback(() => {
    setMode((m) => {
      const next = m === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("jbp-theme", next);
      } catch {}
      return next;
    });
  }, []);

  const openProject = useCallback((i: number) => {
    clearTimeout(timers.current.modal);
    setPal(false);
    setMenu(false);
    setMenuIn(false);
    setModal(i);
    setModalIn(false);
    nextFrame(() => setModalIn(true));
  }, []);

  const closeModal = useCallback(() => {
    setModalIn(false);
    clearTimeout(timers.current.modal);
    timers.current.modal = window.setTimeout(() => setModal(null), 380);
  }, []);

  const stepProject = useCallback(
    (d: 1 | -1) => setModal((i) => (i === null ? i : (i + d + PROJECTS.length) % PROJECTS.length)),
    [],
  );

  const copyEmail = useCallback(() => {
    navigator.clipboard?.writeText(EMAIL).catch(() => {});
    setCopied(true);
    clearTimeout(timers.current.copy);
    timers.current.copy = window.setTimeout(() => setCopied(false), 1600);
  }, []);

  const openPal = () => {
    closeMenu();
    setPal(true);
  };

  const toggleMenu = () => {
    if (menu) return closeMenu();
    setMenu(true);
    setMenuIn(false);
    nextFrame(() => setMenuIn(true));
  };

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = /^(input|textarea|select)$/i.test(t.tagName) || t.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (pal) setPal(false);
        else {
          setMenu(false);
          setMenuIn(false);
          setPal(true);
        }
        return;
      }
      if (e.key === "Escape") {
        if (pal) setPal(false);
        else if (modal !== null) closeModal();
        else if (menu) {
          setMenu(false);
          setMenuIn(false);
        }
        return;
      }
      if (typing || e.metaKey || e.ctrlKey || e.altKey || pal) return;
      if (modal !== null) {
        if (e.key === "ArrowRight") stepProject(1);
        if (e.key === "ArrowLeft") stepProject(-1);
        return;
      }
      const sec = SECTIONS[Number(e.key) - 1];
      if (sec) scrollToId(`#${sec.id}`);
      else if (e.key === "t" || e.key === "T") toggleTheme();
      else if (e.key === "/") {
        e.preventDefault();
        setPal(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pal, modal, menu, closeModal, stepProject, scrollToId, toggleTheme]);

  const ext = (u: string) => () => window.open(u, "_blank", "noopener");
  const commands: Command[] = [
    ...SECTIONS.map((s, i) => ({
      label: `Go to ${s.label}`,
      hint: String(i + 1),
      kw: { work: "projects", stack: "skills tech tools", about: "experience bio", contact: "email hire" }[s.id],
      run: () => scrollToId(`#${s.id}`),
    })),
    { label: "Back to top", hint: "", kw: "home cd", run: () => scrollToId("#top") },
    ...PROJECTS.map((p, i) => ({ label: `Open ${p.title}`, hint: "case", kw: p.slug, run: () => openProject(i) })),
    { label: "Toggle theme", hint: "T", kw: "dark light mode", run: toggleTheme },
    { label: "Copy email", hint: "", kw: "mail contact", run: copyEmail },
    { label: "Send email", hint: "↗", kw: "mail contact", run: () => (window.location.href = `mailto:${EMAIL}`) },
    { label: "Open GitHub", hint: "↗", kw: "code repo", run: ext(GITHUB) },
    { label: "Open LinkedIn", hint: "↗", kw: "profile", run: ext(LINKEDIN) },
  ];

  return (
    <>
      <header className="header">
        <a href="#top" onClick={onNav} className="brand" aria-label="James Benedict Pandio, back to top">
          <Logo size={26} />
          <span>
            jbp@pampanga<span className="ac">:~$</span>
          </span>
        </a>
        <nav aria-label="Sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} onClick={onNav} aria-current={active === s.id ? "true" : undefined}>
              ./{s.label}
            </a>
          ))}
        </nav>
        <div className="controls">
          <button className="btn wide-only" onClick={openPal} aria-label="Open command palette">
            {kbd}
          </button>
          <button className="btn fg" onClick={toggleTheme} aria-label="Toggle theme">
            [{mode}]
          </button>
          <button className="btn solid menu-btn" onClick={toggleMenu} aria-label="Menu" aria-expanded={menu}>
            {menu ? "close" : "menu"}
          </button>
        </div>
        <ScrollProgress />
      </header>

      {menu && (
        <div className={`mobile-menu ${menuIn ? "in" : ""}`}>
          {SECTIONS.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={onNav}
              className="item"
              style={{ transitionDelay: `${60 + i * 50}ms` }}
            >
              <span>{s.n}</span>
              {s.label}
            </a>
          ))}
          <a href={`mailto:${EMAIL}`} className="mail">
            {EMAIL}
          </a>
        </div>
      )}

      <main>
        <Hero kbd={kbd} onOpenPalette={openPal} onOpenProject={openProject} onNav={onNav} />

        <section id="work" className="section">
          <SectionHead n="01" cmd="ls ./work" title="Selected work" />
          <div className="work-list">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.slug}>
                <div
                  className="project"
                  role="button"
                  tabIndex={0}
                  aria-label={`Open case study: ${p.title}`}
                  onClick={() => openProject(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openProject(i);
                    }
                  }}
                >
                  <div className="row">
                    <span className="n">{String(i + 1).padStart(2, "0")}</span>
                    <div className="copy">
                      <h3>{p.title}</h3>
                      <p>{p.desc}</p>
                    </div>
                    <span className="cta">
                      <span className="cta-label">view case</span>
                      <span className="arrow">→</span>
                    </span>
                  </div>
                  <div className="reveal">
                    <div>
                      <div className="preview">
                        <div className="frame">
                          <ImageSlot src={p.image} alt={`${p.title} screenshot`} placeholder={p.placeholder} sizes="900px" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="stack" className="section">
          <SectionHead n="02" cmd="cat stack.txt" title="Stack" />
          <div className="stack-grid">
            {STACK.map(([label, items], i) => (
              <Reveal key={label} className="stack-cell" delay={(i % 3) * 90}>
                <div className="label"># {label}</div>
                <ul>
                  {items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="about" className="section">
          <SectionHead n="03" cmd="cat about.md" title="About" />
          <div className="about-grid">
            <Reveal className="frame about-photo">
              <AvatarPlaceholder initials="JB" label="Placeholder portrait of James Benedict Pandio" />
            </Reveal>
            <div className="about-copy">
              <Reveal as="p">
                I&apos;m a junior full stack developer from Pampanga, Philippines. I work across the stack, from React and
                Next.js interfaces to Node APIs and Postgres databases.
              </Reveal>
              <Reveal as="p" className="mu">
                The other half of my work is automation: connecting tools and AI models so repetitive tasks run on their
                own. I use Claude Code, Codex and Ollama daily.
              </Reveal>
              <Reveal as="dl" className="facts">
                <dt>location</dt>
                <dd>Pampanga, PH (UTC+8)</dd>
                <dt>focus</dt>
                <dd>Full stack apps, AI automation</dd>
                <dt>status</dt>
                <dd className="ac">Open to full-time &amp; freelance</dd>
              </Reveal>
            </div>
          </div>
          <Reveal className="exp">
            <div className="mu" style={{ fontSize: 13 }}>
              $ cat experience.log
            </div>
            <div className="exp-grid">
              <div className="exp-when">
                <span className="ac">Jun 2026 — Present</span>
                <span className="mu">The Backroom Offshoring Inc.</span>
              </div>
              <div className="exp-body">
                <h3>Junior Web Developer</h3>
                <ul>
                  <li>
                    Built and deployed a full-stack AI chatbot powered by Anthropic&apos;s Claude API, equipping it with
                    specialized accounting skills covering bookkeeping, financial reporting, and tax compliance.
                  </li>
                  <li>
                    Architected the end-to-end integration — from frontend chat interface to LLM API pipeline — enabling
                    non-technical accounting staff to access automated, intelligent financial assistance in real time.
                  </li>
                  <li>
                    Accelerated accounting workflows by embedding AI-driven automation into core finance functions,
                    cutting down time spent on routine entries, report generation, and tax computation.
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="contact" className="section contact">
          <SectionHead n="04" cmd="mail james" title="Have a role or a project? Say hello." />
          <Reveal className="contact-actions">
            <a href={`mailto:${EMAIL}`} className="mail-btn">
              {EMAIL}
            </a>
            <button className="copy-btn" onClick={copyEmail} aria-live="polite">
              {copied ? "copied ✓" : "copy email"}
            </button>
          </Reveal>
          <footer className="footer">
            <a href={GITHUB} target="_blank" rel="noopener" className="link-hover">
              github ↗
            </a>
            <a href={LINKEDIN} target="_blank" rel="noopener" className="link-hover">
              linkedin ↗
            </a>
            <a href={RESUME} target="_blank" rel="noopener" className="link-hover">
              resume.pdf ↗
            </a>
            <span className="copyright">© 2026 James Benedict Pandio</span>
            <a href="#top" onClick={onNav} className="top">
              cd ~ <span>↑</span>
            </a>
          </footer>
        </section>
      </main>

      {modal !== null && <ProjectSheet index={modal} shown={modalIn} onClose={closeModal} onStep={stepProject} />}
      {pal && <CommandPalette commands={commands} onClose={() => setPal(false)} />}
      <Cursor />
    </>
  );
}
