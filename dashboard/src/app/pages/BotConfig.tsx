import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { apiClient } from '../../api/client';
import { Button } from '../components/ui/button';

export default function BotConfig() {
  const [config, setConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await apiClient('/config/bot');
        setConfig(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadConfig();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Bot Configuration</h1>
      <Card>
        <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : config ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Voice</h3>
                <p>{config.voice_id || 'Default'}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Prompt</h3>
                <p className="text-sm bg-slate-50 p-3 rounded-md">{config.system_prompt || 'No custom prompt set'}</p>
              </div>
              <Button>Save Changes</Button>
            </div>
          ) : (
            <p>No bot configuration found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
