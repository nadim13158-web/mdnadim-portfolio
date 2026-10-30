import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { tracks, type Track } from "../data/music";

/* ---------------- Minimal YouTube IFrame API typings ---------------- */
interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(id: string): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(v: number): void;
  mute(): void;
  unMute(): void;
  destroy(): void;
  getIframe(): HTMLIFrameElement;
}
interface YTNamespace {
  Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer;
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytPromise: Promise<void> | null = null;
function loadYT(): Promise<void> {
  if (ytPromise) return ytPromise;
  ytPromise = new Promise<void>((resolve, reject) => {
    if (window.YT && window.YT.Player) return resolve();
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    s.onerror = () => {
      ytPromise = null;
      reject(new Error("YouTube API failed to load"));
    };
    document.head.appendChild(s);
  });
  return ytPromise;
}

/* ============================================================
   PERFORMANCE FIX
   ------------------------------------------------------------
   Age "time" state ta context e chilo. Prottek 500ms e seta
   change hole SITE ER SOB component re-render hoto — jetar
   sathe 3D galaxy canvas o re-render hoto. Ei jonno mobile e
   onek lagi legi hoto.

   Ekhon progress ta ekta light-weight pub/sub diye distribute
   kora hoy. Sudhu je component time dekhay (Music + MiniPlayer)
   tara re-render hoy. Hero / galaxy ar kono kichu hoy na.
   ============================================================ */

type Listener = (p: { time: number; duration: number; playing: boolean }) => void;
const listeners = new Set<Listener>();
const emit = (p: { time: number; duration: number; playing: boolean }) =>
  listeners.forEach((l) => l(p));

interface MusicCtx {
  hostRef: RefObject<HTMLDivElement | null>;
  index: number;
  track: Track;
  playing: boolean;
  ready: boolean;
  error: boolean;
  volume: number;
  muted: boolean;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  playIndex: (i: number) => void;
  seek: (fraction: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
}

const Ctx = createContext<MusicCtx | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const indexRef = useRef(0);
  const pendingPlay = useRef(false);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [volume, setVol] = useState(80);
  const [muted, setMuted] = useState(false);

  /* ---- progress poller: only touches the pub/sub, never React state ---- */
  useEffect(() => {
    let last = -1;
    const id = setInterval(() => {
      const p = playerRef.current;
      if (!p || !p.getPlayerState) return;
      if (p.getPlayerState() !== 1) return; // only poll while actually playing
      const t = p.getCurrentTime() || 0;
      const d = p.getDuration() || 0;
      // only emit when the second actually changed
      if (Math.floor(t) === last) return;
      last = Math.floor(t);
      emit({ time: t, duration: d, playing: true });
    }, 500);
    return () => clearInterval(id);
  }, []);

  const playIndex = useCallback((i: number) => {
    const n = (i + tracks.length) % tracks.length;
    indexRef.current = n;
    setIndex(n);
    setError(false);
    emit({ time: 0, duration: 0, playing: true });
    const p = playerRef.current;
    if (p) {
      p.loadVideoById(tracks[n].id);
      setPlaying(true);
    } else {
      pendingPlay.current = true;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let host: HTMLDivElement | null = null;

    loadYT()
      .then(() => {
        if (cancelled || !hostRef.current || !window.YT) return;
        host = document.createElement("div");
        host.style.width = "100%";
        host.style.height = "100%";
        hostRef.current.appendChild(host);

        const isMobile =
          typeof window !== "undefined" &&
          window.matchMedia("(pointer: coarse)").matches;

        playerRef.current = new window.YT.Player(host, {
          videoId: tracks[indexRef.current].id,
          width: "100%",
          height: "100%",
          playerVars: {
            playsinline: 1, // iOS: play inside the page, not fullscreen
            rel: 0,
            modestbranding: 1,
            controls: isMobile ? 1 : 0, // mobile: let YouTube's own controls help
            disablekb: 1,
            iv_load_policy: 3,
            fs: 0,
          },
          events: {
            onReady: (e: { target: YTPlayer }) => {
              e.target.setVolume(80);
              setReady(true);
              if (pendingPlay.current) {
                pendingPlay.current = false;
                e.target.loadVideoById(tracks[indexRef.current].id);
                setPlaying(true);
              }
            },
            onStateChange: (e: { data: number; target: YTPlayer }) => {
              const d = e.target.getDuration() || 0;
              if (e.data === 1) {
                setPlaying(true);
                emit({ time: e.target.getCurrentTime() || 0, duration: d, playing: true });
              } else if (e.data === 2) {
                setPlaying(false);
                emit({ time: e.target.getCurrentTime() || 0, duration: d, playing: false });
              } else if (e.data === 0) {
                playIndex(indexRef.current + 1);
              }
            },
            onError: () => {
              setError(true);
              setPlaying(false);
            },
          },
        });
      })
      .catch(() => setError(true));

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
      host?.remove();
    };
  }, [playIndex]);

  const toggle = useCallback(() => {
    const p = playerRef.current;
    if (!p) {
      pendingPlay.current = true;
      return;
    }
    const st = p.getPlayerState();
    if (st === 1 || st === 3) {
      p.pauseVideo();
      setPlaying(false);
    } else {
      p.playVideo();
      setPlaying(true);
    }
  }, []);

  const next = useCallback(() => playIndex(indexRef.current + 1), [playIndex]);
  const prev = useCallback(() => playIndex(indexRef.current - 1), [playIndex]);

  const seek = useCallback((fraction: number) => {
    const p = playerRef.current;
    if (!p) return;
    const d = p.getDuration() || 0;
    if (!d) return;
    const t = Math.max(0, Math.min(1, fraction)) * d;
    p.seekTo(t, true);
    emit({ time: t, duration: d, playing: true });
  }, []);

  const setVolume = useCallback((v: number) => {
    setVol(v);
    const p = playerRef.current;
    if (!p) return;
    p.setVolume(v);
    if (v > 0) {
      p.unMute();
      setMuted(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    setMuted((m) => {
      if (p) m ? p.unMute() : p.mute();
      return !m;
    });
  }, []);

  const value: MusicCtx = {
    hostRef,
    index,
    track: tracks[index],
    playing,
    ready,
    error,
    volume,
    muted,
    toggle,
    next,
    prev,
    playIndex,
    seek,
    setVolume,
    toggleMute,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMusic() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
  return ctx;
}

/**
 * Subscribe to playback progress WITHOUT re-rendering the whole app.
 * Only call this in the component that actually shows the time bar.
 */
export function useTrackProgress() {
  const [progress, setProgress] = useState({ time: 0, duration: 0, playing: false });

  useEffect(() => {
    const l: Listener = (p) => setProgress(p);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  return progress;
}
