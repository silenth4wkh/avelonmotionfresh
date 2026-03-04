const ALLOWED_HOSTS = new Set([
  'res.cloudinary.com',
  'images.unsplash.com',
  'i.vimeocdn.com',
  'i.ytimg.com',
  'cdn.avelonmotion.com',
]);

const ALLOWED_VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.ogg', '.mov']);
const ALLOWED_IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);

export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isAllowedMediaHost = (url: string): boolean => {
  if (!isValidUrl(url)) return false;
  try {
    const { hostname } = new URL(url);
    return ALLOWED_HOSTS.has(hostname);
  } catch {
    return false;
  }
};

const hasExtension = (url: string, extensions: Set<string>): boolean => {
  try {
    const { pathname } = new URL(url);
    const ext = pathname.substring(pathname.lastIndexOf('.')).toLowerCase();
    return extensions.has(ext);
  } catch {
    return false;
  }
};

export const isValidVideoUrl = (url: string): boolean =>
  isValidUrl(url) && hasExtension(url, ALLOWED_VIDEO_EXTENSIONS);

export const isValidImageUrl = (url: string): boolean =>
  isValidUrl(url) && hasExtension(url, ALLOWED_IMAGE_EXTENSIONS);

export const sanitizeMediaUrl = (
  url: string,
  fallback = '/media/placeholder.jpg'
): string => {
  if (!url || !isValidUrl(url)) return fallback;
  return url;
};
