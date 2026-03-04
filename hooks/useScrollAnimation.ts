'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useScrollAnimation = (
  options: ScrollAnimationOptions = {}
): Set<string> => {
  const { threshold = 0.05, rootMargin = '0px 0px -50px 0px' } = options;
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = useCallback(() => {
    if (typeof window === 'undefined') return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        setVisibleSections((prev) => {
          const next = new Set(prev);
          let changed = false;
          entries.forEach((entry) => {
            const id = (entry.target as HTMLElement).id;
            if (id && entry.isIntersecting && !next.has(id)) {
              next.add(id);
              changed = true;
            }
          });
          return changed ? next : prev;
        });
      },
      { threshold, rootMargin }
    );

    const sections = document.querySelectorAll<HTMLElement>('[data-section]');
    sections.forEach((el) => {
      if (el.id) observerRef.current?.observe(el);
    });
  }, [threshold, rootMargin]);

  useEffect(() => {
    observe();

    // Re-observe after loading (2s) - layout stabilizes, catches below-fold sections
    const t1 = setTimeout(observe, 2000);

    // Fallback: after 500ms, show any section still missing (robust against observer misses)
    const t2 = setTimeout(() => {
      setVisibleSections((prev) => {
        const sections = document.querySelectorAll<HTMLElement>('[data-section]');
        let changed = false;
        const next = new Set(prev);
        sections.forEach((el) => {
          if (el.id && !next.has(el.id)) {
            next.add(el.id);
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      observerRef.current?.disconnect();
    };
  }, [observe]);

  return visibleSections;
};
