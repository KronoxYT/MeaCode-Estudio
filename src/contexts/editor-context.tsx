'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface FileTab {
  id: string;
  name: string;
  language: 'javascript' | 'python' | 'html' | 'css' | 'json';
  content: string;
  isDirty: boolean;
}

export interface ConsoleLog {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  content: (string | object)[];
  timestamp: Date;
}

interface EditorContextType {
  // Archivos
  files: FileTab[];
  activeFileId: string;
  activeFile: FileTab | null;
  
  // Acciones de archivos
  createFile: (name: string, language: FileTab['language']) => void;
  updateFileContent: (fileId: string, content: string) => void;
  closeFile: (fileId: string) => void;
  setActiveFile: (fileId: string) => void;
  saveFile: (fileId: string) => void;
  
  // Estado de la console
  consoleLogs: ConsoleLog[];
  hasErrors: boolean;
  
  // Estado del preview
  previewError: string | null;
  
  // Acciones
  addConsoleLog: (log: ConsoleLog) => void;
  clearConsoleLogs: () => void;
  setPreviewError: (error: string | null) => void;
  
  // Obtener contexto para la IA
  getContextForAI: () => string;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileTab[]>([
    {
      id: 'default-js',
      name: 'script.js',
      language: 'javascript',
      content: 'function greet() {\n  console.log("Hello from MeaCode Estudio!");\n}\ngreet();\n',
      isDirty: false,
    },
    {
      id: 'default-html',
      name: 'index.html',
      language: 'html',
      content: '<h1>Welcome to MeaCode Estudio</h1>\n<p>Start coding!</p>',
      isDirty: false,
    },
  ]);
  const [activeFileId, setActiveFileId] = useState('default-js');
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const activeFile = files.find(f => f.id === activeFileId) || null;
  const hasErrors = consoleLogs.some(log => log.type === 'error');

  const addConsoleLog = useCallback((log: ConsoleLog) => {
    setConsoleLogs(prev => [...prev, log]);
  }, []);

  const clearConsoleLogs = useCallback(() => {
    setConsoleLogs([]);
  }, []);

  const createFile = useCallback((name: string, language: FileTab['language']) => {
    const newFile: FileTab = {
      id: `file-${Date.now()}`,
      name,
      language,
      content: '',
      isDirty: true, // New file is dirty by default
    };
    
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
  }, []);

  const updateFileContent = useCallback((fileId: string, content: string) => {
    setFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        // Only mark as dirty if content actually changed
        if (file.content !== content) {
          return { ...file, content, isDirty: true };
        }
      }
      return file;
    }));
  }, []);

  const closeFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const closingFileIndex = prev.findIndex(f => f.id === fileId);
      if (closingFileIndex === -1) return prev;

      // Ask for confirmation if file is dirty
      if (prev[closingFileIndex].isDirty) {
        if (!confirm(`You have unsaved changes in ${prev[closingFileIndex].name}. Close anyway?`)) {
          return prev;
        }
      }

      const newFiles = prev.filter(f => f.id !== fileId);
      
      // If we closed the active file, activate another one
      if (fileId === activeFileId) {
        if (newFiles.length === 0) {
          // No files left
        } else {
          // Activate the previous file, or the first one if it was the first
          const newActiveIndex = Math.max(0, closingFileIndex - 1);
          setActiveFileId(newFiles[newActiveIndex].id);
        }
      }
      
      return newFiles;
    });
  }, [activeFileId]);

  const saveFile = useCallback((fileId: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, isDirty: false }
        : file
    ));
    
    // Here you can add logic for saving to localStorage or backend
    console.log('💾 Archivo guardado:', fileId);
  }, []);

  const getContextForAI = useCallback(() => {
    const context = {
      currentFile: activeFile ? {
        name: activeFile.name,
        language: activeFile.language,
        code: activeFile.content,
        lineCount: activeFile.content.split('\n').length,
      } : null,
      openFiles: files.map(f => ({ name: f.name, language: f.language, isDirty: f.isDirty })),
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
  }, [activeFile, files, consoleLogs, previewError, hasErrors]);

  return (
    <EditorContext.Provider
      value={{
        files,
        activeFileId,
        activeFile,
        createFile,
        updateFileContent,
        closeFile,
        setActiveFile: setActiveFileId,
        saveFile,
        consoleLogs,
        hasErrors,
        previewError,
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
