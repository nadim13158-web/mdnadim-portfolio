export default function Equalizer({
  playing,
  count = 5,
  className = "h-4",
  barClass = "bg-brand",
  barWidth = "w-[3px]",
}: {
  playing: boolean;
  count?: number;
  className?: string;
  barClass?: string;
  barWidth?: string;
}) {
  return (
    <div className={`eq flex items-end gap-[3px] ${playing ? "eq-on" : ""} ${className}`} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`eq-bar h-full ${barWidth} ${barClass}`}
          style={{
            animationDuration: `${0.55 + ((i * 37) % 7) * 0.09}s`,
            animationDelay: `${-((i * 53) % 9) * 0.11}s`,
          }}
        />
      ))}
    </div>
  );
}
