import { Folder, File, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fileTree = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'components',
        type: 'folder',
        children: [{ name: 'button.tsx', type: 'file' }, { name: 'card.tsx', type: 'file' }],
      },
      { name: 'app.tsx', type: 'file' },
      { name: 'index.css', type: 'file' },
    ],
  },
  { name: 'package.json', type: 'file' },
  { name: 'README.md', type: 'file' },
];

const TreeItem = ({ item, level = 0 }: { item: any; level?: number }) => {
  const isFolder = item.type === 'folder';
  return (
    <div>
      <Button
        variant="ghost"
        className="w-full justify-start h-8"
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
      >
        {isFolder && (
          <>
            <ChevronDown className="h-4 w-4 mr-1 shrink-0" />
            <Folder className="h-4 w-4 mr-2 text-blue-500" />
          </>
        )}
        {!isFolder && <File className="h-4 w-4 mr-2 text-gray-500" />}
        {item.name}
      </Button>
      {isFolder &&
        item.children.map((child: any, index: number) => (
          <TreeItem key={index} item={child} level={level + 1} />
        ))}
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
