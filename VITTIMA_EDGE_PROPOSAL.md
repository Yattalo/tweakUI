# Vittima Edge Features Proposal

This document outlines proposed features for the "Vittima" release of **tweakcn-next**, leveraging the latest advancements in agentic coding from the **Vercel AI SDK 6.0**, **Google Gemini SDK**, and **Anthropic Claude SDK**.

## 1. Deep Thought Planning Mode

**Goal:** Implement a rigorous planning phase where the agent iterates, asks clarifying questions, and verifies assumptions until "absolute certainty" is reached before generating code.

**Technical Implementation:**
- **Upgrade to Vercel AI SDK 6.0:** This is a prerequisite to use the new `ToolLoopAgent` and standardized Agent interfaces.
- **`ToolLoopAgent` for Planning:** Use the new `ToolLoopAgent` abstraction to create a specialized "Planner Agent". This agent's sole responsibility is to produce a verified plan.
- **Interactive Tool Loop:**
    - **`askUser` Tool:** Allows the agent to pause execution and request specific information from the user (e.g., "Do you prefer a sidebar or top navigation?").
    - **`verifyAssumptions` Tool:** An internal tool where the agent lists its assumptions and checks them against project constraints (retrieved from `README.md` or a knowledge base).
    - **`proposePlan` Tool:** The final output of this agent, which presents a structured plan (JSON/Markdown) for user sign-off.
- **Thinking Config (Gemini 2.5):** Leverage the `thinkingConfig` (already partially present in `lib/ai/providers.ts`) to allow the model to "think silently" before outputting its questions or plan. This improves reasoning depth.

**User Experience:**
1. User enters a request.
2. Planner Agent enters a loop: "Analyzing... I need to clarify X."
3. Agent asks user X.
4. User replies.
5. Agent: "Thinking... Okay, I have a plan."
6. Agent presents detailed plan.
7. User approves.

## 2. Visual Verification (The "Vittima" Eye)

**Goal:** Enable the agent to "see" what it has built and verify it against the design intent, catching visual regressions or layout issues.

**Technical Implementation:**
- **Gemini 2.5 Multimodal Capabilities:** Utilize the vision capabilities of `gemini-2.5-flash` (or `pro`).
- **`viewImage` Tool:** Implement a tool (inspired by xAI/Google provider tools in SDK 6) that allows the agent to inspect screenshots.
    - *Note:* This requires a mechanism to capture screenshots of the running app (e.g., via a headless browser or client-side capture sent to the API).
- **Verification Workflow:**
    1. Agent generates theme/component.
    2. System captures a preview screenshot.
    3. Agent calls `viewImage(screenshot)`.
    4. Agent analyzes: "Contrast is too low on the primary button" or "Alignment looks off."
    5. Agent auto-corrects code or suggests fixes.

## 3. Human-in-the-Loop Safety

**Goal:** Ensure the user has ultimate control over critical actions, aligning with the "Deep Thought" philosophy.

**Technical Implementation:**
- **Tool Execution Approval (`needsApproval`):** Use the new AI SDK 6 feature `needsApproval: true` for sensitive tools (e.g., committing code, deploying, or finalizing the plan).
- **Granular Control:** The Planner Agent can require approval for the *Plan*, while the Coding Agent might require approval only for *File Writes*.

## 4. Technical Path Forward

To achieve these features, the following steps are required:

1.  **Upgrade Dependencies:**
    - Run `npx @ai-sdk/codemod upgrade v6` to migrate to AI SDK 6.0.
    - Update `@ai-sdk/google` to the latest version.
2.  **Refactor `lib/ai/providers.ts`:**
    - Adopt the new `Agent` interfaces.
    - Configure `ToolLoopAgent` settings.
3.  **Implement New Tools:**
    - Build the interactive planning tools (`askUser`, `verifyAssumptions`).
    - Build the visual verification tools (`viewImage`).

## Summary

The "Vittima" release will transform **tweakcn-next** from a theme generator into an intelligent **Theme Architect**. By combining **Deep Thought Planning** (via SDK 6 Agent Loops) with **Visual Verification** (via Gemini Vision), we ensure that the generated results are not just syntactically correct, but design-perfect and fully aligned with user intent.
