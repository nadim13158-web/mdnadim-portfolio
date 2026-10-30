import { useEffect, useState } from "react";
import { cover, artist } from "../data/music";
import { useMusic, useTrackProgress } from "../context/MusicContext";
import Equalizer from "./Equalizer";

export default function MiniPlayer() {
  const { track, playing, toggle, next, prev } = useMusic();
  const { time, duration } = useTrackProgress();
  const [ok, setOk] = useState(true);
  const pct = duration ? (time / duration) * 100 : 0;

  // Stay out of the way: hidden on the first screen (so it never covers the
  // hero buttons) and while the full player in the Music section is visible.
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.6;
      const music = document.getElementById("music");
      let atMusic = false;
      if (music) {
        const r = music.getBoundingClientRect();
        atMusic = r.top < window.innerHeight * 0.55 && r.bottom > window.innerHeight * 0.45;
      }
      setShow(pastHero && !atMusic);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goLab = () => document.getElementById("music")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div
      aria-hidden={!show}
      className={`fixed bottom-[calc(env(safe-area-inset-bottom,0px)+0.9rem)] left-3 z-[150] max-w-[calc(100vw-6.5rem)] transition-[opacity,translate] duration-500 ease-out sm:left-5 ${
        show ? "" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="glass-strong mini-solid relative flex items-center gap-2.5 overflow-hidden rounded-full p-1.5 pr-2.5 shadow-2xl shadow-black/50 sm:gap-3 sm:pr-3.5">
        <button
          onClick={toggle}
          data-cursor={playing ? "Pause" : "Play"}
          aria-label={playing ? "Pause" : "Play"}
          className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full active:scale-95"
        >
          {ok && (
            <img
              src={cover(track.id, "mq")}
              alt=""
              onError={() => setOk(false)}
              className="animate-spin-slow h-full w-full scale-[1.35] object-cover"
              style={{ animationPlayState: playing ? "running" : "paused" }}
            />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white">
            {playing ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </span>
        </button>

        <button onClick={goLab} data-cursor="Open" className="hidden min-w-0 text-left sm:block">
          <span className="block max-w-[150px] truncate text-sm font-medium text-white">{track.title}</span>
          <span className="block truncate text-xs text-white/45">{artist.name}</span>
        </button>

        <Equalizer playing={playing} count={4} className="hidden h-4 shrink-0 sm:flex" barClass="bg-brand-gradient" />

        <button
          onClick={prev}
          data-cursor="Prev"
          aria-label="Previous song"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors active:scale-95 hover:text-white"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 5h2v14H6zM20 5v14L9 12z" />
          </svg>
        </button>
        <button
          onClick={next}
          data-cursor="Next"
          aria-label="Next song"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors active:scale-95 hover:text-white"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 5h2v14h-2zM4 5v14l11-7z" />
          </svg>
        </button>

        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
          <span className="block h-full bg-brand-gradient" style={{ width: `${pct}%` }} />
        </span>
      </div>
    </div>
  );
}
