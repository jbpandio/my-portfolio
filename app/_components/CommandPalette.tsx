"use client";

import { useEffect, useRef, useState } from "react";

export type Command = { label: string; hint: string; kw: string; run: () => void };

export default function CommandPalette({ commands, onClose }: { commands: Command[]; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    input.current?.focus();
    return () => prev?.focus({ preventScroll: true });
  }, []);

  const query = q.trim().toLowerCase();
  const list = query ? commands.filter((c) => `${c.label} ${c.kw}`.toLowerCase().includes(query)) : commands;
  const s = Math.min(sel, Math.max(0, list.length - 1));

  const run = (c?: Command) => {
    if (!c) return;
    onClose();
    setTimeout(c.run, 30);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!list.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s + 1) % list.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s - 1 + list.length) % list.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(list[s]);
    }
  };

  return (
    <div className="pal-root" onClick={onClose}>
      <div className="pal" role="dialog" aria-modal="true" aria-label="Command palette" onClick={(e) => e.stopPropagation()}>
        <div className="pal-input">
          <span className="ac">›</span>
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={onKey}
            placeholder="Type a command…"
            role="combobox"
            aria-expanded="true"
            aria-controls="pal-list"
            aria-activedescendant={list.length ? `pal-${s}` : undefined}
          />
          <span className="kbd">esc</span>
        </div>
        <ul id="pal-list" role="listbox" className="pal-list" data-lenis-prevent>
          {list.map((c, i) => (
            <li
              key={c.label}
              id={`pal-${i}`}
              role="option"
              aria-selected={i === s}
              className="pal-item"
              onMouseEnter={() => setSel(i)}
              onClick={() => run(c)}
            >
              <span className="mark">{i === s ? "›" : ""}</span>
              <span className="label">{c.label}</span>
              <span className="hint">{c.hint}</span>
            </li>
          ))}
          {!list.length && <li className="pal-empty">command not found: {q}</li>}
        </ul>
        <div className="pal-foot">
          <span>↑↓ navigate</span>
          <span>↵ run</span>
          <span>1–4 sections · T theme</span>
        </div>
      </div>
    </div>
  );
}
