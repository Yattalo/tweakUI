# Vittima: Edge Features Proposal

**Status**: Proposal
**Target Release**: Vittima (Jan 2026)
**Focus**: Agentic Coding, Deep Planning, Visual Verification

This document outlines the proposed edge features for the Vittima release, leveraging the latest advancements in the Vercel AI SDK (v6), Google Gemini (Thinking Mode), and Anthropic Claude (Computer Use).

## 1. Deep Thought Planning (Gemini 2.0 Thinking)

**Concept**: Move beyond simple prompt generation to "Deep Thought Architecting".

**Technology**:
- **SDK**: `@ai-sdk/google` v3.x
- **Model**: `gemini-2.0-flash-thinking` (or `gemini-1.5-pro` with thinking params)
- **Feature**: `thinking_mode` with extended budget.

**Implementation**:
Current implementation in `lib/ai/providers.ts` disables thinking. We will create a specialized "Architect" model configuration that allocates a high token budget for reasoning before outputting the final theme structure.

```typescript
// Proposed Config in lib/ai/providers.ts
export const architectProvider = customProvider({
  languageModels: {
    architect: google("gemini-2.0-flash-thinking", {
      thinkingConfig: {
        includeThoughts: true,
        thinkingBudget: 2048, // Allocating significant budget for reasoning
      }
    }),
  },
});
```

**Benefit**: drastically improves the coherence of complex themes (e.g., "Cyberpunk dashboard with neon accents") by allowing the model to "plan" the color palette relationships before generating the JSON.

## 2. Visual Verification Agent (Claude Computer Use)

**Concept**: A "Pixel-Perfect Auditor" that sees what the user sees.

**Technology**:
- **SDK**: `@ai-sdk/anthropic` v3.x (New Dependency)
- **Model**: `claude-3-5-sonnet-20241022` (or `claude-opus-4.5`)
- **Feature**: Computer Use / Vision capabilities.

**Implementation**:
We will introduce a verification step in the theme generation pipeline. After a theme is applied (in a headless browser or preview environment), we capture a screenshot and pass it to Claude.

```typescript
import { anthropic } from "@ai-sdk/anthropic";

// The Auditor Agent
const auditor = new Agent({
  model: anthropic("claude-3-5-sonnet-latest"),
  instructions: "You are a UI auditor. Analyze the screenshot for contrast issues, spacing inconsistencies, and brand alignment.",
  tools: {
    // Tools to "fix" the theme if issues are found
    adjustColor: tool({ ... }),
  }
});
```

**Benefit**: Catches visual regressions that code-based linting misses (e.g., "Text is legible but looks ugly against this background").

## 3. Autonomous Tool Loops (Vercel AI SDK 6 Agent)

**Concept**: Self-healing scripts for theme registry generation.

**Technology**:
- **SDK**: `ai` v6.x (Upgrade from v5)
- **Feature**: `Agent` abstraction.

**Implementation**:
Upgrade `scripts/generate-theme-registry.ts` from a linear script to an autonomous agent. If the registry generation fails (e.g., invalid JSON, missing keys), the Agent captures the error, analyzes the source file, patches it, and retries automatically.

```typescript
// scripts/generate-theme-registry.ts (Concept)
import { Agent } from "ai";

const registryAgent = new Agent({
  name: "RegistryBuilder",
  model: google("gemini-2.0-flash"),
  maxSteps: 5, // Allow self-correction loops
  tools: {
    readSchema: tool(...),
    patchFile: tool(...),
  }
});

await registryAgent.run("Generate the theme registry and fix any validation errors.");
```

**Benefit**: Reduces maintenance burden for the `generate-theme-registry` script and ensures the registry is always in a valid state.

## 4. Unified Multi-Provider Grid (OpenResponses)

**Concept**: Seamlessly switch between "Fast" (Gemini Flash), "Reasoning" (Gemini Thinking), and "Visual" (Claude) models using a single API surface.

**Implementation**:
Refactor `lib/ai/providers.ts` to expose these capabilities via the new Vercel AI SDK 6 abstractions, allowing the frontend to request `mode: 'planning' | 'fast' | 'audit'` and have the backend route to the optimal provider automatically.

---

## Action Plan

1.  **Upgrade Dependencies**:
    - `ai` -> `^6.0.0`
    - `@ai-sdk/google` -> `^3.0.0`
    - Add `@ai-sdk/anthropic` -> `^3.0.0`
2.  **Refactor Providers**: Update `lib/ai/providers.ts` to support the new features.
3.  **Implement Agents**: Create `lib/ai/agents/` to house the Auditor and Architect agents.
