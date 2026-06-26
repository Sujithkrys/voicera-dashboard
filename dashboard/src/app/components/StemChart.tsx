interface StemChartProps {
  data: { value: number }[];
  color?: string;
}

export function StemChart({ data, color = "#d1d5db" }: StemChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  return (
    <div className="w-full h-full flex items-end px-3" style={{ gap: "2px" }}>
      {data.map((item, index) => {
        const height = Math.max(((item.value - minValue) / range) * 100, 5);
        return (
          <div
            key={index}
            className="flex items-end"
            style={{
              width: "1px",
              height: "100%",
            }}
          >
            <div
              style={{
                width: "1px",
                height: `${height}%`,
                backgroundColor: color,
                minHeight: "2px"
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
