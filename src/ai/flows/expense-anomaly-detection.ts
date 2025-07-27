'use server';

// 🔧 MOCK MODE: AI flows are mocked for development/testing
// Remove this comment and restore real AI calls for production

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
  console.log('🔧 MOCK: Detecting expense anomalies', input);
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2500));
  
  // Parse receipt data to determine if it's anomalous
  const receiptAmount = parseFloat(input.receiptData.match(/Amount: ([\d.]+)/i)?.[1] || '0');
  const merchantName = input.receiptData.match(/Merchant: ([^,]+)/i)?.[1] || 'Unknown';
  const category = input.receiptData.match(/Category: ([^,]+)/i)?.[1] || 'Unknown';
  
  // Generate mock anomaly detection results
  const anomalyScenarios = [
    {
      condition: () => receiptAmount > 500 || merchantName.toLowerCase().includes('luxury'),
      result: {
        anomalyDetected: true,
        explanation: `Unusual high spending of ₹${receiptAmount.toLocaleString('en-IN')} at "${merchantName}" detected. This amount is 280% higher than your average ${category.toLowerCase()} expense. Consider reviewing if this purchase aligns with your budget goals and if this was a planned expense.`
      }
    },
    {
      condition: () => receiptAmount > 200,
      result: {
        anomalyDetected: true,
        explanation: `Moderate spending alert: ₹${receiptAmount.toLocaleString('en-IN')} at "${merchantName}" is 150% above your typical ${category.toLowerCase()} expense pattern. This could impact your monthly budget if it becomes a trend. Monitor similar expenses this month to stay within budget.`
      }
    },
    {
      condition: () => merchantName.toLowerCase().includes('coffee') && receiptAmount > 50,
      result: {
        anomalyDetected: true,
        explanation: `Coffee spending anomaly: ₹${receiptAmount.toLocaleString('en-IN')} at "${merchantName}" is unusually high for a coffee purchase. Your average coffee expense is ₹25. Consider if this was a group purchase or includes additional items.`
      }
    },
    {
      condition: () => true, // Default case
      result: {
        anomalyDetected: false,
        explanation: `Normal spending pattern: ₹${receiptAmount.toLocaleString('en-IN')} at "${merchantName}" falls within your typical ${category.toLowerCase()} expense range. This purchase aligns well with your spending habits and budget allocation. Continue maintaining these healthy spending patterns.`
      }
    }
  ];

  // Find the first matching scenario
  const selectedScenario = anomalyScenarios.find(scenario => scenario.condition()) || anomalyScenarios[anomalyScenarios.length - 1];
  
  console.log('🔧 MOCK: Anomaly detection completed', { 
    anomalyDetected: selectedScenario.result.anomalyDetected,
    amount: receiptAmount,
    merchant: merchantName
  });
  
  return selectedScenario.result;
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
