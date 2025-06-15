// src/ai/flows/live-translation.ts
'use server';
/**
 * @fileOverview A flow for providing live translations during a video call.
 *
 * - translateLive - A function that handles the live translation process.
 * - TranslateLiveInput - The input type for the translateLive function.
 * - TranslateLiveOutput - The return type for the translateLive function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateLiveInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  sourceLanguage: z.string().describe('The language of the input text.'),
  targetLanguage: z.string().describe('The language to translate the text to.'),
  medicalContext: z.string().optional().describe('Context of the conversation, may contain medical terms'),
});
export type TranslateLiveInput = z.infer<typeof TranslateLiveInputSchema>;

const TranslateLiveOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateLiveOutput = z.infer<typeof TranslateLiveOutputSchema>;

export async function translateLive(input: TranslateLiveInput): Promise<TranslateLiveOutput> {
  return translateLiveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateLivePrompt',
  input: {schema: TranslateLiveInputSchema},
  output: {schema: TranslateLiveOutputSchema},
  prompt: `You are a translation expert, fluent in many languages. You are specialized in translating medical conversations including medical terms and nuances.

Translate the following text from {{sourceLanguage}} to {{targetLanguage}}.

{% if medicalContext %}
Consider the following medical context: {{medicalContext}}
{% endif %}

Text to translate: {{{text}}}`,
});

const translateLiveFlow = ai.defineFlow(
  {
    name: 'translateLiveFlow',
    inputSchema: TranslateLiveInputSchema,
    outputSchema: TranslateLiveOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
