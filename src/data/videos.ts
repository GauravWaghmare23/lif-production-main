/**
 * Video registry — data lives in videos.json.
 * Add a file once under "library" there, then reference it by key.
 */
import raw from '../content/videos.json';

const LIBRARY = raw.library as Record<string, string>;

/** Turn a library key (e.g. "nightDrive") into a URL. Full URLs / paths pass through. */
export const resolveVideo = (keyOrUrl: string): string =>
  LIBRARY[keyOrUrl] ?? keyOrUrl;

export const HERO_VIDEOS = {
  mainBg: resolveVideo(raw.hero.mainBg),
  fallbackBg: resolveVideo(raw.hero.fallbackBg),
  reelOverlay: resolveVideo(raw.hero.reelOverlay),
};

export const SHOWREEL_VIDEOS = {
  main: resolveVideo(raw.showreel.main),
  chapters: raw.showreel.chapters.map((c) => ({
    id: c.id,
    title: c.title,
    duration: c.duration,
    videoUrl: resolveVideo(c.video),
  })),
};

export const MOSAIC_VIDEOS = {
  hero: resolveVideo(raw.mosaic.hero),
  heroLocal: resolveVideo(raw.mosaic.heroLocal),
  tiles: raw.mosaic.tiles.map((t) => ({
    id: t.id,
    title: t.title,
    videoUrl: resolveVideo(t.video),
  })),
};

export const HORIZONTAL_CARDS_VIDEOS: string[] = raw.horizontalCards.map(resolveVideo);
export const FILMSTRIP_VIDEOS: string[] = raw.filmstrip.map(resolveVideo);

export const VIDEO_DATA = {
  hero: HERO_VIDEOS,
  showreel: SHOWREEL_VIDEOS,
  mosaic: MOSAIC_VIDEOS,
  horizontalCards: HORIZONTAL_CARDS_VIDEOS,
  filmstrip: FILMSTRIP_VIDEOS,
};

export default VIDEO_DATA;
