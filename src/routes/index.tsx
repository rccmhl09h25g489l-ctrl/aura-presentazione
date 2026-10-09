import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Grid2X2, Maximize, Minimize, PanelLeftClose, PanelLeftOpen, Play, Printer, StickyNote, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScaledSlide } from "@/components/slides/ScaledSlide";
import { SlideContent, slides } from "@/components/slides/deck";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    slide: Math.min(slides.length, Math.max(1, Number(search.slide) || 1)),
    print: search.print !== undefined && search.print !== false && search.print !== "false",
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
