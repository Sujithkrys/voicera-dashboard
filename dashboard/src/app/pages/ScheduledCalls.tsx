import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';

export default function ScheduledCalls() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      try {
        const res = await apiClient('/calendar/bookings');
        setBookings(res.bookings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBookings();
  }, []);

  return (
    <div className="p-6 space-y-5 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-semibold text-foreground">Scheduled Calls</h1>
      </div>

      <div className="border border-border rounded-lg overflow-auto flex-1">
        <table className="w-full">
          <thead className="sticky top-0 bg-background">
            <tr className="border-b border-border">
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Client Name</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Email</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Time</th>
              <th className="text-left py-2.5 px-4 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-[13px] text-muted-foreground">Loading...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-[13px] text-muted-foreground">No scheduled calls found.</td>
              </tr>
            ) : bookings.map((b: any) => (
              <tr key={b.id} className="border-b border-neutral-50 last:border-0 hover:bg-muted transition-colors cursor-pointer">
                <td className="py-2.5 px-4 text-[13px] font-medium text-foreground">{b.client_name}</td>
                <td className="py-2.5 px-4 text-[13px] text-muted-foreground">{b.client_email}</td>
                <td className="py-2.5 px-4 text-[13px] text-muted-foreground">{new Date(b.start_time).toLocaleString()}</td>
                <td className="py-2.5 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                    b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
