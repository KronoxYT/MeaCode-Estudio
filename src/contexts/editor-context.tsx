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

const defaultCode = `// Welcome to CodeCanvas AI!
// Press Cmd+K to open the command palette.

console.log("Hello, World!");
`;

export function EditorProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(defaultCode);
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
