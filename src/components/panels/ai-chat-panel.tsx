'use client';

import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { CornerDownLeft, Bot, User, Sparkles, Code, Terminal, Eye, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { aiChatAssistant } from '@/ai/flows/ai-chat-assistant';
import { useEditor } from '@/contexts/editor-context';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: string; // Contexto del editor en ese momento
}


export function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { 
    language, 
    consoleLogs, 
    hasErrors,
    getContextForAI,
  } = useEditor();

  // Auto-scroll cuando hay nuevos mensajes
  useEffect(() => {
    // A little delay to allow the new message to be rendered
    setTimeout(() => {
        if (scrollRef.current) {
            const viewport = scrollRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }, 100);
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const fullContext = getContextForAI();

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: input,
      timestamp: new Date(),
      context: fullContext,
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Use the existing genkit flow
      const response = await aiChatAssistant({ query: currentInput, context: fullContext });

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick actions con contexto
  const quickActions = [
    {
      icon: Code,
      label: 'Explicar código',
      prompt: 'Explica qué hace este código paso a paso',
    },
    {
      icon: Terminal,
      label: 'Fix errors',
      prompt: 'Ayúdame a resolver los errores en la console',
      disabled: !hasErrors,
    },
    {
      icon: Sparkles,
      label: 'Optimizar',
      prompt: 'Sugiere optimizaciones para este código',
    },
    {
      icon: Eye,
      label: 'Revisar',
      prompt: 'Revisa este código y sugiere mejoras',
    },
  ];

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header con estado */}
      <div className="border-b px-4 py-3 bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">AI Assistant</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {language}
            </Badge>
            {hasErrors && (
              <Badge variant="destructive" className="text-xs">
                {consoleLogs.filter(l => l.type === 'error').length} errors
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length === 0 && (
        <div className="p-4 border-b bg-background">
          <p className="text-sm text-muted-foreground mb-3">
            Acciones rápidas:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                className="justify-start gap-2 h-auto py-2"
                onClick={() => handleQuickAction(action.prompt)}
                disabled={action.disabled}
              >
                <action.icon className="h-4 w-4" />
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Sparkles className="h-12 w-12 opacity-50 mb-4" />
            <p className="text-sm mb-2">
              Pregúntame sobre tu código
            </p>
            <p className="text-xs opacity-70">
              Tengo contexto del editor, console y preview
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback>
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap font-code">{message.content}</p>
                   <p className="text-xs opacity-70 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                 {message.role === 'user' && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3">
                 <Avatar className="w-8 h-8 border">
                    <AvatarFallback>
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                <div className="bg-muted rounded-lg px-4 py-2 flex items-center space-x-2">
                   <span className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-foreground rounded-full animate-pulse"></span>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4 bg-background">
        <div className="relative flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Pregunta sobre tu código..."
            className="min-h-[60px] resize-none pr-12"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
