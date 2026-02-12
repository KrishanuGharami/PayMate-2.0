'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating images from text prompts.
 *
 * - generateImage - A function that takes a text prompt and returns an image data URI.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('A detailed text description of the image to generate.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI (e.g., 'data:image/png;base64,...')."),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async ({prompt}) => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: prompt,
    });

    if (!media?.url) {
      throw new Error('Image generation failed to return media.');
    }

    return {imageDataUri: media.url};
  }
);


/**
 * Below is a sample prompt for generating an image of the Waterfall SDLC model,
 * based on the provided description. This can be passed to the `generateImage` function.
 * 
 * To use this, you would call:
 * generateImage({ prompt: WATERFALL_SDLC_PROMPT });
 */
export const WATERFALL_SDLC_PROMPT = `
  Create a visual metaphor for the Waterfall SDLC model applied to the "PayMate 2.0" financial app project.

  The image should depict a literal, massive waterfall, with each cascading level representing a distinct, separate phase of development. The water should flow strictly downwards, from top to bottom, with no way to go back up, symbolizing the model's inflexibility.

  1.  **Top Level (Requirements):** The water source starts here. Show illustrated scrolls and documents detailing every feature upfront: login/signup forms, all bill payment categories (Mobile, Electricity, etc.), and the precise flows for UPI, Bank Transfer, and QR code payments. The full dialogue for the AI chatbot is also scripted here. The "PayMate 2.0" logo is clearly visible on the documents.

  2.  **Second Level (Design):** The water crashes into this pool. Floating in the water are polished, finalized UI/UX wireframes and mockups of all PayMate 2.0 app screens (Dashboard, Transfer, Bills, History, Support). The designs look rigid and unchangeable.

  3.  **Third Level (Implementation):** The water flows down. This level shows developers at workstations, with glowing blue screens full of code, building the entire frontend and backend of the PayMate 2.0 app exactly as specified in the design documents from the level above.

  4.  **Fourth Level (Testing):** The water continues its descent. Here, show magnifying glasses over the app screens, with red bug icons being found. A QA tester looks frustrated because they've found a critical issue but can't send it back "up" the waterfall to the developers easily.

  5.  **Bottom Pool (Deployment):** The waterfall ends in a final, placid pool where a fully formed, but potentially flawed, PayMate 2.0 app is delivered on a smartphone screen to an end-user.

  The overall style should be a clear, slightly stylized illustration with a cool color palette (blues, greys) to match the "PayMate 2.0" branding. Emphasize the linear, unchangeable, top-to-bottom flow.
`;
