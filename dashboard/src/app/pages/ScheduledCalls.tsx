import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { apiClient } from '../../api/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

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
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Scheduled Calls</h1>
      <Card>
        <CardHeader><CardTitle>Upcoming Bookings</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
              ) : bookings.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center">No scheduled calls found.</TableCell></TableRow>
              ) : bookings.map((b: any) => (
                <TableRow key={b.id}>
                  <TableCell>{b.client_name}</TableCell>
                  <TableCell>{b.client_email}</TableCell>
                  <TableCell>{new Date(b.start_time).toLocaleString()}</TableCell>
                  <TableCell>{b.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
