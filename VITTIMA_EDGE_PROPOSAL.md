# Vittima Edge: Agentic Coding Proposal

This document outlines the proposed features for the "Vittima" release, leveraging the newest advancements in agentic coding from the Gemini 3 and Claude Agent SDKs.

## 1. Deep Thought Planning Mode

**Goal:** Implement the "deep planning mode" requested by users to ensure high-certainty execution of complex tasks.

**Implementation Strategy:**
- **Model:** `gemini-3-pro-preview` or `claude-3-opus-4.5` (via `thinking_level: "high"` or "Thinking Mode").
- **Workflow:**
    1.  **Initial Request Analysis:** The agent receives the user prompt.
    2.  **Deep Reasoning Phase:** The agent enters a "thinking" loop (up to 128k budget or "High" level) to analyze the request against the codebase.
    3.  **Clarification Loop:** Instead of generating code immediately, the agent generates a list of clarifying questions and assumptions.
    4.  **User Verification:** The user confirms assumptions or answers questions.
    5.  **Plan Finalization:** Only after this dialogue does the agent generate the execution plan.

## 2. Context-Aware Workflow with Thought Signatures

**Goal:** Prevent context drift and hallucinations in long, multi-step agentic sessions.

**Implementation Strategy:**
- **Mechanism:** utilize Gemini 3's `thoughtSignature` feature.
- **Workflow:**
    - Capture the encrypted `thoughtSignature` from every model response.
    - Pass this signature back in the subsequent request's history.
    - **Crucial for:** Function calling sequences (e.g., `list_files` -> `read_file` -> `write_file`) where the "why" of the file read determines the content of the file write.

## 3. Visual Verification Agent

**Goal:** Ensure UI changes match design intent and do not introduce visual regressions.

**Implementation Strategy:**
- **Model:** `gemini-3-pro-preview` (multimodal) or `gemini-3-pro-image-preview`.
- **Workflow:**
    - **Step 1:** Agent applies code changes.
    - **Step 2:** Agent triggers a Playwright script to capture a screenshot of the modified component/page.
    - **Step 3:** The image is fed back to the model with `media_resolution: "media_resolution_high"`.
    - **Step 4:** The model compares the screenshot against the original request (text or reference image) to "see" if it looks correct.

## 4. Autonomous Codebase Navigator (Claude-style)

**Goal:** Enable the agent to understand the codebase structure without exhaustive file dumping.

**Implementation Strategy:**
- **Inspiration:** `claude-code` CLI.
- **Tools:**
    - `search_codebase`: Semantic search over code chunks (using embeddings or a smart grep).
    - `map_dependencies`: A tool that traces imports to understand the blast radius of a change.
    - `read_related_files`: Automatically reads files imported by the target file to understand context.

## 5. Multimodal Tool Feedback

**Goal:** Allow tools to return rich data (images, graphs) to the agent for better decision making.

**Implementation Strategy:**
- **Mechanism:** Gemini 3 Multimodal Function Responses.
- **Use Case:**
    - A `preview_component` tool that renders a React component to an image on the server and returns the image blob to the agent.
    - The agent can then self-correct layout issues before the user even sees the code.

## Migration Path

1.  **Upgrade SDKs:** Update `@ai-sdk/google` and `@google/generative-ai` to support the v1beta/v1alpha APIs for Gemini 3.
2.  **Update Providers:** Modify `lib/ai/providers.ts` to support `thinking_level` and `media_resolution`.
3.  **Implement State Management:** Update the chat loop to handle `thoughtSignature` persistence.
