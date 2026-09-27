"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Flips to true once the element scrolls into view, then stops observing. */
export function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

export function Reveal({
  as: Tag = "div",
  className = "",
  delay,
  children,
}: {
  as?: "div" | "p" | "dl";
  className?: string;
  delay?: number;
  children: ReactNode;
}) {
  const [ref, seen] = useInView<HTMLElement>();
  const style: CSSProperties | undefined = delay ? { transitionDelay: `${delay}ms` } : undefined;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`rv ${seen ? "in" : ""} ${className}`} style={style}>
      {children}
    </Tag>
  );
}

const GLYPHS = "!<>-_/[]{}=+*^?#01abcdef";

/** Text that decodes left-to-right from random glyphs once `start` is true. */
export function Scramble({ text, start }: { text: string; start: boolean }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!start || prefersReducedMotion()) return;
    const t0 = performance.now() + 150;
    let raf = 0;
    const tick = (now: number) => {
      const p = (now - t0) / 800;
      if (p >= 1) return setOut(text);
      setOut(
        p < 0
          ? text.replace(/\S/g, "_")
          : text
              .split("")
              .map((ch, i) => (ch === " " || i / text.length < p ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
              .join(""),
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, text]);
  return <span aria-hidden="true">{out}</span>;
}

export function SectionHead({
  n,
  cmd,
  title,
  className = "",
}: {
  n?: string;
  cmd: string;
  title: string;
  className?: string;
}) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`section-head rv ${seen ? "in" : ""} ${className}`}>
      <div className="cmd">
        {n && <span className="ac">{n}</span>}
        {n && "  "}$ {cmd}
      </div>
      <h2 aria-label={title}>
        <Scramble text={title} start={seen} />
      </h2>
    </div>
  );
}

/** Image frame: shows the screenshot when `src` is set, otherwise a labelled placeholder. */
export function ImageSlot({ src, alt, placeholder, sizes }: { src?: string; alt: string; placeholder: string; sizes: string }) {
  return (
    <div className="slot">
      {src ? <Image src={src} alt={alt} fill sizes={sizes} /> : <span>{placeholder}</span>}
    </div>
  );
}

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    window.addEventListener("scroll", f, { passive: true });
    window.addEventListener("resize", f);
    f();
    return () => {
      window.removeEventListener("scroll", f);
      window.removeEventListener("resize", f);
    };
  }, []);
  return <div ref={ref} className="progress" />;
}

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current!;
    const root = document.documentElement;
    root.classList.add("cc");
    let x = -100, y = -100, tx = -100, ty = -100, hot = false, raf = 0;
    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const h = !!(e.target as Element).closest?.('a,button,input,[role="button"]');
      if (h !== hot) el.classList.toggle("hot", (hot = h));
    };
    const out = () => (tx = ty = -100);
    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", out);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", out);
      root.classList.remove("cc");
    };
  }, []);
  return <div ref={ref} className="cursor" aria-hidden="true" />;
}
