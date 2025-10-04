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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import AiChatPanel from './panels/ai-chat-panel';
import FileExplorerPanel from './panels/file-explorer-panel';
import SettingsPanel from './panels/settings-panel';
import SourceControlPanel from './panels/source-control-panel';
import { EditorPanel } from './panels/editor-panel';
import { CodeCanvasLogo } from './code-canvas-logo';
import { MeaCodePanel } from './panels/mea-code-panel';

type PanelId = 'files' | 'git' | 'chat' | 'settings';

const panels = {
  files: {
    icon: FileCode,
    label: 'File Explorer',
    component: <FileExplorerPanel />,
  },
  git: {
    icon: GitBranch,
    label: 'Source Control',
    component: <SourceControlPanel />,
  },
  chat: {
    icon: MessageSquare,
    label: 'AI Chat',
    component: <AiChatPanel />,
  },
  settings: {
    icon: Settings,
    label: 'Settings',
    component: <SettingsPanel />,
  },
};

export function IdeLayout() {
  const [activePanel, setActivePanel] = useState<PanelId | null>('files');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMeaCodeActive, setIsMeaCodeActive] = useState(false);
  const isMobile = useIsMobile();

  const togglePanel = (panelId: PanelId) => {
    setActivePanel(current => {
      if (current === panelId && isSidebarOpen) {
        setIsSidebarOpen(false);
        return current;
      }
      setIsSidebarOpen(true);
      return panelId;
    });
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  if (isMeaCodeActive) {
    return <MeaCodePanel onClose={() => setIsMeaCodeActive(false)} />;
  }

  const renderSidebarContent = () => (
    <div className="flex flex-col items-center justify-between h-full bg-background p-2 border-r">
      <div className="flex flex-col items-center gap-2">
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
        {Object.keys(panels).map(panelId => {
          const panel = panels[panelId as PanelId];
          const Icon = panel.icon;
          return (
            <Tooltip key={panelId}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'rounded-lg w-10 h-10',
                    activePanel === panelId && isSidebarOpen &&
                      'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                  )}
                  onClick={() => togglePanel(panelId as PanelId)}
                  aria-label={panel.label}
                >
                  <Icon className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                {panel.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
       <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="mt-auto rounded-lg"
            onClick={closeSidebar}
            aria-label={'Collapse Panel'}
          >
            <PanelLeftClose />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          {'Collapse Panel'}
        </TooltipContent>
      </Tooltip>
    </div>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen w-full bg-muted/40 text-foreground overflow-hidden">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="absolute top-2 left-2 z-10">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <SheetHeader>
                <SheetTitle className="sr-only">Main Menu</SheetTitle>
              </SheetHeader>
              {renderSidebarContent()}
            </SheetContent>
          </Sheet>
        ) : (
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
              {Object.keys(panels).map(panelId => {
                 const panel = panels[panelId as PanelId];
                 const Icon = panel.icon;
                return (
                <Tooltip key={panelId}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'rounded-lg',
                        activePanel === panelId && isSidebarOpen &&
                          'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                      )}
                      onClick={() => togglePanel(panelId as PanelId)}
                      aria-label={panel.label}
                    >
                      <Icon className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    {panel.label}
                  </TooltipContent>
                </Tooltip>
              )})}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-auto rounded-lg"
                  onClick={() => setIsSidebarOpen(prev => !prev)}
                  aria-label={isSidebarOpen ? 'Collapse Panel' : 'Expand Panel'}
                >
                  {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                {isSidebarOpen ? 'Collapse Panel' : 'Expand Panel'}
              </TooltipContent>
            </Tooltip>
          </aside>
        )}

        <div
          className={cn(
            'bg-background transition-all duration-300 ease-in-out',
            isSidebarOpen && !isMobile ? 'w-[320px]' : 'w-0'
          )}
        >
          {isSidebarOpen && activePanel && (
            <div className="h-full w-full overflow-y-auto border-r">
              {panels[activePanel].component}
            </div>
          )}
        </div>

        <main className={cn('flex-1 flex flex-col min-w-0', isMobile ? 'pt-14' : '')}>
          <EditorPanel />
        </main>
      </div>
    </TooltipProvider>
  );
}
