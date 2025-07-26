// budget-forecaster.ts
'use server';
/**
 * @fileOverview Budget forecasting AI agent.
 *
 * - budgetForecaster - A function that handles the budget forecasting process.
 * - BudgetForecasterInput - The input type for the budgetForecaster function.
 * - BudgetForecasterOutput - The return type for the budgetForecaster function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetForecasterInputSchema = z.object({
  receiptHistory: z
    .string()
    .describe(
      'A string containing the user\u0027s receipt history.  Each receipt should be separated by a newline. Each receipt should include the date, the merchant, and the amount.'
    ),
  spendingPatterns: z.string().describe('The user\u0027s spending patterns.'),
});
export type BudgetForecasterInput = z.infer<typeof BudgetForecasterInputSchema>;

const BudgetForecasterOutputSchema = z.object({
  forecast: z.string().describe('A forecast of the user\u0027s budget.'),
  savingApproaches: z
    .string()
    .describe('Suggested saving approaches based on the forecast.'),
});
export type BudgetForecasterOutput = z.infer<typeof BudgetForecasterOutputSchema>;

export async function budgetForecaster(
  input: BudgetForecasterInput
): Promise<BudgetForecasterOutput> {
  return budgetForecasterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetForecasterPrompt',
  input: {schema: BudgetForecasterInputSchema},
  output: {schema: BudgetForecasterOutputSchema},
  prompt: `You are a personal finance advisor.  You will be provided with a user's receipt history and spending patterns.

You will use this information to forecast the user's budget and suggest saving approaches.

Receipt History:
{{receiptHistory}}

Spending Patterns:
{{spendingPatterns}}`,
});

const budgetForecasterFlow = ai.defineFlow(
  {
    name: 'budgetForecasterFlow',
    inputSchema: BudgetForecasterInputSchema,
    outputSchema: BudgetForecasterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
