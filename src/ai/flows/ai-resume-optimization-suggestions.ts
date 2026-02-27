'use server';
/**
 * @fileOverview An AI agent that analyzes a resume and provides specific, actionable suggestions for improvement, including a job readiness score.
 *
 * - aiResumeOptimizationSuggestions - A function that handles the resume analysis and suggestion generation process.
 * - ResumeOptimizationInput - The input type for the aiResumeOptimizationSuggestions function.
 * - ResumeOptimizationOutput - The return type for the aiResumeOptimizationSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeOptimizationInputSchema = z.object({
  resumeText: z.string().describe('The full text content of the user\'s resume.'),
});
export type ResumeOptimizationInput = z.infer<typeof ResumeOptimizationInputSchema>;

const ResumeOptimizationOutputSchema = z.object({
  readinessScore: z
    .number()
    .min(0)
    .max(100)
    .describe('An overall percentage score (0-100) representing how "job-ready" the resume is based on professional standards.'),
  overallFeedback: z.string().describe('A general feedback on the resume quality and its potential for improvement.'),
  suggestions: z.array(
    z.object({
      category: z.enum([
        'Weak Summary',
        'Lack of Measurable Achievements',
        'Missing Keywords',
        'Poor Formatting',
        'ATS Optimization',
        'Action Verbs',
        'Conciseness',
        'Overall Structure',
        'Tailoring',
        'Contact Information',
        'Education',
        'Experience',
        'Skills',
      ]).describe('The category of the suggestion, e.g., Weak Summary, Missing Keywords.'),
      description: z.string().describe('A specific, actionable suggestion for improvement.'),
      beforeExample: z.string().optional().describe('An optional example of how the resume currently reads.'),
      afterExample: z.string().optional().describe('An optional example of how the improvement should look.'),
    })
  ).describe('A list of specific, actionable suggestions to improve the resume.'),
});
export type ResumeOptimizationOutput = z.infer<typeof ResumeOptimizationOutputSchema>;

export async function aiResumeOptimizationSuggestions(input: ResumeOptimizationInput): Promise<ResumeOptimizationOutput> {
  return aiResumeOptimizationSuggestionsFlow(input);
}

const resumeOptimizationPrompt = ai.definePrompt({
  name: 'resumeOptimizationPrompt',
  input: {schema: ResumeOptimizationInputSchema},
  output: {schema: ResumeOptimizationOutputSchema},
  prompt: `You are an expert career coach and resume optimization specialist. Your goal is to analyze the provided resume text and offer specific, actionable suggestions for improvement to enhance its overall quality, impact, and Applicant Tracking System (ATS) compatibility.

Your task is to:
1. Critically evaluate the resume for weak summaries, lack of measurable achievements, missing keywords, formatting issues, and overall structure.
2. Provide a 'readinessScore' between 0 and 100. A score of 100 means the resume is perfect and needs no changes. A score of 0 means it is completely missing essential sections or content.
3. Offer an overall summary of feedback.
4. Provide a list of specific, actionable suggestions with 'before' and 'after' examples where possible.

Resume Text:
{{{resumeText}}}`,
});

const aiResumeOptimizationSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiResumeOptimizationSuggestionsFlow',
    inputSchema: ResumeOptimizationInputSchema,
    outputSchema: ResumeOptimizationOutputSchema,
  },
  async (input) => {
    const {output} = await resumeOptimizationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate optimization suggestions.');
    }
    return output;
  }
);
