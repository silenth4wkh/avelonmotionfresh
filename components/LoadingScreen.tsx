'use client';

import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  duration?: number;
}

export default function LoadingScreen({ duration = 800 }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setVisible(false), 500);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9998] bg-[#0a0a0a] flex flex-col items-center justify-center gap-6 transition-opacity duration-500"
      style={{
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 bg-orange-500 rounded-full block"
            style={{
              animation: `bounce-dot 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
      <p className="text-white/40 text-xs tracking-widest uppercase m-0">
        Avelon Motion
      </p>
    </div>
  );
}
