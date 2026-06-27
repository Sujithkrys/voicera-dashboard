import React from "react";

interface MiniBarsProps {
  /** Array of numeric values for each bar */
  data: number[];
  /** SVG width in px */
  width?: number;
  /** SVG height in px */
  height?: number;
  /** CSS class applied to the root <svg> */
  className?: string;
}

/**
 * Mini bar histogram — thin vertical bars of varying height.
 * Use for small discrete counts (e.g. escalations, error count).
 */
export function MiniBars({
  data,
  width = 40,
  height = 24,
  className,
}: MiniBarsProps) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data) || 1;
  const slotW = width / data.length;
  const barW = Math.max(slotW - 2, 1.5);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ color: "#d1d5db" }}
    >
      {data.map((v, i) => {
        const barH = Math.max(2, (v / max) * height);
        return (
          <rect
            key={i}
            x={i * slotW}
            y={height - barH}
            width={barW}
            height={barH}
            rx={0.5}
            fill="currentColor"
          />
        );
      })}
    </svg>
  );
}
