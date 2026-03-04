'use client';

import { useEffect, useRef, useState } from 'react';

interface RevealTextProps {
  children: string;
  /** 'words' splits by word, 'lines' treats the whole string as one line */
  mode?: 'words' | 'lines';
  /** base delay in ms before first element starts */
  delay?: number;
  /** stagger between elements in ms */
  stagger?: number;
  /** duration of each element in ms */
  duration?: number;
  className?: string;
  /** Tailwind classes applied per-word span (e.g. font size, color) */
  wordClass?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

/**
 * Vertical.framer.media–style text reveal:
 * Each word slides up from overflow:hidden clip, staggered.
 * Triggered once by IntersectionObserver.
 */
export default function RevealText({
  children,
  mode = 'words',
  delay = 0,
  stagger = 55,
  duration = 700,
  className = '',
  wordClass = '',
  as: Tag = 'div',
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const units = mode === 'words'
    ? children.split(' ').filter(Boolean)
    : [children];

  return (
    // @ts-expect-error – polymorphic ref
    <Tag ref={ref} className={`${className}`} aria-label={children}>
      {units.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ marginRight: mode === 'words' ? '0.25em' : 0 }}
          aria-hidden
        >
          <span
            className={`inline-block ${wordClass}`}
            style={{
              transform: revealed ? 'translateY(0)' : 'translateY(110%)',
              opacity: revealed ? 1 : 0,
              transition: `transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay + i * stagger}ms, opacity ${duration * 0.6}ms ease ${delay + i * stagger}ms`,
              willChange: 'transform',
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
