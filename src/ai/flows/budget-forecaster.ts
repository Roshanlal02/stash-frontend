// budget-forecaster.ts
'use server';

// 🔧 MOCK MODE: AI flows are mocked for development/testing
// Remove this comment and restore real AI calls for production

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
  console.log('🔧 MOCK: Generating budget forecast', input);
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
  
  // Generate mock forecasts based on different scenarios
  const mockForecasts = [
    {
      forecast: "Based on your recent spending patterns, you're projected to spend approximately ₹28,500 next month. Your grocery spending shows a consistent pattern at ₹8,200 monthly, while your entertainment expenses have increased by 15% this quarter. Consider setting aside ₹5,000 for unexpected expenses.",
      savingApproaches: "1. Implement the 50/30/20 rule: 50% needs, 30% wants, 20% savings. 2. Use automated transfers to move ₹3,000 monthly to a high-yield savings account immediately after payday. 3. Review and cancel unused subscriptions - you could save ₹1,200 monthly. 4. Try meal planning to reduce food waste and eating out expenses by 25%."
    },
    {
      forecast: "Your spending velocity indicates a monthly burn rate of ₹32,000, with seasonal increases during festive months. Your current trajectory suggests you'll need ₹35,500 for next month's expenses, including a 10% buffer for inflation. Your transportation costs are well-optimized, but dining expenses show room for improvement.",
      savingApproaches: "1. Create separate sinking funds for annual expenses like insurance and taxes. 2. Use the envelope budgeting method for variable expenses like dining and entertainment. 3. Set up automatic investments of ₹4,000 monthly in diversified mutual funds. 4. Challenge yourself to reduce discretionary spending by 20% through mindful purchasing decisions."
    },
    {
      forecast: "Analyzing your receipt history reveals efficient spending habits with occasional impulse purchases. Your projected monthly expenses are ₹26,800, showing a 12% improvement from last quarter. Your grocery-to-dining ratio is healthy at 3:1, indicating good financial discipline.",
      savingApproaches: "1. Maximize your emergency fund to cover 6 months of expenses (target: ₹1,60,800). 2. Implement a 24-hour rule for purchases over ₹2,000 to reduce impulse buying. 3. Use cashback credit cards for regular expenses and pay off balances monthly. 4. Consider increasing your SIP investments by ₹1,500 monthly to accelerate wealth building."
    }
  ];

  // Randomly select a forecast
  const selectedForecast = mockForecasts[Math.floor(Math.random() * mockForecasts.length)];
  
  console.log('🔧 MOCK: Budget forecast generated successfully');
  
  return selectedForecast;
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
