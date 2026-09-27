"use client";

import { useEffect, useRef } from "react";
import { PROJECTS } from "./data";
import { ImageSlot } from "./primitives";

const pad = (n: number) => String(n).padStart(2, "0");

export default function ProjectSheet({
  index,
  shown,
  onClose,
  onStep,
}: {
  index: number;
  shown: boolean;
  onClose: () => void;
  onStep: (d: 1 | -1) => void;
}) {
  const N = PROJECTS.length;
  const p = PROJECTS[index];
  const scroller = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus({ preventScroll: true });
    return () => prev?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = 0;
  }, [index]);

  return (
    <div className={`sheet-root ${shown ? "in" : ""}`} role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <div className="sheet-scrim" onClick={onClose} />
      <div className="sheet" ref={scroller} data-lenis-prevent>
        <div className="sheet-bar">
          <span>
            <span className="ac">$</span> open ./{p.slug}
          </span>
          <button ref={closeBtn} className="btn" onClick={onClose}>
            esc ×
          </button>
        </div>
        <div className="sheet-body">
          <div className="sheet-intro">
            <span className="count">
              {pad(index + 1)} / {pad(N)}
            </span>
            <h2 id="sheet-title">{p.title}</h2>
            <p>{p.desc}</p>
          </div>
          <dl className="sheet-meta">
            {p.meta.map((x) => (
              <div key={x.k}>
                <dt>{x.k}</dt>
                <dd>{x.v}</dd>
              </div>
            ))}
          </dl>
          <div className="frame sheet-shot">
            <ImageSlot src={p.image} alt={`${p.title} screenshot`} placeholder={p.placeholder} sizes="(max-width: 1100px) 100vw, 1020px" />
          </div>
          <div>
            {p.sections.map((s) => (
              <div key={s.h} className="sheet-section">
                <h3>
                  <span className="ac"># </span>
                  {s.h}
                </h3>
                <p>{s.b}</p>
              </div>
            ))}
          </div>
          <div className="sheet-nav">
            <button onClick={() => onStep(-1)}>← {PROJECTS[(index - 1 + N) % N].title}</button>
            <button onClick={() => onStep(1)}>{PROJECTS[(index + 1) % N].title} →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
