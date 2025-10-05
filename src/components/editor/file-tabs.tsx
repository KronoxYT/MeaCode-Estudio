'use client';

import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { FileTab } from '@/contexts/editor-context';

interface FileTabsProps {
  files: FileTab[];
  activeFileId: string;
  onFileSelect: (fileId: string) => void;
  onFileClose: (fileId: string) => void;
  onNewFile: () => void;
}

// Iconos por tipo de archivo
const getFileIcon = (language: string) => {
  switch (language) {
    case 'javascript':
      return '📄';
    case 'python':
      return '🐍';
    case 'html':
      return '🌐';
    case 'css':
      return '🎨';
    case 'json':
      return '📋';
    default:
      return '📄';
  }
};

// Color por tipo
const getFileColor = (language: string) => {
  switch (language) {
    case 'javascript':
      return 'text-yellow-500';
    case 'python':
      return 'text-blue-500';
    case 'html':
      return 'text-orange-500';
    case 'css':
      return 'text-purple-500';
    case 'json':
      return 'text-gray-500';
    default:
      return 'text-foreground';
  }
};

export function FileTabs({ 
  files, 
  activeFileId, 
  onFileSelect, 
  onFileClose,
  onNewFile 
}: FileTabsProps) {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-center">
        {/* Tabs scrolleables */}
        <ScrollArea className="flex-1">
          <div className="flex">
            {files.map((file) => {
              const isActive = file.id === activeFileId;
              
              return (
                <div
                  key={file.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onFileSelect(file.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onFileSelect(file.id);
                    }
                  }}
                  className={cn(
                    'group relative flex items-center gap-2 px-4 py-2.5 border-r transition-colors min-w-[120px] max-w-[180px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:z-10',
                    isActive
                      ? 'bg-background text-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  )}
                >
                  {/* Indicador de archivo activo */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                  
                  {/* Icono del archivo */}
                  <span className={cn('text-lg', getFileColor(file.language))}>
                    {getFileIcon(file.language)}
                  </span>
                  
                  {/* Nombre del archivo */}
                  <span className="flex-1 truncate text-sm font-medium">
                    {file.name}
                    {file.isDirty && (
                      <span className="ml-1 text-primary">●</span>
                    )}
                  </span>
                  
                  {/* Botón cerrar */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileClose(file.id);
                    }}
                    className={cn(
                      'opacity-0 group-hover:opacity-100 transition-opacity',
                      'hover:bg-background/50 rounded p-0.5'
                    )}
                    aria-label={`Close ${file.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        
        {/* Botón nuevo archivo */}
        <Button
          size="sm"
          variant="ghost"
          onClick={onNewFile}
          className="shrink-0 rounded-none border-l h-full px-3"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
