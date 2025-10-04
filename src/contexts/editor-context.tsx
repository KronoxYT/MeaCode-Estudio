'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ConsoleLog {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  content: (string | object)[];
  timestamp: Date;
}

export type Language = 'javascript' | 'python' | 'html';

interface EditorContextType {
  // Estado del editor
  code: string;
  language: Language;
  fileName: string;
  
  // Estado de la console
  consoleLogs: ConsoleLog[];
  hasErrors: boolean;
  
  // Estado del preview
  previewError: string | null;
  
  // Acciones
  setCode: (code: string) => void;
  setLanguage: (lang: Language) => void;
  setFileName: (name: string) => void;
  addConsoleLog: (log: ConsoleLog) => void;
  clearConsoleLogs: () => void;
  setPreviewError: (error: string | null) => void;
  
  // Obtener contexto para la IA
  getContextForAI: () => string;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

const initialCode: Record<Language, string> = {
  javascript: `// Press 'Run' in the console tab to see the output!
console.log('Hello, CodeCanvas AI!');

function calculateSum(a, b) {
  // Intentionally introduce an error:
  consele.log('This will cause a reference error.');
  return a + b;
}

const user = { name: "Alex", role: "Developer" };
console.warn("This is a warning message.");
console.info("User object:", user);

calculateSum(5, 10);
`,
  python: `def greet(name):
    print(f"Hello, {name}")

greet("CodeCanvas AI")`,
  html: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
  <style>
    body { font-family: sans-serif; background-color: #f0f0f0; color: #111; }
    h1 { color: hsl(var(--primary)); }
    button {
        padding: 10px 15px;
        border: none;
        background-color: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        border-radius: 5px;
        cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>Welcome to CodeCanvas AI</h1>
  <p>This is a real-time preview!</p>
  <button onclick="alert('Button clicked!')">Click Me</button>
</body>
</html>`,
};


export function EditorProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('javascript');
  const [code, setCode] = useState(initialCode[language]);
  const [fileName, setFileName] = useState('script.js');
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const hasErrors = consoleLogs.some(log => log.type === 'error');

  const addConsoleLog = useCallback((log: ConsoleLog) => {
    setConsoleLogs(prev => [...prev, log]);
  }, []);

  const clearConsoleLogs = useCallback(() => {
    setConsoleLogs([]);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    setCode(initialCode[lang]);
    const fileNames = { javascript: 'script.js', python: 'main.py', html: 'index.html'};
    setFileName(fileNames[lang]);
  }, []);


  // Generar contexto completo para la IA
  const getContextForAI = useCallback(() => {
    const context = {
      currentFile: {
        name: fileName,
        language: language,
        code: code,
        lineCount: code.split('\n').length,
      },
      console: {
        totalLogs: consoleLogs.length,
        errors: consoleLogs.filter(l => l.type === 'error').map(l => ({
          content: l.content.join(' '),
          timestamp: l.timestamp.toISOString(),
        })),
        warnings: consoleLogs.filter(l => l.type === 'warn').length,
        hasErrors: hasErrors,
      },
      preview: {
        hasError: !!previewError,
        error: previewError,
      },
      timestamp: new Date().toISOString(),
    };

    return JSON.stringify(context, null, 2);
  }, [code, language, fileName, consoleLogs, previewError, hasErrors]);

  return (
    <EditorContext.Provider
      value={{
        code,
        language,
        fileName,
        consoleLogs,
        hasErrors,
        previewError,
        setCode,
        setLanguage,
        setFileName,
        addConsoleLog,
        clearConsoleLogs,
        setPreviewError,
        getContextForAI,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
}
