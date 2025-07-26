'use server';

/**
 * @fileOverview Expense Anomaly Detection AI agent.
 *
 * - detectExpenseAnomaly - A function that detects anomalies in user expenses.
 * - DetectExpenseAnomalyInput - The input type for the detectExpenseAnomaly function.
 * - DetectExpenseAnomalyOutput - The return type for the detectExpenseAnomaly function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectExpenseAnomalyInputSchema = z.object({
  receiptData: z
    .string()
    .describe('Data from the user uploaded receipts, including merchant, date, amount, and category.'),
  spendingPatterns: z
    .string()
    .describe('User spending patterns, including frequency, amount, and category of expenses.'),
});
export type DetectExpenseAnomalyInput = z.infer<typeof DetectExpenseAnomalyInputSchema>;

const DetectExpenseAnomalyOutputSchema = z.object({
  anomalyDetected: z.boolean().describe('Whether an anomaly is detected in the user expenses.'),
  explanation: z
    .string()
    .describe('Explanation of the anomaly detected, including the reason and potential impact.'),
});
export type DetectExpenseAnomalyOutput = z.infer<typeof DetectExpenseAnomalyOutputSchema>;

export async function detectExpenseAnomaly(input: DetectExpenseAnomalyInput): Promise<DetectExpenseAnomalyOutput> {
  return detectExpenseAnomalyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectExpenseAnomalyPrompt',
  input: {schema: DetectExpenseAnomalyInputSchema},
  output: {schema: DetectExpenseAnomalyOutputSchema},
  prompt: `You are an expert financial analyst specializing in detecting anomalies in user expenses.

You will use the receipt data and user spending patterns to determine if there are any unusual expenses.

Receipt Data: {{{receiptData}}}
Spending Patterns: {{{spendingPatterns}}}

Based on the provided data, determine if an anomaly is detected in the user expenses and provide an explanation of the anomaly, including the reason and potential impact.`,
});

const detectExpenseAnomalyFlow = ai.defineFlow(
  {
    name: 'detectExpenseAnomalyFlow',
    inputSchema: DetectExpenseAnomalyInputSchema,
    outputSchema: DetectExpenseAnomalyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
