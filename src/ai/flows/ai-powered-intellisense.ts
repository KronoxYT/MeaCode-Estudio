// MeaMind IntelliSense
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
    .describe('A description of any errors detected in the code snippet. Should be an empty string if no errors are detected.'),
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
  system: `You are an AI-powered code assistant integrated into an IDE. Your task is to provide real-time code completion suggestions and identify potential errors in a given code snippet. You will be provided with the code, the programming language, and optionally, the full context of the IDE (including other files, console logs, etc.).

Your response must be in a structured JSON format with two keys:
1.  'completionSuggestions': An array of strings, where each string is a plausible completion for the current code. Keep suggestions concise and relevant. If no suggestions are obvious, return an empty array.
2.  'errorDetection': A single string describing any syntax or logical errors found. If no errors are detected, this MUST be an empty string.

Behave as a silent assistant. Provide only the JSON output.`,
  prompt: `Analyze the following code snippet.

Programming Language: {{{programmingLanguage}}}

Code Snippet:
\`\`\`{{{programmingLanguage}}}
{{{codeSnippet}}}
\`\`\`
      
{{#if context}}
Full IDE Context:
{{{context}}}
{{/if}}

Based on the provided information, generate code completion suggestions and detect any errors.`,
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
