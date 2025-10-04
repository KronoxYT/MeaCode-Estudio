'use client';

import { useState } from 'react';
import { Folder, File, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FileSystemItem = {
  name: string;
  type: 'folder' | 'file';
  children?: FileSystemItem[];
};

const fileTree: FileSystemItem[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'app',
        type: 'folder',
        children: [
          { name: 'globals.css', type: 'file' },
          { name: 'layout.tsx', type: 'file' },
          { name: 'page.tsx', type: 'file' },
        ],
      },
      {
        name: 'components',
        type: 'folder',
        children: [
          { name: 'ide-layout.tsx', type: 'file' },
          { name: 'command-palette.tsx', type: 'file' },
          {
            name: 'panels',
            type: 'folder',
            children: [
                { name: 'ai-chat-panel.tsx', type: 'file' },
                { name: 'editor-panel.tsx', type: 'file' },
            ]
          },
        ],
      },
      {
        name: 'lib',
        type: 'folder',
        children: [{ name: 'utils.ts', type: 'file' }],
      },
    ],
  },
  { name: 'package.json', type: 'file' },
  { name: 'README.md', type: 'file' },
  { name: 'next.config.ts', type: 'file' },
];

const TreeItem = ({ item, level = 0 }: { item: FileSystemItem; level?: number }) => {
  const [isOpen, setIsOpen] = useState(item.type === 'folder' && level < 1);
  const isFolder = item.type === 'folder';

  const handleToggle = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        className="w-full justify-start h-8"
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        onClick={handleToggle}
      >
        {isFolder && (
          <>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 mr-1 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1 shrink-0" />
            )}
            <Folder className="h-4 w-4 mr-2 text-blue-500" />
          </>
        )}
        {!isFolder && <File className="h-4 w-4 mr-2 text-muted-foreground" />}
        {item.name}
      </Button>
      <div className={cn('transition-all duration-200 ease-in-out', isOpen ? 'block' : 'hidden')}>
        {isFolder &&
          isOpen &&
          item.children?.map((child: any, index: number) => (
            <TreeItem key={index} item={child} level={level + 1} />
          ))}
      </div>
    </div>
  );
};

export default function FileExplorerPanel() {
  return (
    <div className="h-full">
      <header className="border-b p-4">
        <h2 className="font-semibold text-lg">File Explorer</h2>
      </header>
      <div className="p-2">
        {fileTree.map((item, index) => (
          <TreeItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
