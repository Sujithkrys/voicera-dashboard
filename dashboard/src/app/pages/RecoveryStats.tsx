import React, { useState, useEffect } from "react";
import { apiClient } from "../../api/client";

interface RecoveryStatsData {
  total_triggered: number;
  converted_count: number;
  conversion_rate: number;
  revenue_recovered: number;
  dnd_skipped_count: number;
}

export default function RecoveryStats() {
  const [stats, setStats] = useState<RecoveryStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await apiClient("/recovery/stats");
        setStats(res);
      } catch (err) {
        console.error("Failed to load recovery stats", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const metrics = [
    {
      label: "Total Recovery Calls",
      value: stats?.total_triggered?.toLocaleString() || "0",
    },
    {
      label: "Conversion Rate",
      value: `${stats?.conversion_rate?.toFixed(1) || 0}%`,
    },
    {
      label: "Revenue Recovered",
      value: `$${stats?.revenue_recovered?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`,
    },
    {
      label: "Calls Skipped (DND)",
      value: stats?.dnd_skipped_count?.toLocaleString() || "0",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <h1 className="text-[18px] font-semibold text-foreground">Recovery Performance</h1>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading statistics...</div>
      ) : (
        <div
          className="grid grid-cols-4 gap-6"
        >
          {metrics.map((m, i) => (
            <div key={i} className="min-w-0 border border-border rounded-lg p-5">
              <div className="flex items-center gap-1 mb-2">
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>
                  {m.label}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span
                  style={{
                    fontSize: 32,
                    fontWeight: 600,
                    color: "#111827",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {m.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
