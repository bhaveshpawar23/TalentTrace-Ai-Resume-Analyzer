'use server';
/**
 * @fileOverview An AI agent that analyzes a resume for ATS compatibility and provides a score and detailed feedback.
 *
 * - atsCompatibilityScoreGenerator - A function that handles the ATS compatibility score generation process.
 * - AtsCompatibilityScoreGeneratorInput - The input type for the atsCompatibilityScoreGenerator function.
 * - AtsCompatibilityScoreGeneratorOutput - The return type for the atsCompatibilityScoreGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AtsCompatibilityScoreGeneratorInputSchema = z.object({
  resumeText: z.string().describe('The full text content of the resume to be analyzed for ATS compatibility.'),
});
export type AtsCompatibilityScoreGeneratorInput = z.infer<typeof AtsCompatibilityScoreGeneratorInputSchema>;

const AtsCompatibilityScoreGeneratorOutputSchema = z.object({
  atsScore: z.number().describe('The overall ATS compatibility score out of 100.'),
  keywordOptimizationFeedback: z
    .string()
    .describe('Detailed feedback and suggestions for improving keyword optimization for ATS.'),
  formattingFeedback: z
    .string()
    .describe('Detailed feedback and suggestions for improving resume formatting for ATS readability.'),
  achievementsFeedback: z
    .string()
    .describe('Detailed feedback and suggestions for presenting and quantifying achievements for ATS.'),
  sectionCompletenessFeedback: z
    .string()
    .describe('Detailed feedback and suggestions for ensuring all relevant sections are complete and well-structured for ATS.'),
});
export type AtsCompatibilityScoreGeneratorOutput = z.infer<typeof AtsCompatibilityScoreGeneratorOutputSchema>;

export async function atsCompatibilityScoreGenerator(
  input: AtsCompatibilityScoreGeneratorInput
): Promise<AtsCompatibilityScoreGeneratorOutput> {
  return atsCompatibilityScoreGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'atsCompatibilityScoreGeneratorPrompt',
  input: {schema: AtsCompatibilityScoreGeneratorInputSchema},
  output: {schema: AtsCompatibilityScoreGeneratorOutputSchema},
  prompt: `You are an expert resume analyst specializing in Applicant Tracking System (ATS) compatibility.

Your task is to analyze the provided resume text for its ATS compatibility and provide a comprehensive score out of 100, along with detailed feedback for improvement in specific areas.

Consider the following factors in your analysis:
- Keyword optimization: How well are relevant keywords from job descriptions incorporated?
- Formatting: Is the resume structure clean, simple, and easily parseable by ATS? Avoid complex layouts, graphics, and unconventional fonts.
- Achievements: Are achievements quantified and impact-driven, using action verbs?
- Section completeness: Are all essential resume sections (contact info, summary/objective, experience, education, skills) present and well-organized?

Provide an overall ATS compatibility score and specific, actionable feedback for each factor to help the user optimize their resume. Ensure your feedback is constructive and highlights areas for improvement.

Resume Text:
{{{resumeText}}}`,
});

const atsCompatibilityScoreGeneratorFlow = ai.defineFlow(
  {
    name: 'atsCompatibilityScoreGeneratorFlow',
    inputSchema: AtsCompatibilityScoreGeneratorInputSchema,
    outputSchema: AtsCompatibilityScoreGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
