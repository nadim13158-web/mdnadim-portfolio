import { useEffect, useRef, useState } from "react";
import { computeFrame, type FrameName } from "../config/photo";
import { useProfilePhoto } from "../hooks/useProfilePhoto";
import { personal } from "../data/portfolioData";

/** Tiny overscan so sub-pixel rounding never leaves a hairline gap at the frame edge. */
const OVERSCAN = 1.006;

/**
 * The profile photo, cropped around the face into a passport (7:9) or
 * portrait (4:5) frame — see src/config/photo.ts.
 *
 * Kept deliberately "still" so it never looks soft or pixelated:
 * no scale / zoom / 3D transforms are ever applied to the photo itself.
 * Renders nothing until a photo is found.
 */
export default function ProfilePhoto({
  crop = "passport",
  className = "",
  priority = false,
}: {
  crop?: FrameName;
  className?: string;
  priority?: boolean;
}) {
  const src = useProfilePhoto();
  const imgRef = useRef<HTMLImageElement>(null);
  const [ratio, setRatio] = useState<number | null>(null);

  // The photo may already be decoded (inlined, or cached by the finder) before onLoad is attached
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth) setRatio(img.naturalWidth / img.naturalHeight);
  }, [src]);

  if (!src) return null;

  const f = computeFrame(crop, ratio ?? 712 / 809);
  const imgW = (OVERSCAN * 100) / f.width; // % of the frame's width
  const imgH = (OVERSCAN * 100) / f.height; // % of the frame's height
  const left = 50 - (f.left + f.width / 2) * imgW;
  const top = 50 - (f.top + f.height / 2) * imgH;

  return (
    <div
      className={`relative overflow-hidden bg-[#15151d] ${className}`}
      style={{ aspectRatio: `${f.aspect}` }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={`${personal.name} — ${personal.role}`}
        draggable={false}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={(e) => {
          const i = e.currentTarget;
          if (i.naturalWidth) setRatio(i.naturalWidth / i.naturalHeight);
        }}
        className="absolute block h-auto max-w-none select-none transition-opacity duration-700 ease-out"
        style={{
          width: `${imgW}%`,
          left: `${left}%`,
          top: `${top}%`,
          opacity: ratio ? 1 : 0,
        }}
      />
    </div>
  );
}
