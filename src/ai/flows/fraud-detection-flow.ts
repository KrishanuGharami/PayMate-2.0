'use server';

/**
 * @fileOverview This file defines an AI flow for detecting potentially fraudulent transactions.
 *
 * - detectFraud - A function that analyzes transaction details and returns a fraud risk assessment.
 * - FraudDetectionInput - The input type for the detectFraud function.
 * - FraudDetectionOutput - The return type for the detectFraud function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FraudDetectionInputSchema = z.object({
  amount: z.number().describe('The transaction amount.'),
  recipientId: z.string().describe("The recipient's UPI ID or account number."),
  transactionTime: z.string().describe('The time of the transaction (ISO 8601 format).'),
  userHistory: z.object({
    averageAmount: z.number().describe('The user\'s average transaction amount.'),
    commonRecipients: z.array(z.string()).describe('A list of recipients the user frequently pays.'),
    unusualLocation: z.boolean().describe('Whether the transaction is from an unusual location (mocked).'),
  }).describe('A summary of the user\'s typical transaction behavior.'),
});
export type FraudDetectionInput = z.infer<typeof FraudDetectionInputSchema>;

const FraudDetectionOutputSchema = z.object({
  isFraudulent: z.boolean().describe('Whether the transaction is flagged as potentially fraudulent.'),
  riskScore: z.number().min(0).max(100).describe('A risk score from 0 (low) to 100 (high).'),
  reason: z.string().describe('A brief explanation for the fraud assessment.'),
});
export type FraudDetectionOutput = z.infer<typeof FraudDetectionOutputSchema>;

export async function detectFraud(input: FraudDetectionInput): Promise<FraudDetectionOutput> {
  return fraudDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fraudDetectionPrompt',
  input: {schema: FraudDetectionInputSchema},
  output: {schema: FraudDetectionOutputSchema},
  prompt: `You are an advanced AI fraud detection engine for the "PayMate 2.0" digital payment platform. Your task is to analyze the following transaction details and determine if it is potentially fraudulent.

  **Analysis Criteria:**
  1.  **High Amount:** Is the transaction amount significantly higher than the user's average?
  2.  **New Recipient:** Is the recipient new and not in the user's list of common recipients?
  3.  **Unusual Time/Location:** Does the transaction occur at an odd time (e.g., late at night) or from an unusual location?
  4.  **Combination of Factors:** A combination of the above factors increases the risk.

  **Transaction Details:**
  - Amount: {{{amount}}}
  - Recipient: {{{recipientId}}}
  - Time: {{{transactionTime}}}
  - User's Average Amount: {{{userHistory.averageAmount}}}
  - User's Common Recipients: {{#each userHistory.commonRecipients}}{{{this}}}, {{/each}}
  - From Unusual Location: {{{userHistory.unusualLocation}}}

  **Your Task:**
  Based on the criteria and transaction details, determine if the transaction is fraudulent.
  - Set \`isFraudulent\` to \`true\` if you have a high suspicion.
  - Provide a \`riskScore\` between 0 and 100.
  - Briefly explain your reasoning in the \`reason\` field. For example, "High-value transaction to an unknown recipient." or "Transaction is consistent with user's normal activity."
  `,
});

const fraudDetectionFlow = ai.defineFlow(
  {
    name: 'fraudDetectionFlow',
    inputSchema: FraudDetectionInputSchema,
    outputSchema: FraudDetectionOutputSchema,
  },
  async input => {
    // For prototype purposes, let's add a hardcoded rule.
    // If the amount is over 10000 and the recipient is new, flag it.
    if (input.amount > 10000 && !input.userHistory.commonRecipients.includes(input.recipientId)) {
        return {
            isFraudulent: true,
            riskScore: 95,
            reason: "High-value transaction to a new, unknown recipient flagged by internal rule."
        };
    }

    const {output} = await prompt(input);
    return output!;
  }
);
