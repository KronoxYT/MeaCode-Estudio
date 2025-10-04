'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Trash2, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsoleLog {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  content: string[];
  timestamp: Date;
}

interface ConsolePanelProps {
  code: string;
  language: 'javascript' | 'python' | 'html';
  className?: string;
}

export function ConsolePanel({ code, language, className }: ConsolePanelProps) {
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final cuando hay nuevos logs
  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [logs]);

  const addLog = (type: ConsoleLog['type'], ...args: any[]) => {
    const newLog: ConsoleLog = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      content: args.map(arg => {
        if (typeof arg === 'object' && arg !== null) {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }),
      timestamp: new Date(),
    };
    
    setLogs(prev => [...prev, newLog]);
  };

  const clearConsole = () => {
    setLogs([]);
  };

  const executeJavaScript = () => {
    if (language !== 'javascript') {
      clearConsole();
      addLog('warn', 'Execution is only available for JavaScript for now.');
      return;
    }

    setIsRunning(true);
    clearConsole();

    setTimeout(() => {
        try {
          // Crear console personalizado
          const customConsole = {
            log: (...args: any[]) => addLog('log', ...args),
            error: (...args: any[]) => addLog('error', ...args),
            warn: (...args: any[]) => addLog('warn', ...args),
            info: (...args: any[]) => addLog('info', ...args),
          };

          // Ejecutar código en un contexto aislado
          const func = new Function('console', code);
          func(customConsole);

          addLog('info', '✓ Code executed successfully');
        } catch (error: any) {
          addLog('error', `❌ Execution Error: ${error.message}`);
        } finally {
          setIsRunning(false);
        }
    }, 50) // Small delay to allow UI to update
  };

  const getLogColor = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-500';
      case 'warn':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-foreground';
    }
  };

  const getLogIcon = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warn':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '▸';
    }
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-3 py-2 bg-muted/50">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          <span className="text-sm font-medium">Console</span>
          {logs.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({logs.length})
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={clearConsole}
            disabled={logs.length === 0}
            className="h-8"
            title="Clear console"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            size="sm"
            onClick={executeJavaScript}
            disabled={isRunning || (language !== 'javascript' && code.trim() === '')}
            className="h-8 gap-1.5"
          >
            {isRunning ? (
                 <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
                <Play className="h-3.5 w-3.5" />
            )}
            Run
          </Button>
        </div>
      </div>

      {/* Console Output */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-3 font-mono text-sm space-y-1">
          {logs.length === 0 ? (
            <div className="text-muted-foreground text-center pt-16">
              <Terminal className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs">
                Press "Run" to execute your code and see the output.
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={cn(
                  'flex gap-3 py-1.5 px-2 rounded hover:bg-muted/50 transition-colors',
                  getLogColor(log.type)
                )}
              >
                <span className="shrink-0 select-none">{getLogIcon(log.type)}</span>
                <div className="flex-1 whitespace-pre-wrap break-words">
                  {log.content.join(' ')}
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0 self-start">
                  {log.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
