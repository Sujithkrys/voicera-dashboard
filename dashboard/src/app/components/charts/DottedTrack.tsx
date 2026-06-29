import React from "react";

interface DottedTrackProps {
  /** Current value as a fraction 0-1 (e.g. 0.65 for 65%) */
  value: number;
  /** SVG width in px */
  width?: number;
  /** SVG height in px */
  height?: number;
  /** CSS class applied to the root <svg> */
  className?: string;
}

/**
 * Dotted/dashed progress track with a downward-pointing caret marker.
 * Use for duration or rate metrics (e.g. average handle time, response velocity).
 */
export function DottedTrack({
  value,
  width = 110,
  height = 18,
  className,
}: DottedTrackProps) {
  const clamped = Math.min(Math.max(value, 0), 1);
  const markerX = width * clamped;
  const trackY = height - 3;
  const caretSize = 3;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ color: "#4b5563" }}
    >
      {/* Dashed track line */}
      <line
        x1={0}
        y1={trackY}
        x2={width}
        y2={trackY}
        stroke="currentColor"
        strokeWidth={1.6}
        strokeDasharray="1.5,3"
        strokeLinecap="round"
        opacity={0.5}
      />
      {/* Downward-pointing caret marker */}
      <path
        d={`M${markerX - caretSize},${trackY - 8} L${markerX + caretSize},${trackY - 8} L${markerX},${trackY - 3} Z`}
        fill="currentColor"
        opacity={0.7}
      />
    </svg>
  );
}
