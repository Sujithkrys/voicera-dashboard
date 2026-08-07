import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { DropdownSelect } from '../components/ui/dropdown-select';
import { ChevronDown } from 'lucide-react';

export default function ScheduledCalls() {
  const [checkouts, setCheckouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function loadCheckouts() {
      setIsLoading(true);
      try {
        let url = '/recovery/checkouts';
        if (statusFilter !== 'all') {
          url += `?status=${statusFilter}`;
        }
        const res = await apiClient(url);
        // Ensure res is an array if endpoint returns an array, or res.checkouts if it returns an object
        const data = Array.isArray(res) ? res : (res.checkouts || []);
        setCheckouts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCheckouts();
  }, [statusFilter]);

  const statusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "converted": return "bg-emerald-50 text-emerald-700";
      case "pending": return "bg-amber-50 text-amber-700";
      case "called": return "bg-blue-50 text-blue-700";
      case "skipped": return "bg-neutral-100 text-neutral-600";
      default: return "bg-secondary text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-5 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-semibold text-foreground">Cart & Purchase Recovery</h1>
      </div>

      <div className="flex items-center gap-2">
        <DropdownSelect
          value={statusFilter}
          onValueChange={setStatusFilter}
          options={[
            { label: "All Statuses", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Converted", value: "converted" },
            { label: "Called", value: "called" },
            { label: "Skipped", value: "skipped" },
          ]}
        />
      </div>

      <div className="border border-border rounded-lg overflow-auto flex-1">
        <table className="w-full">
          <thead className="sticky top-0 bg-background">
            <tr className="border-b border-border">
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Customer Name</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Cart Value</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Reason</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Call Attempts</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-[13px] text-muted-foreground">Loading...</td>
              </tr>
            ) : checkouts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-[13px] text-muted-foreground">No recovery records found.</td>
              </tr>
            ) : checkouts.map((c: any) => (
              <tr key={c.checkout_id} className="border-b border-neutral-50 last:border-0 hover:bg-muted transition-colors cursor-pointer">
                <td className="py-2.5 px-4 text-[13px] font-medium text-foreground">{c.customer_name || 'Unknown'}</td>
                <td className="py-2.5 px-4 text-[13px] text-muted-foreground">{c.cart_value ? `$${parseFloat(c.cart_value).toFixed(2)}` : '-'}</td>
                <td className="py-2.5 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium capitalize ${statusStyle(c.status)}`}>
                    {c.status || 'unknown'}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-[13px] text-muted-foreground capitalize">{c.reason || '-'}</td>
                <td className="py-2.5 px-4 text-[13px] text-muted-foreground">{c.call_attempts || 0}</td>
                <td className="py-2.5 px-4 text-[13px] text-muted-foreground">{c.created_at ? new Date(c.created_at).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
