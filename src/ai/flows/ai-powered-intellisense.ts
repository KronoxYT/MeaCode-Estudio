// AI-Powered IntelliSense
'use server';

/**
 * @fileOverview Provides AI-powered code completion and error detection.
 *
 * - aiPoweredIntelliSense - A function that suggests code completions and detects errors using AI.
 * - AIPoweredIntelliSenseInput - The input type for the aiPoweredIntelliSense function.
 * - AIPoweredIntelliSenseOutput - The return type for the aiPoweredIntelliSense function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPoweredIntelliSenseInputSchema = z.object({
  codeSnippet: z
    .string()
    .describe('The current code snippet the user is working on.'),
  programmingLanguage: z
    .string()
    .describe('The programming language of the code snippet.'),
  context: z.string().optional().describe('A JSON string representing the full IDE context.')
});
export type AIPoweredIntelliSenseInput = z.infer<
  typeof AIPoweredIntelliSenseInputSchema
>;

const AIPoweredIntelliSenseOutputSchema = z.object({
  completionSuggestions: z
    .array(z.string())
    .describe('An array of possible code completion suggestions.'),
  errorDetection: z
    .string()
    .describe('A description of any errors detected in the code snippet.'),
});
export type AIPoweredIntelliSenseOutput = z.infer<
  typeof AIPoweredIntelliSenseOutputSchema
>;

export async function aiPoweredIntelliSense(
  input: AIPoweredIntelliSenseInput
): Promise<AIPoweredIntelliSenseOutput> {
  return aiPoweredIntelliSenseFlow(input);
}

const aiPoweredIntelliSensePrompt = ai.definePrompt({
  name: 'aiPoweredIntelliSensePrompt',
  input: {schema: AIPoweredIntelliSenseInputSchema},
  output: {schema: AIPoweredIntelliSenseOutputSchema},
  prompt: `You are an AI-powered code assistant that provides code completion suggestions and error detection for the given code snippet.

      Programming Language: {{{programmingLanguage}}}
      Code Snippet:
      \`\`\`{{{programmingLanguage}}}
      {{{codeSnippet}}}
      \`\`\`
      
      {{#if context}}
      Full IDE Context:
      {{{context}}}
      {{/if}}

      Provide completion suggestions and detect any errors in the code snippet. If there are no errors, the errorDetection output should be an empty string.
      Completion Suggestions:`,
});

const aiPoweredIntelliSenseFlow = ai.defineFlow(
  {
    name: 'aiPoweredIntelliSenseFlow',
    inputSchema: AIPoweredIntelliSenseInputSchema,
    outputSchema: AIPoweredIntelliSenseOutputSchema,
  },
  async input => {
    const {output} = await aiPoweredIntelliSensePrompt(input);
    return output!;
  }
);
