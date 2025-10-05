'use client';

import { useState } from 'react';
import { Sparkles, Terminal, Bot, User, X, Monitor, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MeaCodeLogo } from '../mea-code-logo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

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
    <div className="flex h-screen w-full flex-col bg-background text-foreground md:flex-row">
      <TooltipProvider delayDuration={0}>
        <aside className="flex items-center gap-4 border-b bg-background p-2 md:flex-col md:border-b-0 md:border-r">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                onClick={onClose}
                aria-label="Exit MeaCode Mode"
              >
                <MeaCodeLogo className="size-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Exit MeaCode
            </TooltipContent>
          </Tooltip>
        </aside>
      </TooltipProvider>

      {/* Left Panel: Chat/Prompt */}
      <div className="flex flex-col border-b md:w-1/3 md:border-b-0 md:border-r">
        <header className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary size-6" />
            <h1 className="text-xl font-semibold font-headline">MeaCode</h1>
          </div>
        </header>
        <div className="flex-1 flex-col gap-4 overflow-y-auto p-4 md:flex">
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
        </div>
        <div className="border-t p-4">
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
      <div className="flex flex-1 flex-col">
        <Tabs defaultValue="execution" className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b p-2">
            <h2 className="px-2 text-lg font-semibold">Espacio de Trabajo Unificado</h2>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="execution">
                <Monitor className="mr-2 size-4" />
                Ejecución
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="mr-2 size-4" />
                Vista Previa
              </TabsTrigger>
            </TabsList>
          </header>

          <TabsContent value="execution" className="flex-1 overflow-auto p-4 m-0">
             <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Terminal /> Monitor de Ejecución
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 font-mono text-xs bg-muted p-2 rounded-md md:h-[60vh]">
                    <p>[{new Date().toLocaleTimeString()}] MeaCode inicializado.</p>
                    <p>[{new Date().toLocaleTimeString()}] Esperando prompt...</p>
                    {isLoading && <p>[{new Date().toLocaleTimeString()}] Procesando solicitud: "{prompt}"</p>}
                  </ScrollArea>
                </CardContent>
              </Card>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-auto p-4 m-0">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base">Vista Previa en Tiempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full bg-muted rounded-md flex items-center justify-center md:h-[60vh]">
                  <p className="text-muted-foreground">La vista previa en vivo aparecerá aquí.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
