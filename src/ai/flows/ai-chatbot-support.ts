'use server';

/**
 * @fileOverview This file defines an AI chatbot support flow that assists users with common queries, FAQs, or transaction issues.
 *
 * - aiChatbotSupport - A function that handles user queries and provides support.
 * - AIChatbotSupportInput - The input type for the aiChatbotSupport function.
 * - AIChatbotSupportOutput - The return type for the aiChatbotSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatbotSupportInputSchema = z.object({
  query: z.string().describe('The user query or question.'),
  transactionDetails: z.optional(z.string()).describe('Optional details about the transaction, if applicable.'),
});

export type AIChatbotSupportInput = z.infer<typeof AIChatbotSupportInputSchema>;

const AIChatbotSupportOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user query.'),
  escalateToHuman: z.boolean().describe('Indicates whether the query should be escalated to a human support agent.'),
});

export type AIChatbotSupportOutput = z.infer<typeof AIChatbotSupportOutputSchema>;

export async function aiChatbotSupport(input: AIChatbotSupportInput): Promise<AIChatbotSupportOutput> {
  return aiChatbotSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotSupportPrompt',
  input: {schema: AIChatbotSupportInputSchema},
  output: {schema: AIChatbotSupportOutputSchema},
  prompt: `You are a helpful AI chatbot for the "PayMate 2.0" web application. Your goal is to assist users by answering their questions about the app's features and guiding them to the correct pages to perform actions.

  Here is a summary of the application's functionalities:

  **Application Pages & Features:**

  *   **Dashboard (/dashboard):**
      *   View your current account balance.
      *   Perform a quick money transfer using a UPI ID.
      *   See a list of recent transactions.
      *   Get smart suggestions for payments and recharges.

  *   **Transfer (/transfer):**
      *   Send money to a recipient's UPI ID.
      *   Transfer funds to a bank account using account number and IFSC code.
      *   Scan a QR code to make a payment.

  *   **Bills & Recharges (/bills):**
      *   Pay for various services like Mobile Recharge, Broadband, DTH, Water, Electricity, Gas, and more.

  *   **History (/history):**
      *   View a detailed history of all your past transactions.
      *   Filter transactions by type, status, or date.
      *   Download your account statement.

  *   **Support (/support):**
      *   This is the page you are currently on, where you can chat with me for help.

  **Your Task:**

  1.  Analyze the user's query to understand their intent.
  2.  Provide a clear and concise answer based on the application's features listed above.
  3.  If the user wants to perform an action, guide them to the correct page. For example, if they ask "how to send money to a bank account?", you should tell them to go to the "Transfer" page and use the "Bank Account" tab.
  4.  If the query is about a specific transaction, use the provided transaction details to assist the user.
  5.  If you cannot resolve the issue or if it requires human intervention (e.g., a failed transaction that you can't explain, a request to speak to a human), set \`escalateToHuman\` to \`true\` and provide a friendly message saying that a support agent will be in touch.
  6.  Always be polite and professional.

  **User's Request:**

  User Query: {{{query}}}
  {{#if transactionDetails}}
  Transaction Details: {{{transactionDetails}}}
  {{/if}}
  `,
});

const aiChatbotSupportFlow = ai.defineFlow(
  {
    name: 'aiChatbotSupportFlow',
    inputSchema: AIChatbotSupportInputSchema,
    outputSchema: AIChatbotSupportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
