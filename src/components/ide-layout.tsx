'use client';

import { useState } from 'react';
import {
  FileCode,
  MessageSquare,
  Settings,
  File as FileIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { EditorPanel } from './panels/editor-panel';
import { CodeCanvasLogo } from './code-canvas-logo';
import { MeaCodePanel } from './panels/mea-code-panel';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from './ui/skeleton';

const AiChatPanel = dynamic(() => import('./panels/ai-chat-panel'), {
  loading: () => <div className="p-4"><Skeleton className="h-20 w-full" /></div>,
});
const FileExplorerPanel = dynamic(() => import('./panels/file-explorer-panel'), {
  loading: () => <div className="p-4"><Skeleton className="h-20 w-full" /></div>,
});
const SettingsPanel = dynamic(() => import('./panels/settings-panel'), {
  loading: () => <div className="p-4"><Skeleton className="h-20 w-full" /></div>,
});

type PanelId = 'editor' | 'chat' | 'files' | 'settings';

const panels: { id: PanelId; icon: React.ElementType; label: string }[] = [
  { id: 'editor', icon: FileIcon, label: 'Editor' },
  { id: 'chat', icon: MessageSquare, label: 'AI Chat' },
  { id: 'files', icon: FileCode, label: 'File Explorer' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function IdeLayout() {
  const [isMeaCodeActive, setIsMeaCodeActive] = useState(false);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<PanelId>('editor');

  if (isMeaCodeActive) {
    return <MeaCodePanel onClose={() => setIsMeaCodeActive(false)} />;
  }
  
  // Prevents hydration mismatch by showing a loader until client-side check is complete
  if (isMobile === undefined) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <CodeCanvasLogo className="size-12 animate-pulse" />
      </div>
    );
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="flex h-screen w-full flex-col bg-muted/40">
        <header className="flex h-14 items-center justify-between border-b bg-background px-4">
           <button onClick={() => setIsMeaCodeActive(true)} className="p-2">
              <CodeCanvasLogo className="size-6" />
           </button>
           <h1 className="text-lg font-semibold">CodeCanvas AI</h1>
           <div></div>
        </header>
        <main className="flex-1 overflow-hidden">
          <TabsContent value="editor" className={cn("h-full", activeTab !== 'editor' && "hidden")}>
             <EditorPanel />
          </TabsContent>
          <TabsContent value="chat" className={cn("h-full", activeTab !== 'chat' && "hidden")}>
             <AiChatPanel />
          </TabsContent>
          <TabsContent value="files" className={cn("h-full", activeTab !== 'files' && "hidden")}>
            <FileExplorerPanel />
          </TabsContent>
          <TabsContent value="settings" className={cn("h-full", activeTab !== 'settings' && "hidden")}>
             <SettingsPanel />
          </TabsContent>
        </main>
        <footer className="border-t bg-background">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PanelId)} className="w-full">
            <TabsList className="grid h-full w-full grid-cols-4 rounded-none">
              {panels.map(panel => {
                const Icon = panel.icon;
                return (
                  <TabsTrigger key={panel.id} value={panel.id} className="flex-col gap-1 py-2 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                    <Icon className="size-5" />
                    <span className="text-xs">{panel.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </footer>
      </div>
    );
  }
  
  // Desktop Layout
  return (
    <div className="flex h-screen w-full bg-background">
        <aside className="flex flex-col items-center justify-between gap-4 border-r bg-muted/40 p-2">
            <div className="flex flex-col items-center gap-4">
              <button onClick={() => setIsMeaCodeActive(true)} className="p-2">
                <CodeCanvasLogo className="size-6" />
              </button>
              {panels.filter(p => p.id !== 'editor').map(panel => {
                  const Icon = panel.icon;
                  return (
                    <button
                      key={panel.id}
                      onClick={() => setActiveTab(activeTab === panel.id ? 'editor' : panel.id)}
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-primary/10 hover:text-primary',
                        activeTab === panel.id && 'bg-primary text-primary-foreground'
                      )}
                    >
                      <Icon className="size-5" />
                    </button>
                  )
              })}
            </div>
        </aside>

        <div className={cn('bg-muted/40 transition-all duration-300 ease-in-out', activeTab !== 'editor' ? 'w-[320px]' : 'w-0')}>
          <div className="h-full w-full overflow-y-auto border-r">
              {activeTab === 'files' && <FileExplorerPanel />}
              {activeTab === 'chat' && <AiChatPanel />}
              {activeTab === 'settings' && <SettingsPanel />}
          </div>
        </div>

        <main className="flex-1 flex flex-col min-w-0">
          <EditorPanel />
        </main>
      </div>
  );
}