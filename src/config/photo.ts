/* ============================================================
   PROFILE PHOTO (apnar chobi)
   ------------------------------------------------------------
   SOBCHEYE SOHOJ UPAY (kono coding / VS Code / terminal lagbe na):
     1. "dist" folder khulun — bhitore shudhu index.html ache
     2. Oi folder e apnar chobi rakhun, naam din:  photo
     3. Puro "dist" folder ta Netlify te tene din. Bas!
   Site chalu holei nije thekei chobi ta khuje nebe.

   ONNO UPAY (build er somoy chobi index.html er bhitore dhukiye dite):
     src/assets/profile/ folder e chobi rakhun -> npm run build

   Chat e je 3ta suit pora chobi pathiyechen
   (652×800, 712×809, 748×1402) — tintar jonnoi mukh er jayga
   set kora. Code chobir maap dekhe nije chine PASSPORT SIZE
   (35 × 45 mm) e crop korbe.

   Kono chobi na thakle site ager moto "NK" design dekhabe.
   ============================================================ */

const inProfile = import.meta.glob<string>(
  "/src/assets/profile/*.{jpg,jpeg,jfif,png,webp,avif,JPG,JPEG,JFIF,PNG,WEBP,AVIF}",
  { eager: true, import: "default" }
);
const inAssets = import.meta.glob<string>(
  "/src/assets/*.{jpg,jpeg,jfif,png,webp,avif,JPG,JPEG,JFIF,PNG,WEBP,AVIF}",
  { eager: true, import: "default" }
);
const inProjectRoot = import.meta.glob<string>(
  "/*.{jpg,jpeg,jfif,png,webp,avif,JPG,JPEG,JFIF,PNG,WEBP,AVIF}",
  { eager: true, import: "default" }
);

/** First photo found: profile folder → assets folder → project root. null if none. */
export const PHOTO_URL: string | null =
  Object.values(inProfile)[0] ??
  Object.values(inAssets)[0] ??
  Object.values(inProjectRoot)[0] ??
  null;

/**
 * Names tried (in order) next to index.html when no photo was built in.
 * Covers Windows with file extensions hidden or shown, and "photo.jpg.jpg" mistakes.
 */
export const RUNTIME_PHOTO_NAMES = [
  "photo.jpg",
  "photo.jpeg",
  "photo.png",
  "photo.webp",
  "photo",
  "photo.jpg.jpg",
  "photo.jpeg.jpeg",
  "photo.png.png",
  "photo.jpg.png",
  "photo.png.jpg",
  "photo.JPG",
  "photo.JPEG",
  "photo.PNG",
  "Photo.jpg",
  "Photo.jpeg",
  "Photo.png",
  "PHOTO.JPG",
];

/** Where the face sits in a photo, as fractions of its width / height. */
export interface Face {
  /** centre of the face, left → right (0 = left edge, 1 = right edge) */
  x: number;
  /** top of the hair (0 = top edge, 1 = bottom edge) */
  top: number;
  /** bottom of the chin */
  chin: number;
}

/** Your three suit photos — the right one is picked automatically from the photo's shape. */
const KNOWN_PHOTOS: { size: [number, number]; face: Face }[] = [
  // head & shoulders, 652 × 800 — the latest one you sent
  { size: [652, 800], face: { x: 0.476, top: 0.119, chin: 0.516 } },
  // head & shoulders, 712 × 809 (also 563 × 640 — a resized copy of the same photo)
  { size: [712, 809], face: { x: 0.472, top: 0.177, chin: 0.548 } },
  { size: [563, 640], face: { x: 0.472, top: 0.177, chin: 0.548 } },
  // full length, 748 × 1402 — the first one
  { size: [748, 1402], face: { x: 0.477, top: 0.212, chin: 0.427 } },
];

/* ------------------------------------------------------------
   SOMPORNO ONNO CHOBI dile ekhane mukh er jayga din:

     export const FACE_OVERRIDE = { x: 0.5, top: 0.15, chin: 0.5 } as Face | null;

   Paint e chobi khule mouse rakhle niche pixel dekhay:
     x    = mukh er majhkhan (px) ÷ chobir width
     top  = chul er sobcheye upor (px) ÷ chobir height
     chin = chibuk (px) ÷ chobir height
   ------------------------------------------------------------ */
export const FACE_OVERRIDE = null as Face | null;

/** Fallback for any other photo: a typical head-and-shoulders portrait. */
const DEFAULT_FACE: Face = { x: 0.5, top: 0.14, chin: 0.46 };

/** How each frame is composed around the face. */
export const FRAMES = {
  // Passport 35 × 45 mm: head = 56% of the height, a little space above the hair
  passport: { aspect: 7 / 9, head: 0.56, above: 0.09 },
  // About section: head-to-chest portrait
  portrait: { aspect: 4 / 5, head: 0.36, above: 0.12 },
} as const;

export type FrameName = keyof typeof FRAMES;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function faceFor(ratio: number): Face {
  if (FACE_OVERRIDE) return FACE_OVERRIDE;
  let best = DEFAULT_FACE;
  let bestDiff = 0.025; // shapes must match closely (a resized copy of the same photo still matches)
  for (const p of KNOWN_PHOTOS) {
    const d = Math.abs(p.size[0] / p.size[1] - ratio);
    if (d < bestDiff) {
      bestDiff = d;
      best = p.face;
    }
  }
  return best;
}

/**
 * The crop rectangle (as fractions of the photo) for a frame, given the photo's
 * natural width ÷ height. Always stays inside the photo — never stretches it.
 */
export function computeFrame(name: FrameName, ratio: number) {
  const { aspect, head, above } = FRAMES[name];
  const face = faceFor(ratio);

  let height = (face.chin - face.top) / head;
  let width = (height * aspect) / ratio;
  if (height > 1) {
    width /= height;
    height = 1;
  }
  if (width > 1) {
    height /= width;
    width = 1;
  }

  return {
    aspect,
    width,
    height,
    left: clamp(face.x - width / 2, 0, 1 - width),
    top: clamp(face.top - above * height, 0, 1 - height),
  };
}
