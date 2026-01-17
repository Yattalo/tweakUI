# Vittima Release Proposal (Target: Jan 2026)

This document outlines the proposal for the "Vittima" release of TweakCN, focusing on integrating the latest advancements in agentic coding from Google Gemini, Anthropic Claude, and the Vercel AI SDK.

## 1. Executive Summary

The Vittima release aims to transform TweakCN into a fully agentic platform by leveraging:
*   **Deep Thought Planning** using **Gemini 2.5 Flash** with extended thinking capabilities.
*   **Visual Verification** using **Claude Opus 4.5** and its **Computer Use** capabilities.
*   **Autonomous Tool Loops** powered by the new **Vercel AI SDK 6** Agent workflows.

## 2. Core Features

### 2.1 Deep Thought Planning (Gemini 2.5)

Current Status: Configured in `lib/ai/providers.ts` with `gemini-2.5-flash` and a minimal `thinkingBudget` of 128 tokens.

**Proposal:**
*   Maximize the **Thinking Budget** for the `prompt-enhancement` and `theme-generation` models to enable complex reasoning before code generation.
*   Utilize Gemini 2.5's native reasoning capabilities to create detailed execution plans before invoking tool loops.

### 2.2 Visual Verification (Claude Opus 4.5)

**New Integration Required:**
*   Add `@ai-sdk/anthropic` dependency.
*   Integrate **Claude Opus 4.5** (`claude-opus-4.5-20251124`) for tasks requiring high intelligence and visual understanding.

**Feature: Visual Regression & Verification**
*   Leverage Claude's **Computer Use** capability (Tool: `computer_20250124`) to take screenshots of the generated themes and verify they match the user's intent.
*   Use Claude's **Vision** capabilities to detect UI bugs (misalignment, contrast issues) that pure code analysis misses.

### 2.3 Autonomous Tool Loops (AI SDK 6)

**Upgrade Required:**
*   Upgrade `ai` package from `^5.0.28` to **v6.0.0+**.

**Feature: Self-Correcting Workflows**
*   Implement **Agent Workflows** using AI SDK 6's new primitives (Loop Control, Multi-Step Tools).
*   Create a "Vittima Agent" that cycles through:
    1.  **Plan**: (Gemini 2.5) Generate theme code.
    2.  **Act**: (AI SDK) Apply code to the project.
    3.  **Verify**: (Claude Opus 4.5) visually inspect the result.
    4.  **Refine**: (Gemini 2.5) Fix identified issues.

## 3. Implementation Roadmap

### Phase 1: Foundation (Immediate)
- [ ] Upgrade `ai` to version 6.x.
- [ ] Install `@ai-sdk/anthropic`.
- [ ] Update `lib/ai/providers.ts` to include the Anthropic provider.

### Phase 2: Intelligence (Short-term)
- [ ] Configure `thinkingBudget` dynamically based on task complexity.
- [ ] Create a `VisualVerificationService` using Claude Opus 4.5.

### Phase 3: Autonomy (Long-term)
- [ ] Build the `VittimaAgent` loop connecting Planning -> Coding -> Visual Verification.
- [ ] Enable "Safe Mode" where the agent proposes changes for human review before final commit.

## 4. References
*   **Vercel AI SDK 6**: Now available with enhanced Agent support.
*   **Claude Opus 4.5**: Released Nov 2025, optimized for complex agents and coding.
*   **Gemini 2.5**: Current high-speed reasoning model.
