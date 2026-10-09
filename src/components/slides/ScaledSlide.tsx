import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export function ScaledSlide({ children, className = "" }: { children: ReactNode; className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setScale(Math.min(entry.contentRect.width / 1920, entry.contentRect.height / 1080));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={container} className={className}><div className="scaled-slide" style={{ "--scale": scale } as CSSProperties}>{children}</div></div>;
}