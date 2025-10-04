'use client';
import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Code, Terminal, GalleryVerticalEnd, Lightbulb } from 'lucide-react';
import { aiPoweredIntelliSense } from '@/ai/flows/ai-powered-intellisense';
import { Skeleton } from '../ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerHeader } from '../ui/drawer';
import { cn } from '@/lib/utils';

type Language = 'javascript' | 'python' | 'html';

const initialCode: Record<Language, string> = {
  javascript: `function greet(name) {\n  console.log('Hello, ' + name);\n}\n\ngreet('MeaCore Studio');`,
  python: `def greet(name):\n    print(f"Hello, {name}")\n\ngreet("MeaCore Studio")`,
  html: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
  <style>
    body { font-family: sans-serif; background-color: #f0f0f0; }
    h1 { color: hsl(var(--primary)); }
  </style>
</head>
<body>
  <h1>Welcome to MeaCore Studio</h1>
  <p>This is a real-time preview!</p>
</body>
</html>`,
};

const components = [
    { name: 'Button', description: 'A clickable button.' },
    { name: 'Card', description: 'A container for content.' },
    { name: 'Input', description: 'A text input field.' },
    { name: 'Tabs', description: 'A set of tabs.' },
];

function AiIntellisensePanel({ code, language }: { code: string; language: Language }) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setSuggestions([]);
    setError('');
    try {
      const result = await aiPoweredIntelliSense({
        codeSnippet: code,
        programmingLanguage: language,
      });
      setSuggestions(result.completionSuggestions);
      setError(result.errorDetection);
    } catch (e) {
      setError('Failed to get AI suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col rounded-lg h-full border-0 shadow-none bg-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="text-primary" /> AI IntelliSense
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <Button onClick={handleGetSuggestions} disabled={isLoading} className="w-full">
          {isLoading ? 'Analyzing...' : 'Get AI Suggestions'}
        </Button>
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <h3 className="font-semibold flex items-center gap-2 text-sm"><Code size={16}/> Suggestions</h3>
          <ScrollArea className="flex-1 rounded-md border p-2 bg-muted/50 max-h-48">
            {isLoading && Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-4 w-full my-2"/>)}
            {!isLoading && suggestions.length > 0 ? (
               <ul className="space-y-2 font-code text-sm">
                {suggestions.map((s, i) => <li key={i} className="p-2 bg-background rounded">{s}</li>)}
              </ul>
            ) : !isLoading && <p className="text-xs text-muted-foreground text-center pt-8">No suggestions yet.</p>}
          </ScrollArea>
          <h3 className="font-semibold flex items-center gap-2 text-sm"><Terminal size={16}/> Errors</h3>
          {error ? <Alert variant="destructive" className="text-xs"><AlertTitle className="text-sm">Error Detected</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
          : !isLoading && <p className="text-xs text-muted-foreground">No errors detected.</p>
          }
        </div>
      </CardContent>
    </Card>
  )
}

export function EditorPanel() {
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(initialCode.javascript);
  const isMobile = useIsMobile();
  
  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
    setCode(initialCode[value]);
  };
  
  const addComponent = (componentName: string) => {
    const componentSnippet = `\n// TODO: Implement ${componentName} component\n`;
    setCode(currentCode => currentCode + componentSnippet);
  };

  const renderEditorContent = () => (
    <div className="flex-1 flex flex-col gap-2 overflow-hidden h-full relative">
      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 h-full font-code text-base resize-none rounded-lg bg-background"
        placeholder="Write your code here..."
      />
      {isMobile ? (
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="absolute bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
            >
              <Lightbulb className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
             <DrawerHeader>
                <DrawerTitle className="sr-only">AI IntelliSense</DrawerTitle>
             </DrawerHeader>
            <div className="p-4 pt-0 h-full">
              <AiIntellisensePanel code={code} language={language} />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <div className="w-1/3 min-w-[320px]">
          <AiIntellisensePanel code={code} language={language} />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-muted/40">
      <Tabs defaultValue="editor" className="flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b bg-background p-2">
          <TabsList className="bg-muted">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={(lang) => handleLanguageChange(lang as Language)}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <TabsContent value="editor" className="flex-1 m-0 p-2 overflow-hidden">
          <div className={cn("flex gap-2 h-full", isMobile ? "flex-col" : "flex-row")}>
             {renderEditorContent()}
          </div>
        </TabsContent>
        <TabsContent value="preview" className="flex-1 m-0 p-2 overflow-hidden">
          <div className="h-full w-full bg-background rounded-lg border">
            <iframe
              srcDoc={language === 'html' ? code : '<h1>Preview is only available for HTML</h1>'}
              title="Preview"
              sandbox="allow-scripts"
              className="h-full w-full"
            />
          </div>
        </TabsContent>
        <TabsContent value="gallery" className="flex-1 m-0 p-2 overflow-hidden">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><GalleryVerticalEnd /> Component Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Click to add a new component to your code.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {components.map(component => (
                        <Button key={component.name} variant="outline" onClick={() => addComponent(component.name)} className="h-auto p-4 flex flex-col items-start text-left">
                            <span className="font-semibold">{component.name}</span>
                            <p className="mt-1 text-xs text-muted-foreground">{component.description}</p>
                        </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
