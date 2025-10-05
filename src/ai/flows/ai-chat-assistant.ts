'use server';

/**
 * @fileOverview Implements an AI chat assistant for answering coding questions and generating code snippets.
 *
 * - aiChatAssistant - A function that handles the AI chat assistant process.
 * - AIChatAssistantInput - The input type for the aiChatAssistant function.
 * - AIChatAssistantOutput - The return type for the aiChatAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatAssistantInputSchema = z.object({
  query: z.string().describe('The coding question or request from the user.'),
  context: z
    .string()
    .describe(
      'A JSON string containing the full context of the IDE (editor, console, etc.).'
    ),
});
export type AIChatAssistantInput = z.infer<typeof AIChatAssistantInputSchema>;

const AIChatAssistantOutputSchema = z.object({
  response: z
    .string()
    .describe("The AI assistant's response, which may include suggestion blocks."),
});
export type AIChatAssistantOutput = z.infer<
  typeof AIChatAssistantOutputSchema
>;

export async function aiChatAssistant(
  input: AIChatAssistantInput
): Promise<AIChatAssistantOutput> {
  return aiChatAssistantFlow(input);
}

// Helper function to build a dynamic system prompt
function buildSystemPrompt(context: any): string {
    const errors = (context.console?.errors || [])
      .map((log: any) => log.content)
      .join('\n');

    return `Eres un asistente de programación experto integrado en MeaCode Estudio, un IDE profesional.

CONTEXTO DEL PROYECTO:
- Archivo actual: ${context.currentFile?.name}
- Lenguaje: ${context.currentFile?.language}
- Líneas de código: ${context.currentFile?.lineCount}
- Estado: ${context.console?.hasErrors ? '❌ Con errores' : '✅ Sin errores'}

CÓDIGO ACTUAL:
\`\`\`${context.currentFile?.language}
${context.currentFile?.code}
\`\`\`

${context.console?.hasErrors ? `
ERRORES DETECTADOS:
${errors}

Tu prioridad es ayudar a resolver estos errores.
` : ''}

CAPACIDADES Y COMPORTAMIENTO:
1.  **Análisis de Código**: Identifica bugs, sugiere optimizaciones y explica código complejo.
2.  **Generación de Código**: Escribe código limpio, bien documentado y sigue las convenciones del lenguaje.
3.  **Formato de Respuestas**: Usa bloques de código markdown. Para cambios, intenta mostrar solo el código relevante.
4.  **Sugerencias de Código**: Cuando sugieras código que deba ser aplicado directamente, usa este formato EXACTO:
    \`\`\`suggestion:${context.currentFile?.language}
    [código aquí]
    \`\`\`
5.  **Fix de Errores**: Si el usuario pide corregir errores, proporciona el código COMPLETO corregido en un bloque \`\`\`suggestion\`\`\`.

REGLAS IMPORTANTES:
- NO inventes APIs.
- Sé conciso y práctico, el usuario está en un IDE.
- Si la pregunta es ambigua, pide más detalles.
`;
}


const aiChatAssistantFlow = ai.defineFlow(
  {
    name: 'aiChatAssistantFlow',
    inputSchema: AIChatAssistantInputSchema,
    outputSchema: AIChatAssistantOutputSchema,
  },
  async ({ query, context }) => {

    const parsedContext = JSON.parse(context);
    const systemPrompt = buildSystemPrompt(parsedContext);

    // We define the prompt dynamically inside the flow to inject the system prompt
    const dynamicPrompt = ai.definePrompt({
        name: 'dynamicAiChatAssistantPrompt',
        system: systemPrompt,
        input: { schema: z.string() },
        output: { schema: AIChatAssistantOutputSchema },
        prompt: `Basado en el contexto provisto en el system prompt, responde a la siguiente consulta del usuario. Sé conciso y útil.

        User Query: {{input}}`
    });
    
    const {output} = await dynamicPrompt(query);
    return output!;
  }
);
