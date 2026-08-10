import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { DropdownSelect } from '../components/ui/dropdown-select';
import { ChevronDown, X, Info } from 'lucide-react';

export default function ScheduledCalls() {
  const [checkouts, setCheckouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCheckout, setSelectedCheckout] = useState<any | null>(null);

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
      case "converted": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending": return "bg-amber-50 text-amber-700 border-amber-200";
      case "called": return "bg-blue-50 text-blue-700 border-blue-200";
      case "skipped": return "bg-neutral-100 dark:bg-neutral-900/30 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800";
      default: return "bg-secondary text-muted-foreground border-border";
    }
  };

  return (
    <div className="p-6 space-y-5 h-full flex flex-col relative overflow-hidden">
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
          <thead className="sticky top-0 bg-background z-10">
            <tr className="border-b border-border">
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Customer Name</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Cart Value</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1.5 cursor-help" title="Outbound calling coming soon">
                  Call Attempts
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-[13px] text-muted-foreground">Loading...</td>
              </tr>
            ) : checkouts.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-[13px] text-muted-foreground">No abandoned checkouts yet.</td>
              </tr>
            ) : checkouts.map((c: any) => (
              <tr 
                key={c.checkout_id} 
                className="border-b border-neutral-50 last:border-0 hover:bg-muted transition-colors cursor-pointer group"
                onClick={() => setSelectedCheckout(c)}
              >
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-[11px] font-medium text-muted-foreground">
                      {c.customer_name && c.customer_name.length > 0 ? c.customer_name[0] : "?"}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-foreground">{c.customer_name || 'Unknown'}</div>
                      <div className="text-[11px] text-muted-foreground">{c.customer_phone || c.customer_email || '—'}</div>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-4 text-[13px] text-muted-foreground">{c.cart_value ? `$${parseFloat(c.cart_value).toFixed(2)}` : '-'}</td>
                <td className="py-2.5 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[11px] font-medium capitalize ${statusStyle(c.status)}`}>
                    {c.status || 'unknown'}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-[13px] text-muted-foreground">{c.call_attempts || 0}</td>
                <td className="py-2.5 px-4 text-[13px] text-muted-foreground">{c.created_at ? new Date(c.created_at).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-out Detail Panel */}
      <div className={`absolute top-0 right-0 bottom-0 w-[420px] bg-background border-l border-border transition-transform duration-200 z-50 flex flex-col ${selectedCheckout ? "translate-x-0" : "translate-x-full"}`}>
        {selectedCheckout && (
          <>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-[13px] font-medium text-foreground">
                  {selectedCheckout.customer_name && selectedCheckout.customer_name.length > 0 ? selectedCheckout.customer_name[0] : "?"}
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-foreground flex items-center gap-2">
                    {selectedCheckout.customer_name || 'Unknown'}
                  </h3>
                  <p className="text-[12px] text-muted-foreground">{selectedCheckout.customer_phone || selectedCheckout.customer_email || '—'}</p>
                </div>
              </div>
              <button className="p-1 rounded hover:bg-secondary text-muted-foreground" onClick={() => setSelectedCheckout(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border border-border rounded-md p-3">
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Cart Value</div>
                  <div className="text-[13px] font-medium text-foreground">{selectedCheckout.cart_value ? `$${parseFloat(selectedCheckout.cart_value).toFixed(2)}` : '-'}</div>
                </div>
                <div className="border border-border rounded-md p-3">
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Status</div>
                  <div className="text-[13px] font-medium text-foreground capitalize flex items-center gap-2">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-medium capitalize ${statusStyle(selectedCheckout.status)}`}>
                      {selectedCheckout.status || 'unknown'}
                    </span>
                  </div>
                </div>
              </div>

              <h4 className="text-[13px] font-semibold text-foreground mb-3">Cart Contents</h4>
              <div className="space-y-3">
                {selectedCheckout.cart_items && selectedCheckout.cart_items.length > 0 ? (
                  selectedCheckout.cart_items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-muted p-3 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-background border border-border rounded flex items-center justify-center text-[11px] font-medium text-muted-foreground">
                          {item.quantity}x
                        </div>
                        <div className="text-[13px] font-medium text-foreground">{item.title || item.name}</div>
                      </div>
                      <div className="text-[13px] text-foreground font-medium">${parseFloat(item.price).toFixed(2)}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-[13px] text-muted-foreground">No items recorded in cart.</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

