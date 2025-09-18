'use client';

import { useState } from 'react';
import {
  FileCode,
  GitBranch,
  MessageSquare,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import AiChatPanel from './panels/ai-chat-panel';
import FileExplorerPanel from './panels/file-explorer-panel';
import SettingsPanel from './panels/settings-panel';
import SourceControlPanel from './panels/source-control-panel';
import { EditorPanel } from './panels/editor-panel';
import { CodeCanvasLogo } from './code-canvas-logo';

type Panel = 'files' | 'git' | 'chat' | 'settings';

export function IdeLayout() {
  const [activePanel, setActivePanel] = useState<Panel | null>('files');

  const togglePanel = (panel: Panel) => {
    setActivePanel(current => (current === panel ? null : panel));
  };

  const panels = {
    files: <FileExplorerPanel />,
    git: <SourceControlPanel />,
    chat: <AiChatPanel />,
    settings: <SettingsPanel />,
  };

  const panelIcons = {
    files: { icon: <FileCode className="size-5" />, label: 'File Explorer' },
    git: { icon: <GitBranch className="size-5" />, label: 'Source Control' },
    chat: { icon: <MessageSquare className="size-5" />, label: 'AI Chat' },
    settings: { icon: <Settings className="size-5" />, label: 'Settings' },
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen w-full bg-muted/40 text-foreground overflow-hidden">
        <aside className="flex flex-col items-center justify-between gap-4 border-r bg-background p-2">
          <div className="flex flex-col items-center gap-4">
            <div className="p-2">
              <CodeCanvasLogo className="size-6" />
            </div>
            {Object.keys(panels).map(panelId => (
              <Tooltip key={panelId}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'rounded-lg',
                      activePanel === panelId &&
                        'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                    )}
                    onClick={() => togglePanel(panelId as Panel)}
                    aria-label={panelIcons[panelId as Panel].label}
                  >
                    {panelIcons[panelId as Panel].icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  {panelIcons[panelId as Panel].label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                onClick={() => setActivePanel(activePanel ? null : 'files')}
                aria-label={activePanel ? 'Collapse Panel' : 'Expand Panel'}
              >
                {activePanel ? <PanelLeftClose /> : <PanelLeftOpen />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              {activePanel ? 'Collapse Panel' : 'Expand Panel'}
            </TooltipContent>
          </Tooltip>
        </aside>

        <div
          className={cn(
            'bg-background transition-all duration-300 ease-in-out',
            activePanel ? 'w-[320px]' : 'w-0'
          )}
        >
          {activePanel && (
            <div className="h-full w-full overflow-y-auto border-r">
              {panels[activePanel]}
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
