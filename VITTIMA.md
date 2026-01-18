# Vittima: The Agentic Coding Release
**Target: January 2026**

## Overview
Vittima represents the shift from "copilot" to "autonomous agent" in TweekUI development. Leveraging the latest advancements in Vercel AI SDK 6 (installed v6.0.39), Gemini 2.5 Flash, and Claude Opus 4.5, we propose a new "Deep Planning & Verification" workflow.

**Verification Status:**
*   **Gemini 2.5 Flash**: Verified available as of Jan 16, 2026. Features "thinking capabilities" and 1M+ token context [Source: Google Cloud Vertex AI Docs].
*   **Claude Opus 4.5**: Verified partner model on Vertex AI Model Garden.
*   **Vercel AI SDK**: Upgraded to v6 to support the new `Agent` primitives.

## Core Pillars & Edge Features

### 1. Deep Thought Planning (Gemini 2.5 Flash)
*   **Feature: The Architectural Sentinel**
    *   **Concept**: A background agent that monitors the entire codebase state using Gemini's 1M+ token context window.
    *   **Mechanism**: Before any code is written, Gemini "thinks" (using the new `thinkingConfig`) through the implications of changes across the entire dependency graph.
    *   **Benefit**: Prevents architectural drift and circular dependencies before they occur.
*   **Feature: Predictive State Modeling**
    *   **Concept**: Simulation of state changes in complex React trees.
    *   **Mechanism**: Gemini generates a "state transition graph" for new features, identifying potential race conditions or re-render loops during the planning phase.

### 2. Visual Verification (Claude Opus 4.5)
*   **Feature: Self-Healing UI Agents**
    *   **Concept**: An agent capable of "seeing" the rendered UI and fixing visual regressions.
    *   **Mechanism**:
        *   Uses Claude's "Computer Use" capability to interact with a headless browser (Playwright).
        *   Compares live screenshots against design tokens/Figma specs.
        *   Autonomously generates CSS patches to fix alignment/spacing issues.
*   **Feature: Visual Regression "Triage"**
    *   **Concept**: When a visual test fails, Claude analyzes the diff and categorizes it as "intended change" or "regression", reducing noise for human reviewers.

### 3. Autonomous Tool Loops (Vercel AI SDK 6)
*   **Feature: The "Fix-it" Loop**
    *   **Concept**: A dedicated `Agent` (AI SDK 6 abstraction) that listens to build failures or linter errors.
    *   **Mechanism**:
        *   Triggered by `pnpm build` failure.
        *   Agent reads the error log, locates the file, attempts a fix, and retries.
        *   Continues until build passes or "budget" is exhausted.
*   **Feature: Live Documentation Sync**
    *   **Concept**: Agents that update `AGENTS.md` and component docs in real-time as code changes.

## Implementation Roadmap
1.  **Upgrade to AI SDK 6**: **Completed.** Dependencies updated to `ai@6.0.39` and `@ai-sdk/google@3.0.10`.
2.  **Integrate Anthropic Provider**: Add `anthropic` provider to `lib/ai/providers.ts` for Claude Opus 4.5 access.
3.  **Establish "Thinking" Protocols**: Define budget and prompts for Gemini's deep planning mode in `lib/ai/prompts.ts`.
