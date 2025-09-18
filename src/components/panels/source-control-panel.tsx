import {
  GitBranch,
  GitCommitHorizontal,
  ArrowUp,
  ArrowDown,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function SourceControlPanel() {
  const { toast } = useToast();

  const showToast = (title: string, description: string) => {
    toast({ title, description });
  };
  
  return (
    <div className="h-full">
      <header className="border-b p-4">
        <h2 className="font-semibold text-lg">Source Control</h2>
      </header>
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Current Branch</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Select defaultValue="main">
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">main</SelectItem>
                <SelectItem value="develop">develop</SelectItem>
                <SelectItem value="feature/new-ui">feature/new-ui</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Commit Changes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input placeholder="Commit message..." />
            <Button className="w-full" onClick={() => showToast('Changes Committed', 'Your changes have been committed locally.')}>
              <GitCommitHorizontal className="mr-2 h-4 w-4" /> Commit
            </Button>
          </CardContent>
        </Card>
        
        <Card>
           <CardHeader className="pb-2">
            <CardTitle className="text-base">Sync</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => showToast('Pull Successful', 'Fetched latest changes from remote.')}>
                <ArrowDown className="mr-2 h-4 w-4" /> Pull
              </Button>
              <Button variant="outline" onClick={() => showToast('Push Successful', 'Pushed local commits to remote.')}>
                <ArrowUp className="mr-2 h-4 w-4" /> Push
              </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
