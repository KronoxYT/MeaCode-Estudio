'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type Language = 'javascript' | 'python' | 'html';

interface KeyboardBarProps {
  language: Language;
  onInsert: (text: string) => void;
}

const SYMBOLS: Record<Language, string[]> = {
  javascript: ['{', '}', '(', ')', '=>', ';', '`', '$', '.', '[', ']', 'const', 'let', 'function'],
  python: [':', '_', '"', "'", '[', ']', 'def', 'class', 'import', 'from', 'if', 'for'],
  html: ['<', '>', '/', '=', '"', 'class', 'id', 'style', 'href', 'src', 'div', 'span', 'p', 'h1'],
};

export function KeyboardBar({ language, onInsert }: KeyboardBarProps) {
  const symbols = SYMBOLS[language] || SYMBOLS.javascript;

  return (
    <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-1 p-2">
          {/* Tab especial */}
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 font-mono"
            onClick={() => onInsert('  ')} // 2 espacios
          >
            TAB
          </Button>

          {/* Símbolos del lenguaje */}
          {symbols.map((symbol) => (
            <Button
              key={symbol}
              variant="ghost"
              size="sm"
              className="shrink-0 font-mono min-w-[2.5rem]"
              onClick={() => onInsert(symbol)}
            >
              {symbol}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
