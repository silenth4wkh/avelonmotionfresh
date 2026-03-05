export interface MediaImage {
  src: string;
  alt: string;
}

export interface MediaVideo {
  src: string;
  poster: string;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  preload: 'none' | 'metadata' | 'auto';
}

export interface ServiceMedia {
  strategy: MediaImage;
  visualIdentity: MediaImage;
  digitalDesign: MediaImage;
}

export interface ProcessMedia {
  concept: MediaImage;
  aiGeneration: MediaImage;
  production: MediaImage;
  delivery: MediaImage;
}

export interface Logos {
  quantum: string | null;
  cubekit: string | null;
  ephemeral: string | null;
  warpspeed: string | null;
  magnolia: string | null;
  global: string | null;
}

export interface MediaStore {
  heroVideo: MediaVideo;
  heroImage: string;
  aboutImage: MediaImage;
  ctaImage: MediaImage;
  services: ServiceMedia;
  process: ProcessMedia;
  logos: Logos;
}
