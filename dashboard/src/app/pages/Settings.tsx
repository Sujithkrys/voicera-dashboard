import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function Settings() {
  const name = localStorage.getItem('voicera_name') || '';
  const email = localStorage.getItem('voicera_email') || '';

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Settings</h1>
      <Card>
        <CardHeader><CardTitle>Profile & Preferences</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input defaultValue={name} />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue={email} disabled />
            </div>
            <Button>Save Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
