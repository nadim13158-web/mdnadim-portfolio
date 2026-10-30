import { motion } from "framer-motion";
import type { MouseEvent } from "react";
import SectionHeading from "./SectionHeading";
import Equalizer from "./Equalizer";
import { artist, cover, tracks, watchUrl } from "../data/music";
import { useMusic, useTrackProgress } from "../context/MusicContext";

function fmt(s: number) {
  if (!isFinite(s) || s <= 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}

export default function Music() {
  const m = useMusic();
  const { time, duration } = useTrackProgress();
  const pct = duration ? (time / duration) * 100 : 0;

  const onSeek = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    m.seek((e.clientX - r.left) / r.width);
  };

  return (
    <section id="music" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Soundtrack"
          title="Music that powers my late-night code"
          description={`Music is half of my creative process. Here's my rotation — ${tracks.length} songs by Pakistani singer-songwriter ${artist.name}, starting with Khaab.`}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* ---------------- PLAYER ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass flex flex-col rounded-3xl p-4 sm:p-6 lg:col-span-7"
          >
            {/* video / artwork frame */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-black">
              <img
                key={m.track.id}
                src={cover(m.track.id)}
                alt=""
                onError={(e) => (e.currentTarget.style.display = "none")}
                className="absolute inset-0 h-full w-full object-cover opacity-55"
              />

              {/* real player. z-20 so it always sits above the artwork and stays tappable */}
              <div
                ref={m.hostRef}
                className="absolute inset-0 z-20 [&_iframe]:h-full [&_iframe]:w-full"
              />

              {/* status chip */}
              <div className="pointer-events-none absolute left-3 top-3 z-30 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold backdrop-blur-md">
                <span
                  className={`h-2 w-2 rounded-full ${
                    m.playing ? "animate-pulse bg-emerald-400" : "bg-slate-400"
                  }`}
                />
                <span className="text-white">{m.playing ? "Now playing" : "Tap play ▶"}</span>
              </div>
            </div>

            {/* meta */}
            <div className="mt-5 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-indigo-400">
                  Track {String(m.index + 1).padStart(2, "0")} / {String(tracks.length).padStart(2, "0")}
                </p>
                <h3 className="mt-1 truncate font-display text-lg font-bold text-white sm:text-xl">
                  {m.track.title}
                </h3>
                <p className="truncate text-xs text-slate-400">
                  {artist.name} · {m.track.subtitle}
                </p>
              </div>
              <Equalizer
                playing={m.playing}
                count={5}
                className="hidden h-7 shrink-0 sm:flex"
                barClass="bg-brand-gradient"
              />
            </div>

            {/* progress */}
            <div className="mt-4">
              <div
                onClick={onSeek}
                data-cursor="Seek"
                className="relative flex h-6 cursor-pointer items-center"
              >
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="absolute inset-y-0 left-0 bg-brand-gradient"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div className="mt-1 flex justify-between font-mono text-[11px] text-slate-400">
                <span>{fmt(time)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>

            {/* controls */}
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={m.prev}
                  data-cursor="Prev"
                  aria-label="Previous track"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-colors hover:bg-white/10 active:scale-95"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 5h2v14H6zM20 5v14L9 12z" />
                  </svg>
                </button>

                <button
                  onClick={m.toggle}
                  data-cursor={m.playing ? "Pause" : "Play"}
                  aria-label={m.playing ? "Pause" : "Play"}
                  className="btn-primary btn-shine flex h-14 w-14 items-center justify-center rounded-full text-white active:scale-95"
                >
                  {m.playing ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                      <path d="M7 4l13 8-13 8z" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={m.next}
                  data-cursor="Next"
                  aria-label="Next track"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-colors hover:bg-white/10 active:scale-95"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 5h2v14h-2zM4 5v14l11-7z" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={m.toggleMute}
                  data-cursor={m.muted ? "Unmute" : "Mute"}
                  aria-label="Toggle mute"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinejoin="round" />
                    {m.muted ? (
                      <path d="M22 9l-6 6M16 9l6 6" strokeLinecap="round" />
                    ) : (
                      <path d="M15.5 8.5a5 5 0 010 7" strokeLinecap="round" />
                    )}
                  </svg>
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={m.muted ? 0 : m.volume}
                  onChange={(e) => m.setVolume(Number(e.target.value))}
                  aria-label="Volume"
                  className="range hidden w-24 accent-indigo-400 sm:block"
                />
              </div>
            </div>

            {m.error && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
                <span>The player could not load here.</span>
                <a
                  href={watchUrl(m.track.id)}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="YouTube"
                  className="rounded-full bg-amber-300 px-4 py-1.5 text-xs font-semibold text-black"
                >
                  Open on YouTube →
                </a>
              </div>
            )}
          </motion.div>

          {/* ---------------- PLAYLIST ---------------- */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass flex flex-col rounded-3xl p-4 sm:p-6 lg:col-span-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/[0.07] pb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Playlist · {tracks.length} songs
              </p>
              <a
                href={artist.channel}
                target="_blank"
                rel="noreferrer"
                data-cursor="Channel"
                className="shrink-0 text-xs font-medium text-indigo-400 hover:text-indigo-300"
              >
                Artist page →
              </a>
            </div>

            <ul className="-mx-1 max-h-[380px] space-y-1 overflow-y-auto px-1 lg:max-h-[430px]">
              {tracks.map((t, idx) => {
                const isCurrent = idx === m.index;
                return (
                  <li key={t.id}>
                    <div
                      className={`flex w-full items-center gap-3 rounded-2xl p-2 transition-colors ${
                        isCurrent ? "bg-white/[0.09]" : "hover:bg-white/[0.05]"
                      }`}
                    >
                      <button
                        onClick={() => (isCurrent ? m.toggle() : m.playIndex(idx))}
                        data-cursor={isCurrent && m.playing ? "Pause" : "Play"}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      >
                        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-brand-gradient">
                          <img
                            src={cover(t.id, "mq")}
                            alt=""
                            loading="lazy"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/35 text-white">
                            {isCurrent && m.playing ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                              </svg>
                            ) : (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            )}
                          </span>
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={`block truncate text-sm font-semibold ${
                              isCurrent ? "text-white" : "text-white/85"
                            }`}
                          >
                            {t.title}
                          </span>
                          <span className="block truncate text-xs text-slate-400">{t.subtitle}</span>
                        </span>
                      </button>

                      <a
                        href={watchUrl(t.id)}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="Open"
                        aria-label={`Open ${t.title} on YouTube`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:text-white"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                          <path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="mt-4 border-t border-white/[0.07] pt-3 text-center text-[11px] leading-relaxed text-slate-500">
              Streamed from official YouTube uploads.
              <br />
              All music © {artist.name} &amp; respective owners.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
