'use client';

import { useState } from 'react';
import {
  FileCode,
  GitBranch,
  MessageSquare,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  File as FileIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
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
const SourceControlPanel = dynamic(() => import('./panels/source-control-panel'), {
  loading: () => <div className="p-4"><Skeleton className="h-20 w-full" /></div>,
});


type PanelId = 'editor' | 'chat' | 'files' | 'settings';

const panels = {
  editor: { icon: FileIcon, label: 'Editor' },
  chat: { icon: MessageSquare, label: 'AI Chat' },
  files: { icon: FileCode, label: 'File Explorer' },
  settings: { icon: Settings, label: 'Settings' },
};

export function IdeLayout() {
  const [isMeaCodeActive, setIsMeaCodeActive] = useState(false);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<PanelId>('editor');

  if (isMeaCodeActive) {
    return <MeaCodePanel onClose={() => setIsMeaCodeActive(false)} />;
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="flex h-screen w-full flex-col bg-muted/40">
        <header className="flex h-14 items-center justify-between border-b bg-background px-4">
           <Button variant="ghost" size="icon" className="p-2" onClick={() => setIsMeaCodeActive(true)}>
              <CodeCanvasLogo className="size-6" />
           </Button>
           <h1 className="text-lg font-semibold">CodeCanvas AI</h1>
           <div></div>
        </header>
        <main className="flex-1 overflow-hidden">
          {activeTab === 'editor' && <EditorPanel />}
          {activeTab === 'chat' && <AiChatPanel />}
          {activeTab === 'files' && <FileExplorerPanel />}
          {activeTab === 'settings' && <SettingsPanel />}
        </main>
        <footer className="border-t bg-background">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PanelId)} className="w-full">
            <TabsList className="grid h-full w-full grid-cols-4 rounded-none">
              {Object.keys(panels).map(panelId => {
                const panel = panels[panelId as PanelId];
                const Icon = panel.icon;
                return (
                  <TabsTrigger key={panelId} value={panelId} className="flex-col gap-1 py-2 h-auto data-[state=active]:bg-primary/10">
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
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen w-full bg-muted/40 text-foreground overflow-hidden">
        <aside className="flex flex-col items-center justify-between gap-4 border-r bg-background p-2">
            <div className="flex flex-col items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-2"
                    onClick={() => setIsMeaCodeActive(true)}
                    aria-label="Enter MeaCode Mode"
                  >
                    <CodeCanvasLogo className="size-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  MeaCode (Modo Solo)
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn('rounded-lg', activeTab === 'files' && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground')}
                      onClick={() => setActiveTab('files')}
                      aria-label="File Explorer"
                    >
                      <FileCode className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    File Explorer
                  </TooltipContent>
              </Tooltip>
               <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn('rounded-lg', activeTab === 'chat' && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground')}
                      onClick={() => setActiveTab('chat')}
                      aria-label="AI Chat"
                    >
                      <MessageSquare className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    AI Chat
                  </TooltipContent>
              </Tooltip>
               <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn('rounded-lg', activeTab === 'settings' && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground')}
                      onClick={() => setActiveTab('settings')}
                      aria-label="Settings"
                    >
                      <Settings className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    Settings
                  </TooltipContent>
              </Tooltip>
            </div>
             <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="mt-auto rounded-lg" onClick={() => setActiveTab('editor')}>
                  <PanelLeftClose />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Close Panel
              </TooltipContent>
            </Tooltip>
        </aside>

        <div className={cn('bg-background transition-all duration-300 ease-in-out', activeTab !== 'editor' ? 'w-[320px]' : 'w-0')}>
          {activeTab !== 'editor' && (
            <div className="h-full w-full overflow-y-auto border-r">
                {activeTab === 'files' && <FileExplorerPanel />}
                {activeTab === 'chat' && <AiChatPanel />}
                {activeTab === 'settings' && <SettingsPanel />}
            </div>
          )}
        </div>

        <main className="flex-1 flex flex-col min-w-0">
          <EditorPanel />
        </main>
      </div>
    </TooltipProvider>
  );
}

    