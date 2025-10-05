'use client';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Code, Terminal, GalleryVerticalEnd, Lightbulb, Loader2, Eye, FileCode } from 'lucide-react';
import { aiPoweredIntelliSense } from '@/ai/flows/ai-powered-intellisense';
import { Skeleton } from '../ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerHeader } from '../ui/drawer';
import { cn } from '@/lib/utils';
import type { editor } from 'monaco-editor';
import { KeyboardBar } from '../editor/keyboard-bar';
import { ConsolePanel } from './console-panel';
import { PreviewPanel } from './preview-panel';
import { useEditor } from '@/contexts/editor-context';
import { FileTabs } from '../editor/file-tabs';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>,
});


const components = [
    { name: 'Button', description: 'A clickable button.', snippet: '<Button>Click me</Button>' },
    { name: 'Card', description: 'A container for content.', snippet: '<Card>\n  <CardHeader>\n    <CardTitle>Card Title</CardTitle>\n  </CardHeader>\n  <CardContent>\n    <p>Card content goes here.</p>\n  </CardContent>\n</Card>' },
    { name: 'Input', description: 'A text input field.', snippet: '<Input placeholder="Email" />' },
    { name: 'Tabs', description: 'A set of tabs.', snippet: '<Tabs defaultValue="account">\n  <TabsList>\n    <TabsTrigger value="account">Account</TabsTrigger>\n    <TabsTrigger value="password">Password</TabsTrigger>\n  </TabsList>\n  <TabsContent value="account">Account content.</TabsContent>\n  <TabsContent value="password">Password content.</TabsContent>\n</Tabs>' },
];

function AiIntellisensePanel() {
  const { activeFile, getContextForAI } = useEditor();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetSuggestions = async () => {
    if (!activeFile) return;

    setIsLoading(true);
    setSuggestions([]);
    setError('');
    try {
      // The flow now receives the full context
      const result = await aiPoweredIntelliSense({
        codeSnippet: activeFile.content,
        programmingLanguage: activeFile.language,
        context: getContextForAI(),
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
          <Sparkles className="text-primary" /> MeaMind IntelliSense
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <Button onClick={handleGetSuggestions} disabled={isLoading || !activeFile} className="w-full">
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
  const { 
    files,
    activeFileId,
    activeFile,
    createFile,
    closeFile,
    setActiveFile,
    updateFileContent
  } = useEditor();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  const handleEditorDidMount = (editorInstance: editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance;
    editorInstance.focus();
  };

  const handleInsertText = (text: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = editor.getSelection();
    if (selection) {
        const id = { major: 1, minor: 1 };
        const op = {identifier: id, range: selection, text: text, forceMoveMarkers: true};
        editor.executeEdits("keyboard-bar", [op]);
    }
    
    editor.focus();
  };

  const addComponent = (componentSnippet: string) => {
    handleInsertText(componentSnippet);
    // Find and click the editor tab trigger
    const editorTabTrigger = document.querySelector('button[role="tab"][value="editor"]');
    if (editorTabTrigger instanceof HTMLElement) {
      editorTabTrigger.click();
    }
  };

  const handleNewFile = () => {
    const fileName = prompt('Nombre del archivo:', 'untitled.js');
    if (!fileName) return;

    const ext = fileName.split('.').pop()?.toLowerCase();
    let language: 'javascript' | 'python' | 'html' | 'css' | 'json' = 'javascript';
    
    if (ext === 'py') language = 'python';
    else if (ext === 'html') language = 'html';
    else if (ext === 'css') language = 'css';
    else if (ext === 'json') language = 'json';
    
    createFile(fileName, language);
  };
  
  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    fontSize: 14,
    fontFamily: "'Source Code Pro', monospace",
    minimap: { enabled: !isMobile },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    quickSuggestions: { other: true, comments: false, strings: false },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnCommitCharacter: true,
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      useShadows: false,
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
    renderLineHighlight: 'line',
    renderWhitespace: 'selection',
    occurrencesHighlight: 'off',
    mouseWheelZoom: false,
    padding: { top: 8, bottom: 8 },
  };

  if (!activeFile) {
    return (
        <div className="flex h-full flex-col items-center justify-center bg-muted/40">
            <p className="text-muted-foreground">No file open.</p>
            <Button onClick={handleNewFile} className="mt-4">Create New File</Button>
        </div>
    )
  }

  const renderEditorContent = () => (
    <div className="flex-1 flex flex-col gap-2 overflow-hidden h-full relative">
       <div className="flex-1 h-full font-code text-base resize-none rounded-lg bg-background overflow-hidden border">
         <MonacoEditor
            key={activeFile.id}
            height="100%"
            language={activeFile.language}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            value={activeFile.content}
            onChange={(value) => updateFileContent(activeFile.id, value || '')}
            onMount={handleEditorDidMount}
            options={editorOptions}
          />
       </div>
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
                <DrawerTitle className="sr-only">MeaMind IntelliSense</DrawerTitle>
             </DrawerHeader>
            <div className="p-4 pt-0 h-full">
              <AiIntellisensePanel />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <div className="w-1/3 min-w-[320px]">
          <AiIntellisensePanel />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-muted/40">
      <FileTabs 
        files={files}
        activeFileId={activeFileId}
        onFileSelect={setActiveFile}
        onFileClose={closeFile}
        onNewFile={handleNewFile}
      />
      <Tabs defaultValue="editor" className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between border-b bg-background p-2">
          <TabsList className="bg-muted">
            <TabsTrigger value="editor" className="gap-2"><FileCode size={14}/> {isMobile ? '' : 'Editor'} </TabsTrigger>
            <TabsTrigger value="console" className="gap-2"><Terminal size={14}/> {isMobile ? '' : 'Console'} </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2"><Eye size={14}/> {isMobile ? '' : 'Preview'} </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2"><GalleryVerticalEnd size={14}/> {isMobile ? '' : 'Gallery'} </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="editor" className="flex-1 m-0 p-2 overflow-hidden flex flex-col">
          <div className={cn("flex gap-2 flex-1 min-h-0", isMobile ? "flex-col" : "flex-row")}>
             {renderEditorContent()}
          </div>
           {isMobile && <KeyboardBar language={activeFile.language} onInsert={handleInsertText} />}
        </TabsContent>
        <TabsContent value="console" className="flex-1 m-0 overflow-hidden">
            <ConsolePanel file={activeFile} />
        </TabsContent>
        <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
          <PreviewPanel file={activeFile} />
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
                        <Button key={component.name} variant="outline" onClick={() => addComponent(component.snippet)} className="h-auto p-4 flex flex-col items-start text-left">
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
