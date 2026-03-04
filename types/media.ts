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

export interface WorkImages {
  card1: MediaImage;
  card2: MediaImage;
  card3: MediaImage;
  card4: MediaImage;
  card5: MediaImage;
  card6: MediaImage;
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
  workImages: WorkImages;
  logos: Logos;
}
