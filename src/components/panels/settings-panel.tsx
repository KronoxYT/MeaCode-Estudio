'use client';

import { useTheme } from '@/hooks/use-theme';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Moon, Sun } from 'lucide-react';

export default function SettingsPanel() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-full">
      <header className="border-b p-4">
        <h2 className="font-semibold text-lg">Settings</h2>
        <p className="text-sm text-muted-foreground">Customize your environment.</p>
      </header>
      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-switch" className="flex items-center gap-2">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="ml-2">Dark Mode</span>
              </Label>
              <Switch
                id="theme-switch"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
