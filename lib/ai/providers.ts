import "server-only";

import { createGoogleGenerativeAI, GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { customProvider } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const baseProviderOptions = {
  google: {
    thinkingConfig: {
      includeThoughts: false,
      thinkingBudget: 128, // Legacy parameter for Gemini 2.5
      // thinkingLevel: "high" // Upcoming parameter for Gemini 3
    },
  } satisfies GoogleGenerativeAIProviderOptions,
};

export const myProvider = customProvider({
  languageModels: {
    base: google("gemini-2.5-flash"),
    "theme-generation": google("gemini-2.5-flash"),
    "prompt-enhancement": google("gemini-2.5-flash"),

    // Vittima Release Preparation:
    // Once the SDK is updated to support gemini-3-pro-preview, switch the models below:
    /*
    base: google("gemini-3-pro-preview", {
      structuredOutputs: true,
      // thinkingConfig: { thinkingLevel: "high" }
    }),
    "agentic-planning": google("gemini-3-pro-preview", {
       thinkingConfig: { includeThoughts: true } // Enable for thought signatures
    }),
    */
  },
});
