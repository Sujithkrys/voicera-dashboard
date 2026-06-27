import React from "react";

interface TickBarProps {
  /** Current value as a fraction 0-1 (e.g. 0.82 for 82%) */
  value: number;
  /** Number of tick segments to render */
  segments?: number;
  /** SVG width in px */
  width?: number;
  /** SVG height in px */
  height?: number;
  /** CSS class applied to the root <svg> */
  className?: string;
}

/**
 * Segmented tick bar with a downward-pointing caret marker.
 * Use for percentage metrics (e.g. resolution rate, data health score).
 * Renders a row of small vertical tick rectangles (like a barcode/equalizer)
 * with a marker at the position matching the percentage.
 */
export function TickBar({
  value,
  segments = 28,
  width = 110,
  height = 18,
  className,
}: TickBarProps) {
  const clamped = Math.min(Math.max(value, 0), 1);
  const markerX = width * clamped;
  const gap = width / segments;
  const tickW = Math.max(gap * 0.45, 1);
  const tickH = 8;
  const tickY = height - tickH;
  const caretSize = 3;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ color: "#d1d5db" }}
    >
      {/* Tick rectangles */}
      {Array.from({ length: segments }, (_, i) => (
        <rect
          key={i}
          x={i * gap + gap * 0.2}
          y={tickY}
          width={tickW}
          height={tickH}
          rx={0.4}
          fill="currentColor"
          opacity={0.5}
        />
      ))}
      {/* Downward-pointing caret marker */}
      <path
        d={`M${markerX - caretSize},${tickY - 5} L${markerX + caretSize},${tickY - 5} L${markerX},${tickY - 0.5} Z`}
        fill="currentColor"
        opacity={0.8}
      />
    </svg>
  );
}
