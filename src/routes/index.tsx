import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Grid2X2, Minimize, PanelLeftClose, PanelLeftOpen, Play, Printer, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScaledSlide } from "@/components/slides/ScaledSlide";
import { SlideContent, slides } from "@/components/slides/deck";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    slide: Math.min(slides.length, Math.max(1, Math.floor(Number(search["slide"]) || 1))),
    print: search["print"] !== undefined && search["print"] !== false && search["print"] !== "false",
  }),
  head: () => ({ meta: [
    { title: "Aura Rank — Presentazione di Michele Recchia" },
    { name: "description", content: "Il progetto Aura Rank, dall’idea al codice: AI, database, test e dimostrazione. Presentazione di Michele Recchia, classe 3B." },
    { property: "og:title", content: "Aura Rank — Presentazione di Michele Recchia" },
    { property: "og:description", content: "Una classifica personalizzabile raccontata con schermate, diagrammi e spiegazioni semplici." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

/* ───────────── Sfondo: pioggia di codice binario ───────────── */
function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c = canvas;
    const g = ctx;

    const size = 16;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let drops: number[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      c.width = Math.floor(width * dpr);
      c.height = Math.floor(height * dpr);
      c.style.width = `${width}px`;
      c.style.height = `${height}px`;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.fillStyle = "#020806";
      g.fillRect(0, 0, width, height);
      drops = Array.from({ length: Math.ceil(width / size) }, () => Math.random() * -(height / size));
    }

    function step() {
      g.fillStyle = "rgba(2, 8, 6, 0.13)";
      g.fillRect(0, 0, width, height);
      g.font = `${size}px "JetBrains Mono", "Fira Code", ui-monospace, monospace`;
      g.textBaseline = "top";
      for (let i = 0; i < drops.length; i++) {
        const x = i * size;
        const y = (drops[i] ?? 0) * size;
        if (y >= 0) {
          g.fillStyle = "rgba(0, 255, 160, 0.75)";
          g.fillText(Math.random() > 0.5 ? "1" : "0", x, y - size);
          g.fillStyle = "#d9fff0";
          g.fillText(Math.random() > 0.5 ? "1" : "0", x, y);
        }
        if (y > height && Math.random() > 0.975) drops[i] = Math.random() * -20;
        else drops[i] = (drops[i] ?? 0) + 1;
      }
    }

    function loop(t: number) {
      raf = requestAnimationFrame(loop);
      if (t - last < 55) return;
      last = t;
      step();
    }

    resize();
    if (reduce) {
      for (let i = 0; i < 120; i++) step();
    } else {
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas ref={ref} className="matrix-rain" aria-hidden="true" />
      <div className="matrix-vignette" aria-hidden="true" />
    </>
  );
}

/* ───────────── Stile professionale (sovrascrive il tema precedente) ───────────── */
const AURA_STYLES = `
:root {
  --aura-bg: #020806;
  --aura-accent: #00ffa3;
  --aura-accent-soft: rgba(0, 255, 163, 0.16);
  --aura-border: rgba(0, 255, 163, 0.2);
  --aura-glass: rgba(3, 12, 10, 0.72);
  --aura-text: #d6f5ea;
  --aura-muted: #7fa89a;
}
body { background: var(--aura-bg); }

.matrix-rain {
  position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.5;
}
.matrix-vignette {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse at center, transparent 35%, rgba(2, 8, 6, 0.75) 100%),
    linear-gradient(180deg, rgba(2, 8, 6, 0.55) 0%, transparent 20%, transparent 80%, rgba(2, 8, 6, 0.7) 100%);
}

.deck-app {
  position: relative; z-index: 1;
  background: transparent !important;
  color: var(--aura-text);
}

/* Barra superiore */
.deck-toolbar {
  background: var(--aura-glass) !important;
  -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--aura-border) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  color: var(--aura-text);
}
.deck-brand { display: flex; align-items: center; gap: 0.6rem; letter-spacing: 0.18em; font-weight: 700; }
.deck-brand small { color: var(--aura-muted); letter-spacing: 0.2em; font-weight: 500; }
.aura-symbol {
  background: linear-gradient(135deg, #00ffa3, #00c2ff);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  font-weight: 800; text-shadow: 0 0 18px rgba(0, 255, 163, 0.45);
}
.toolbar-divider { width: 1px; height: 1.4rem; background: var(--aura-border); margin: 0 0.4rem; }

/* Pulsanti */
.deck-app button, .deck-app a[class*="inline-flex"], .present-controls button {
  color: var(--aura-text);
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease, color 0.2s ease;
}
.deck-app button:hover:not(:disabled), .present-controls button:hover:not(:disabled) {
  background: var(--aura-accent-soft) !important;
  color: #fff !important;
  box-shadow: 0 0 0 1px var(--aura-border), 0 0 18px rgba(0, 255, 163, 0.18);
}
.deck-app button[aria-pressed="true"] {
  background: var(--aura-accent-soft) !important; color: var(--aura-accent) !important;
}
.deck-app button:disabled { opacity: 0.3; }
.deck-toolbar .toolbar-actions > button:last-child {
  background: linear-gradient(135deg, #00ffa3, #00d4aa) !important;
  color: #02110c !important; font-weight: 700;
  box-shadow: 0 0 22px rgba(0, 255, 163, 0.35);
}
.deck-toolbar .toolbar-actions > button:last-child:hover:not(:disabled) {
  transform: translateY(-1px); box-shadow: 0 0 30px rgba(0, 255, 163, 0.55) !important; color: #02110c !important;
}
.deck-toolbar a { border: 1px solid var(--aura-border) !important; background: transparent !important; }
.deck-toolbar a:hover { background: var(--aura-accent-soft) !important; color: #fff !important; }

/* Barra laterale con anteprime */
.deck-sidebar {
  background: var(--aura-glass) !important;
  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
  border-right: 1px solid var(--aura-border) !important;
  color: var(--aura-text);
}
.sidebar-heading { display: flex; justify-content: space-between; color: var(--aura-muted); letter-spacing: 0.22em; font-size: 0.7rem; }
.thumbnail-item {
  border-radius: 10px !important; border: 1px solid transparent !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}
.thumbnail-item:hover { transform: translateX(3px); }
.thumbnail-item[aria-current="true"] {
  border-color: var(--aura-accent) !important;
  box-shadow: 0 0 0 1px var(--aura-accent), 0 0 24px rgba(0, 255, 163, 0.25);
  background: var(--aura-accent-soft) !important;
}
.thumbnail-frame { border-radius: 6px; overflow: hidden; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5); }
.thumbnail-label { color: var(--aura-muted); font-size: 0.72rem; letter-spacing: 0.04em; }
.thumbnail-item[aria-current="true"] .thumbnail-label { color: var(--aura-accent); }

/* Area principale */
.canvas-meta { color: var(--aura-muted); letter-spacing: 0.24em; font-size: 0.72rem; }
.slide-stage {
  border-radius: 14px; overflow: hidden;
  border: 1px solid var(--aura-border);
  box-shadow: 0 0 0 1px rgba(0, 255, 163, 0.06), 0 30px 80px rgba(0, 0, 0, 0.65), 0 0 60px rgba(0, 255, 163, 0.08);
}
.overview .thumbnail-item { background: var(--aura-glass) !important; }

/* Note */
.notes-panel {
  background: var(--aura-glass) !important;
  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
  border: 1px solid var(--aura-border) !important; border-radius: 12px;
  color: var(--aura-text);
}
.notes-panel h3 { color: var(--aura-accent); letter-spacing: 0.2em; font-size: 0.72rem; }

/* Barra inferiore */
.deck-bottom {
  background: var(--aura-glass) !important;
  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
  border-top: 1px solid var(--aura-border) !important;
  color: var(--aura-text);
}
.deck-bottom-label { color: var(--aura-muted); letter-spacing: 0.22em; font-size: 0.7rem; }
.progress-segment { background: rgba(255, 255, 255, 0.12) !important; border-radius: 99px; transition: background 0.3s ease, box-shadow 0.3s ease; }
.progress-segment.active { background: var(--aura-accent) !important; box-shadow: 0 0 10px rgba(0, 255, 163, 0.6); }
.deck-count { font-variant-numeric: tabular-nums; font-weight: 700; color: var(--aura-text); }
.deck-count span { color: var(--aura-muted); font-weight: 500; }

/* Modalità presentazione */
.present-mode { background: rgba(2, 8, 6, 0.78) !important; -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px); }
.present-controls {
  background: var(--aura-glass) !important; border: 1px solid var(--aura-border); border-radius: 999px;
  -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px); color: var(--aura-text);
}

/* Scrollbar discreta */
.deck-sidebar::-webkit-scrollbar, .overview::-webkit-scrollbar { width: 8px; }
.deck-sidebar::-webkit-scrollbar-thumb, .overview::-webkit-scrollbar-thumb { background: var(--aura-border); border-radius: 8px; }

@media print { .matrix-rain, .matrix-vignette { display: none !important; } }
`;

function Index() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const index = Math.floor(search.slide) - 1;
  const current = slides[index] ?? slides[0];
  const [sidebar, setSidebar] = useState(true);
  const [overview, setOverview] = useState(false);
  const [notes, setNotes] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const [idle, setIdle] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const thumbnails = useRef<HTMLDivElement>(null);

  function go(next: number) {
    const clamped = Math.max(0, Math.min(slides.length - 1, next));
    void navigate({ search: { slide: clamped + 1, print: false }, replace: true });
  }
  async function present() {
    setPresenting(true);
    setOverview(false);
    setElapsed(0);
    try { await document.documentElement.requestFullscreen(); } catch { /* Full-viewport mode remains available if fullscreen is blocked. */ }
  }
  async function stopPresenting() {
    setPresenting(false);
    setIdle(false);
    if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
  }
  function activity() {
    setIdle(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setIdle(true), 2500);
  }
  function startTouch(event: TouchEvent) {
    const touch = event.touches[0];
    if (touch) touchStart.current = { x: touch.clientX, y: touch.clientY };
  }
  function endTouch(event: TouchEvent) {
    const touch = event.changedTouches[0];
    const start = touchStart.current;
    if (!touch || !start) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) go(index + (dx < 0 ? 1 : -1));
    touchStart.current = null;
  }
  useEffect(() => {
    document.title = `${index + 1}/${slides.length} — ${current?.title ?? "Aura Rank"}`;
    thumbnails.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: "nearest" });
  }, [index, current]);
  useEffect(() => {
    function keyboard(event: KeyboardEvent) {
      if (event.target instanceof HTMLElement && /INPUT|TEXTAREA/.test(event.target.tagName)) return;
      if (["ArrowRight", "ArrowDown", " "].includes(event.key)) { event.preventDefault(); go(index + 1); }
      if (["ArrowLeft", "ArrowUp"].includes(event.key)) { event.preventDefault(); go(index - 1); }
      if (event.key === "Home") go(0);
      if (event.key === "End") go(slides.length - 1);
      if (event.key === "Escape") { void stopPresenting(); setOverview(false); }
      if (event.key === "F5") { event.preventDefault(); void present(); }
      if (event.key.toLowerCase() === "g" && !presenting) setOverview(v => !v);
    }
    document.addEventListener("keydown", keyboard);
    return () => document.removeEventListener("keydown", keyboard);
  }, [index, presenting, navigate]);
  useEffect(() => {
    const change = () => { if (!document.fullscreenElement) { setPresenting(false); setIdle(false); } };
    document.addEventListener("fullscreenchange", change);
    return () => { document.removeEventListener("fullscreenchange", change); if (timer.current) clearTimeout(timer.current); };
  }, []);
  useEffect(() => {
    if (!presenting) return;
    activity();
    const tick = setInterval(() => setElapsed(v => v + 1), 1000);
    return () => clearInterval(tick);
  }, [presenting]);

  const count = <span className="deck-count">{String(index + 1).padStart(2, "0")} <span>/ {slides.length}</span></span>;
  function thumbnail(i: number) {
    const slide = slides[i];
    if (!slide) return null;
    return <Button variant="ghost" className="thumbnail-item" key={i} aria-current={index === i ? "true" : "false"} aria-label={`Vai alla slide ${i + 1}: ${slide.title}`} onClick={() => { go(i); setOverview(false); }}><ScaledSlide className="thumbnail-frame"><SlideContent index={i} /></ScaledSlide><span className="thumbnail-label"><span>{String(i + 1).padStart(2, "0")}</span><span>{slide.title}</span></span></Button>;
  }
  if (search.print) return <main className="print-deck">{slides.map((_, i) => <SlideContent index={i} key={i} />)}</main>;
  return <>
    <style>{AURA_STYLES}</style>
    <MatrixRain />
    <main className="deck-app">
      <header className="deck-toolbar"><div className="deck-brand"><span className="aura-symbol">A✦</span><span>AURA RANK</span><small>PRESENTAZIONE / 2026</small></div><div className="toolbar-actions">
        <Button variant="ghost" size="icon" onClick={() => setOverview(v => !v)} title="Tutte le slide" aria-label="Tutte le slide" aria-pressed={overview}><Grid2X2 /></Button>
        <Button variant="ghost" size="icon" onClick={() => setNotes(v => !v)} title="Note per l’esposizione" aria-label="Note per l’esposizione" aria-pressed={notes}><StickyNote /></Button>
        <Button variant="ghost" size="icon" onClick={() => window.open("/?print=true", "_blank")} title="Versione per PDF e stampa" aria-label="Versione per PDF e stampa"><Printer /></Button>
        <span className="toolbar-divider" />
        <Button variant="outline" asChild><a href="https://aura-leaderbord.vercel.app/" target="_blank" rel="noreferrer"><ExternalLink /><span className="toolbar-label">Progetto</span></a></Button>
        <Button onClick={() => void present()}><Play /><span className="toolbar-label">Presenta</span></Button>
      </div></header>
      <div className="deck-workspace">
        {sidebar && <aside className="deck-sidebar" ref={thumbnails}><div className="sidebar-heading"><span>LE SLIDE</span><span>{slides.length}</span></div>{slides.map((_, i) => thumbnail(i))}</aside>}
        <section className="main-area">
          <div className="canvas-meta"><span>{overview ? "PANORAMICA" : current?.section.toUpperCase()}</span><span>MICHELE RECCHIA · 3B</span></div>
          {overview ? <div className="overview">{slides.map((_, i) => thumbnail(i))}</div> : <div className="canvas-outer" onTouchStart={startTouch} onTouchEnd={endTouch}><ScaledSlide className="slide-stage"><SlideContent index={index} /></ScaledSlide></div>}
          {notes && <section className="notes-panel"><h3>NOTE PER L’ESPOSIZIONE / {String(index + 1).padStart(2, "0")}</h3><p>{current?.notes}</p></section>}
          <footer className="deck-bottom"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" onClick={() => setSidebar(v => !v)} aria-label={sidebar ? "Nascondi elenco slide" : "Mostra elenco slide"} title={sidebar ? "Nascondi elenco slide" : "Mostra elenco slide"}>{sidebar ? <PanelLeftClose /> : <PanelLeftOpen />}</Button><span className="deck-bottom-label">IDEA → CODICE → PROGETTO</span></div><div className="deck-progress">{slides.map((_, i) => <span key={i} className={`progress-segment ${i <= index ? "active" : ""}`} />)}</div><nav className="deck-nav" aria-label="Navigazione slide"><Button variant="ghost" size="icon" disabled={index === 0} onClick={() => go(index - 1)} aria-label="Slide precedente" title="Slide precedente"><ArrowLeft /></Button>{count}<Button variant="ghost" size="icon" disabled={index === slides.length - 1} onClick={() => go(index + 1)} aria-label="Slide successiva" title="Slide successiva"><ArrowRight /></Button></nav></footer>
        </section>
      </div>
    </main>
    {presenting && <section className={`present-mode ${idle ? "idle" : ""}`} onMouseMove={activity} onTouchStart={startTouch} onTouchEnd={endTouch}><ScaledSlide className="slide-stage"><SlideContent index={index} /></ScaledSlide><div className="present-controls"><Button variant="ghost" size="icon" disabled={index === 0} aria-label="Slide precedente" onClick={() => go(index - 1)}><ArrowLeft /></Button>{count}<Button variant="ghost" size="icon" disabled={index === slides.length - 1} aria-label="Slide successiva" onClick={() => go(index + 1)}><ArrowRight /></Button><span className="deck-count">{String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}</span><Button variant="ghost" size="icon" aria-label="Esci dalla presentazione" title="Esci dalla presentazione" onClick={() => void stopPresenting()}><Minimize /></Button></div></section>}
    <div className="print-deck hidden">{slides.map((_, i) => <SlideContent index={i} key={i} />)}</div>
  </>;
}
