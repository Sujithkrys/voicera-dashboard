import React from "react";

interface SparklineProps {
  /** Array of numeric data points */
  data: number[];
  /** SVG width in px */
  width?: number;
  /** SVG height in px */
  height?: number;
  /** Stroke width of the polyline */
  strokeWidth?: number;
  /** CSS class applied to the root <svg> */
  className?: string;
}

function buildPath(points: number[], w: number, h: number): string {
  if (!points || points.length === 0) return "";
  if (points.length === 1) return `M0,${h / 2} L${w},${h / 2}`;

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const stepX = w / (points.length - 1);

  return points
    .map((p, i) => {
      const x = i * stepX;
      const y = h - ((p - min) / range) * (h - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

/**
 * Sharp sparkline — thin polyline with straight segments connecting real data
 * points. Use for cumulative / trending-over-time metrics.
 */
export function Sparkline({
  data,
  width = 110,
  height = 24,
  strokeWidth = 1.4,
  className,
}: SparklineProps) {
  const d = buildPath(data, width, height);

  if (!d) return null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
      style={{ color: "#9ca3af" }}
    >
      <path
        d={d}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
