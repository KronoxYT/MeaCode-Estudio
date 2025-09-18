'use client';

import { useState } from 'react';
import { Sparkles, Terminal, Bot, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MeaCodePanelProps {
  onClose: () => void;
}

export function MeaCodePanel({ onClose }: MeaCodePanelProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEngage = () => {
    setIsLoading(true);
    console.log('Engaging MeaCode with prompt:', prompt);
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {/* Left Panel: Chat/Prompt */}
      <div className="w-1/3 border-r flex flex-col">
        <header className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary size-6" />
            <h1 className="text-xl font-semibold font-headline">MeaCode</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </header>
        <div className="flex-1 flex flex-col p-4 gap-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot /> All-in-One Context Engineer
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Describe your requirements. MeaCode will autonomously orchestrate the tools to deliver a solution.
              </p>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Implement a full user authentication system with social logins and a profile page.'"
                className="flex-1 font-code text-sm"
                disabled={isLoading}
              />
              <Button onClick={handleEngage} disabled={isLoading || !prompt.trim()}>
                {isLoading ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  'Engage MeaCode'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Panel: Unified Workspace */}
      <div className="w-2/3 flex flex-col">
        <header className="p-4 border-b">
          <h2 className="text-lg font-semibold">Unified Workspace</h2>
        </header>
        <div className="flex-1 p-4 grid grid-rows-2 gap-4">
          <Card className="row-span-1">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Terminal /> Execution Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 font-mono text-xs bg-muted p-2 rounded-md">
                <p>[{new Date().toLocaleTimeString()}] MeaCode initialized.</p>
                <p>[{new Date().toLocaleTimeString()}] Awaiting prompt...</p>
                {isLoading && <p>[{new Date().toLocaleTimeString()}] Processing request: "{prompt}"</p>}
              </ScrollArea>
            </CardContent>
          </Card>
          <Card className="row-span-1">
             <CardHeader>
              <CardTitle className="text-base">Real-time Preview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Live preview will appear here.</p>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
