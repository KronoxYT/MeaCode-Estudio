'use client';

import { useState } from 'react';
import { Sparkles, Terminal, Bot, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MeaCoreLogo } from '../code-canvas-logo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

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
      <TooltipProvider delayDuration={0}>
        <aside className="flex flex-col items-center gap-4 border-r bg-background p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                onClick={onClose}
                aria-label="Exit MeaCode Mode"
              >
                <MeaCoreLogo className="size-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Exit MeaCode
            </TooltipContent>
          </Tooltip>
        </aside>
      </TooltipProvider>

      {/* Left Panel: Chat/Prompt */}
      <div className="w-1/3 border-r flex flex-col">
        <header className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary size-6" />
            <h1 className="text-xl font-semibold font-headline">MeaCode</h1>
          </div>
        </header>
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
          <p className="text-sm text-muted-foreground">
            Describe tus requisitos. MeaCode orquestará autónomamente las herramientas para entregar una solución.
          </p>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Implementar un sistema de autenticación de usuarios completo con inicios de sesión sociales y una página de perfil.'"
            className="flex-1 font-code text-sm"
            disabled={isLoading}
          />
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Terminal /> Monitor de Ejecución
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 font-mono text-xs bg-muted p-2 rounded-md">
                <p>[{new Date().toLocaleTimeString()}] MeaCode inicializado.</p>
                <p>[{new Date().toLocaleTimeString()}] Esperando prompt...</p>
                {isLoading && <p>[{new Date().toLocaleTimeString()}] Procesando solicitud: "{prompt}"</p>}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <div className="p-4 border-t">
          <Button onClick={handleEngage} disabled={isLoading || !prompt.trim()} className="w-full">
            {isLoading ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Ejecutando...
              </>
            ) : (
              'Engage MeaCode'
            )}
          </Button>
        </div>
      </div>

      {/* Right Panel: Unified Workspace */}
      <div className="w-2/3 flex flex-col">
        <header className="p-4 border-b">
          <h2 className="text-lg font-semibold">Espacio de Trabajo Unificado</h2>
        </header>
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Vista Previa en Tiempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[70vh] w-full bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">La vista previa en vivo aparecerá aquí.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
