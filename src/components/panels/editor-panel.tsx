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
import { Sparkles, Code, Construction, Terminal, GalleryVerticalEnd } from 'lucide-react';
import { aiPoweredIntelliSense } from '@/ai/flows/ai-powered-intellisense';
import { Skeleton } from '../ui/skeleton';
import { Input } from '../ui/input';

type Language = 'javascript' | 'python' | 'html';

const initialCode: Record<Language, string> = {
  javascript: `function greet(name) {\n  console.log('Hello, ' + name);\n}\n\ngreet('CodeCanvas AI');`,
  python: `def greet(name):\n    print(f"Hello, {name}")\n\ngreet("CodeCanvas AI")`,
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
  <h1>Welcome to CodeCanvas AI</h1>
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

export function EditorPanel() {
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(initialCode.javascript);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [transformLoading, setTransformLoading] = useState(false);
  const [transformPrompt, setTransformPrompt] = useState('');

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
    setCode(initialCode[value]);
    setSuggestions([]);
    setError('');
  };

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

  const handleTransform = async () => {
    setTransformLoading(true);
    // In a real implementation, you would make an API call to a generative AI model
    // to transform the code based on the prompt.
    // For this example, we'll just simulate a delay and append a comment.
    await new Promise(resolve => setTimeout(resolve, 1500));
    const transformationComment = `\n\n/* AI Transformation for: "${transformPrompt}" */\n`;
    setCode(currentCode => currentCode + transformationComment);
    setTransformPrompt('');
    setTransformLoading(false);
  };
  
  const addComponent = (componentName: string) => {
    const componentSnippet = `\n// TODO: Implement ${componentName} component\n`;
    setCode(currentCode => currentCode + componentSnippet);
  };

  return (
    <div className="flex flex-col h-full bg-muted/40">
      <Tabs defaultValue="editor" className="flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b bg-background p-2">
          <TabsList className="bg-muted">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="builder">Component Transformer</TabsTrigger>
            <TabsTrigger value="gallery">Component Gallery</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={handleLanguageChange}>
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
        <TabsContent value="editor" className="flex-1 flex flex-row m-0 p-2 gap-2 overflow-hidden">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 h-full font-code text-base resize-none rounded-lg"
            placeholder="Write your code here..."
          />
          <Card className="w-1/3 flex flex-col rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="text-primary" /> AI IntelliSense
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
              <Button onClick={handleGetSuggestions} disabled={isLoading} className="w-full">
                {isLoading ? 'Analyzing...' : 'Get AI Suggestions'}
              </Button>
              <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <h3 className="font-semibold flex items-center gap-2"><Code/> Suggestions</h3>
                <ScrollArea className="flex-1 rounded-md border p-2 bg-muted/50">
                  {isLoading && Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-4 w-full my-2"/>)}
                  {!isLoading && suggestions.length > 0 ? (
                     <ul className="space-y-2 font-code text-sm">
                      {suggestions.map((s, i) => <li key={i} className="p-2 bg-background rounded">{s}</li>)}
                    </ul>
                  ) : !isLoading && <p className="text-sm text-muted-foreground text-center pt-8">No suggestions yet.</p>}
                </ScrollArea>
                <h3 className="font-semibold flex items-center gap-2"><Terminal/> Errors</h3>
                {error && <Alert variant="destructive"><AlertTitle>Error Detected</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                 {!error && !isLoading && <p className="text-sm text-muted-foreground">No errors detected.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preview" className="flex-1 m-0 p-2 overflow-hidden">
          <div className="h-full w-full bg-background rounded-lg border">
            <iframe
              srcDoc={code}
              title="Preview"
              sandbox="allow-scripts"
              className="h-full w-full"
            />
          </div>
        </TabsContent>
         <TabsContent value="builder" className="flex-1 m-0 p-2 overflow-hidden">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Construction/> Component Transformer (TRAE)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Describe the UI changes you want to make. The AI will transform your code.</p>
              <div className="space-y-2">
                <Textarea
                    value={transformPrompt}
                    onChange={(e) => setTransformPrompt(e.target.value)}
                    placeholder="e.g., 'Make the primary button bigger and change its color to blue.'"
                    className="min-h-[100px]"
                    disabled={transformLoading}
                />
                <Button onClick={handleTransform} disabled={transformLoading || !transformPrompt.trim()} className="w-full">
                    {transformLoading ? (
                        <>
                            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                            Transforming...
                        </>
                    ) : (
                        'Transform Code'
                    )}
                </Button>
              </div>
              <p className='text-sm text-muted-foreground'>
                Select a component in your code and describe how you want to change it. The AI will attempt to apply the transformation.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="gallery" className="flex-1 m-0 p-2 overflow-hidden">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><GalleryVerticalEnd /> Component Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Click to add a new component to your code.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
