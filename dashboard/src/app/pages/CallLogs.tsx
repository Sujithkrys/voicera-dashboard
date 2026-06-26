import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { apiClient } from '../../api/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

export default function CallLogs() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await apiClient('/sessions');
        setSessions(res.sessions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Call Logs</h1>
      <Card>
        <CardHeader><CardTitle>All Calls</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
              ) : sessions.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center">No call logs found.</TableCell></TableRow>
              ) : sessions.map((s: any) => (
                <TableRow key={s.id}>
                  <TableCell>{s.customer?.name || s.customer?.email || 'Unknown'}</TableCell>
                  <TableCell>{s.status}</TableCell>
                  <TableCell>{s.metadata?.channel || 'Unknown'}</TableCell>
                  <TableCell>{new Date(s.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
