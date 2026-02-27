'use server';
/**
 * @fileOverview This file implements a Genkit flow for comparing a user's resume
 * with a job description to calculate a match percentage and identify skills.
 *
 * - matchResumeToJobDescription - A function that handles the resume to job description matching process.
 * - AiJobDescriptionMatcherInput - The input type for the matchResumeToJobDescription function.
 * - AiJobDescriptionMatcherOutput - The return type for the matchResumeToJobDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const maxDuration = 60;

const AiJobDescriptionMatcherInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The full text content of the user\u2019s resume.'),
  jobDescriptionText: z
    .string()
    .describe('The full text content of the job description.'),
});
export type AiJobDescriptionMatcherInput = z.infer<
  typeof AiJobDescriptionMatcherInputSchema
>;

const AiJobDescriptionMatcherOutputSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe('The percentage score indicating how well the resume matches the job description.'),
  matchedSkills: z
    .array(z.string())
    .describe('A list of skills found in both the resume and the job description.'),
  missingSkills: z
    .array(z.string())
    .describe('A list of skills mentioned in the job description but not found in the resume.'),
});
export type AiJobDescriptionMatcherOutput = z.infer<
  typeof AiJobDescriptionMatcherOutputSchema
>;

export async function matchResumeToJobDescription(
  input: AiJobDescriptionMatcherInput
): Promise<AiJobDescriptionMatcherOutput> {
  return aiJobDescriptionMatcherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiJobDescriptionMatcherPrompt',
  input: { schema: AiJobDescriptionMatcherInputSchema },
  output: { schema: AiJobDescriptionMatcherOutputSchema },
  prompt: `You are an expert career advisor specializing in resume optimization and job matching.
Your task is to analyze a user's resume against a given job description.

First, carefully extract all key skills, qualifications, and requirements from the job description.
Second, extract all relevant skills and experiences from the provided resume.
Third, compare these two sets of information to identify which skills from the job description are present in the resume (matched skills) and which are missing from the resume (missing skills).
Finally, calculate a match score out of 100 based on the overlap and relevance of the matched skills, considering the importance of skills highlighted in the job description.

Do not include any introductory or concluding remarks, just the JSON output.

Resume:
{{resumeText}}

Job Description:
{{jobDescriptionText}}
`,
});

const aiJobDescriptionMatcherFlow = ai.defineFlow(
  {
    name: 'aiJobDescriptionMatcherFlow',
    inputSchema: AiJobDescriptionMatcherInputSchema,
    outputSchema: AiJobDescriptionMatcherOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate output from AI model.');
    }
    return output;
  }
);
