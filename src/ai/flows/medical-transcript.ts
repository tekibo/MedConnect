'use server';

/**
 * @fileOverview This file contains the Genkit flow for generating a medical transcript from audio.
 *
 * - generateMedicalTranscript - A function that generates a medical transcript from audio.
 * - MedicalTranscriptInput - The input type for the generateMedicalTranscript function.
 * - MedicalTranscriptOutput - The return type for the generateMedicalTranscript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicalTranscriptInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'The audio data as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'    ),
  sourceLanguage: z.string().describe('The language of the audio.'),
  targetLanguage: z.string().describe('The language to translate the transcript to.'),
});
export type MedicalTranscriptInput = z.infer<typeof MedicalTranscriptInputSchema>;

const MedicalTranscriptOutputSchema = z.object({
  transcript: z.string().describe('The translated transcript of the audio.'),
});
export type MedicalTranscriptOutput = z.infer<typeof MedicalTranscriptOutputSchema>;

export async function generateMedicalTranscript(
  input: MedicalTranscriptInput
): Promise<MedicalTranscriptOutput> {
  return generateMedicalTranscriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicalTranscriptPrompt',
  input: {schema: MedicalTranscriptInputSchema},
  output: {schema: MedicalTranscriptOutputSchema},
  prompt: `You are an expert medical transcriptionist specializing in translating medical terminology.

  You will take an audio recording and create a transcript of the last spoken words, translating it to the target language.
  Pay close attention to medical nuances and terms in the local lingo of India.
  Preserve any medical terminology and ensure accurate translation and transcription.

  Audio: {{media url=audioDataUri}}
  Source Language: {{{sourceLanguage}}}
  Target Language: {{{targetLanguage}}}

  Transcript:
  `,
});

const generateMedicalTranscriptFlow = ai.defineFlow(
  {
    name: 'generateMedicalTranscriptFlow',
    inputSchema: MedicalTranscriptInputSchema,
    outputSchema: MedicalTranscriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
