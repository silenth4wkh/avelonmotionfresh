'use client';

import Image from 'next/image';
import { useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  style?: React.CSSProperties;
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  quality = 75,
  sizes,
  style,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={className}
        role="img"
        aria-label={alt}
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #262626 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      >
        <span className="text-neutral-600 text-xs">{alt || 'Image'}</span>
      </div>
    );
  }

  const isExternal = src.startsWith('http://') || src.startsWith('https://');

  return (
    <div
      className="relative overflow-hidden"
      style={{ ...(fill ? { width: '100%', height: '100%' } : {}) }}
    >
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-700 animate-pulse"
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={!fill ? (width ?? 800) : undefined}
        height={!fill ? (height ?? 600) : undefined}
        fill={fill}
        className={className}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.4s ease',
          objectFit: 'cover',
          ...style,
        }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        priority={priority}
        quality={quality}
        sizes={sizes ?? (fill ? '100vw' : undefined)}
        unoptimized={isExternal}
      />
    </div>
  );
}
