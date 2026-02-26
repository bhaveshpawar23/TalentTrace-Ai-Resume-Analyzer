'use server';
/**
 * @fileOverview An AI agent that analyzes a resume and provides specific, actionable suggestions for improvement.
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

Critically evaluate the resume for:
- Weak or generic summaries.
- Lack of measurable achievements (quantify accomplishments).
- Missing or improperly used keywords (for ATS).
- Poor formatting or readability issues.
- Ineffective use of action verbs.
- Overall structure and conciseness.

For each identified area, provide a clear suggestion. If applicable, include 'before' and 'after' examples to illustrate the improvement.

Use the following structure for your output, ensuring each suggestion includes a 'category', 'description', and optional 'beforeExample' and 'afterExample'. The categories should be specific to the type of improvement (e.g., 'Weak Summary', 'Lack of Measurable Achievements', 'Missing Keywords', 'Poor Formatting', 'ATS Optimization', 'Action Verbs').

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
    return output!;
  }
);
