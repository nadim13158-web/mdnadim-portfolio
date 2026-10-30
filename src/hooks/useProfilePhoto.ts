import { useEffect, useState } from "react";
import { PHOTO_URL, RUNTIME_PHOTO_NAMES } from "../config/photo";

/**
 * Finds the profile photo once per page and shares it with every component.
 *  1. A photo built into the site (src/assets/profile/) wins.
 *  2. Otherwise looks for "photo.jpg / photo.png / photo …" next to index.html —
 *     so a photo can be added by simply dropping it into the dist folder.
 */
let resolved: string | null | undefined = PHOTO_URL ?? undefined; // undefined = still looking
let search: Promise<string | null> | null = null;

function canLoad(src: string) {
  return new Promise<boolean>((done) => {
    const img = new Image();
    img.onload = () => done(img.naturalWidth > 0);
    img.onerror = () => done(false);
    img.src = src;
  });
}

export function findProfilePhoto(): Promise<string | null> {
  if (resolved !== undefined) return Promise.resolve(resolved);
  if (!search) {
    search = (async () => {
      for (const name of RUNTIME_PHOTO_NAMES) {
        const src = new URL(name, document.baseURI).href;
        if (await canLoad(src)) return (resolved = src);
      }
      return (resolved = null);
    })();
  }
  return search;
}

// Start looking immediately (while the intro loader is still on screen).
if (typeof window !== "undefined") void findProfilePhoto();

export function useProfilePhoto(): string | null {
  const [url, setUrl] = useState<string | null>(resolved ?? null);

  useEffect(() => {
    let alive = true;
    void findProfilePhoto().then((u) => {
      if (alive) setUrl(u);
    });
    return () => {
      alive = false;
    };
  }, []);

  return url;
}
