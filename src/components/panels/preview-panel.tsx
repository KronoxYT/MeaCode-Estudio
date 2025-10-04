'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink, Smartphone, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEditor } from '@/contexts/editor-context';

export function PreviewPanel() {
  const { code, language, setPreviewError } = useEditor();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    // Escuchar errores del iframe
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleIframeError = (event: ErrorEvent) => {
        setPreviewError(event.message);
    };

    iframe.contentWindow?.addEventListener('error', handleIframeError);

    return () => {
        iframe.contentWindow?.removeEventListener('error', handleIframeError);
    };

  }, [iframeRef, setPreviewError]);


  useEffect(() => {
    if (language === 'html') {
      updatePreview();
    }
  }, [code, language]);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    setIsLoading(true);
    setPreviewError(null);

    const fullHTML = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            padding: 1rem;
            background-color: white;
          }
          .dark body {
             background-color: #020817; /* Tailwind dark bg */
             color: #fafafa;
          }
        </style>
      </head>
      <body class="${document.documentElement.classList.contains('dark') ? 'dark' : ''}">
        ${code}
      </body>
      </html>
    `;

    const iframeDoc = iframeRef.current.contentDocument;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(fullHTML);
      iframeDoc.close();
    }

    setTimeout(() => setIsLoading(false), 300);
  };

  const openInNewTab = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  if (language !== 'html') {
    return (
      <div className="flex h-full items-center justify-center bg-muted/20">
        <div className="text-center space-y-3">
          <div className="text-4xl">📄</div>
          <p className="text-sm text-muted-foreground">
            Preview solo disponible para HTML
          </p>
          <p className="text-xs text-muted-foreground">
            Usa la Console para ejecutar JavaScript
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b px-3 py-2 bg-muted/50">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={viewMode === 'desktop' ? 'default' : 'ghost'}
            onClick={() => setViewMode('desktop')}
            className="h-8 w-8 p-0"
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'mobile' ? 'default' : 'ghost'}
            onClick={() => setViewMode('mobile')}
            className="h-8 w-8 p-0"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={updatePreview}
            disabled={isLoading}
            className="h-8 gap-1.5"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isLoading && 'animate-spin')} />
            Refresh
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={openInNewTab}
            className="h-8 gap-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-900 p-4">
        <div
          className={cn(
            'mx-auto h-full transition-all duration-300',
            viewMode === 'mobile' ? 'max-w-[375px]' : 'w-full'
          )}
        >
          <iframe
            ref={iframeRef}
            className={cn(
              'w-full h-full border-0 bg-white dark:bg-gray-950 rounded-lg',
              viewMode === 'mobile' && 'shadow-xl'
            )}
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
