/**
 * Video helper utilities for YouTube Shorts, Videos and direct MP4/M4V video links.
 */

export function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/|watch\?.+&v=))([\w-]{11})/i,
  );
  return match ? match[1] : null;
}

export function isYouTubeUrl(url: string | null | undefined): boolean {
  return extractYouTubeId(url) !== null;
}

export function getYouTubeThumbnail(url: string | null | undefined): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function getYouTubeEmbedUrl(
  url: string | null | undefined,
  options: {
    autoplay?: boolean;
    mute?: boolean;
    loop?: boolean;
    controls?: boolean;
  } = {},
): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  const {
    autoplay = true,
    mute = true,
    loop = true,
    controls = false,
  } = options;
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: mute ? "1" : "0",
    loop: loop ? "1" : "0",
    playlist: id,
    controls: controls ? "1" : "0",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
