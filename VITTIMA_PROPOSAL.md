# Vittima Edge Features Proposal

This document outlines the proposed "Vittima" edge features for `tweakcn-next`, leveraging the newest advancements in **Vercel AI SDK 6.0** and **Google Gemini 3 / Thinking Models**.

## Executive Summary

The "Vittima" release focuses on **Agentic Coding**, **Deep Planning**, and **Visual Verification**. By upgrading to AI SDK 6 and utilizing Gemini's latest capabilities (Gemini 3), we can transform `tweakcn-next` from a theme generator into an intelligent, self-correcting design agent.

## Core Advancements Leveraged

### 1. Vercel AI SDK 6.0 (`ai@6.0.0`)
*   **`ToolLoopAgent` & `Agent` Abstraction**: Moves beyond simple text streaming to fully composable, multi-step agents that can loop through tools autonomously.
*   **Tool Execution Approval (`needsApproval`)**: Native support for "Human-in-the-Loop" workflows, critical for safe code generation and file system modifications.
*   **Unified Structured Output**: Combines tool use with structured data generation, allowing agents to perform work and then return a strictly typed result (e.g., a `Theme` object).
*   **DevTools**: Enhanced visibility into agent reasoning and tool inputs/outputs.

### 2. Google Gemini Models (Gemini 3 & 2.5)
*   **Gemini 3 Flash Preview**: The newest frontier model with specialized **agentic coding capabilities** and upgraded visual reasoning.
*   **Thinking Mode**: Exposes the model's "thought process" (`thought_tokens`), enabling a "Deep Thought" mode where the agent plans before acting.
*   **Vision & Multimodal**: Superior image understanding allows the agent to "see" the generated UI for verification.

---

## Proposed Features

### 1. Deep Thought Planning Mode
*   **Concept**: Before generating a theme, the agent enters a "Planning Phase". It analyzes the user's request, checks constraints, and outlines a step-by-step plan for the theme (colors, radius, typography).
*   **Implementation**:
    *   Use `ToolLoopAgent` configured with `gemini-3-flash-preview` (or the latest "thinking" enabled model).
    *   The agent outputs a `Plan` object (structured output).
    *   **UI**: Show the "Thinking..." state with a collapsible view of the agent's thought process (leveraging the new `thinkingConfig` or raw thought tokens).

### 2. Visual Verification Loop ("Self-Correcting Design")
*   **Concept**: The agent doesn't just guess CSS values; it verifies them.
    1.  Agent generates theme code.
    2.  System renders a hidden preview / screenshot.
    3.  Agent "looks" at the screenshot (using Gemini 3's advanced vision).
    4.  Agent compares the result against the user's prompt (e.g., "Make it high contrast").
    5.  If unsatisfied, the agent triggers a self-correction loop *before* showing the result to the user.
*   **Implementation**:
    *   `ToolLoopAgent` with a `verifyTheme` tool that accepts a screenshot.
    *   Recursive "critique-refine" loop (max 3 iterations).

### 3. Safe-Guard Execution (Human-in-the-Loop)
*   **Concept**: "Vittima" will eventually edit project files directly. This requires safety rails.
*   **Implementation**:
    *   Use AI SDK 6 `needsApproval: true` for any tool that:
        *   Writes to the filesystem (`fs.writeFile`).
        *   Executes shell commands.
    *   **UI**: The Chat UI will intercept these approval requests and present a "Confirm Action" card to the user (e.g., "Agent wants to update `theme.ts`. Allow?").

### 4. Semantic "Memory" & Reranking
*   **Concept**: The agent remembers user preferences across sessions (e.g., "I like rounded corners").
*   **Implementation**:
    *   Use AI SDK 6 `rerank` functionality to fetch relevant past design choices from a local vector store or history file.
    *   Inject these preferences into the `system` prompt dynamically.

---

## Migration Path

To unlock these features, the following steps are required:

1.  **Upgrade Dependencies**:
    ```bash
    pnpm add ai@latest @ai-sdk/google@latest @ai-sdk/react@latest
    # Run codemods if necessary
    npx @ai-sdk/codemod upgrade v6
    ```
2.  **Refactor Providers**: Update `lib/ai/providers.ts` to support the new `Agent` interfaces and switch to `gemini-3-flash-preview` for complex tasks.
3.  **Implement Agents**: Create `lib/ai/agents/planner.ts` and `lib/ai/agents/verifier.ts`.

## Conclusion

The combination of AI SDK 6's **Agents** and Gemini 3's **Thinking/Vision** models provides the perfect foundation for "Vittima". This proposal moves `tweakcn-next` towards a truly agentic workflow where the AI acts as a partner, not just a generator.
