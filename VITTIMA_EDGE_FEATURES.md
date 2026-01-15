# Vittima Edge Features Proposal

This document outlines proposed features for the "Vittima" release of TweekUI (tweakcn-next), leveraging the latest advancements in the Vercel AI SDK and state-of-the-art model capabilities (Google Gemini 1.5 Pro/Flash and Anthropic Claude 3.5 Sonnet).

## 1. Deep Thought Planning (Agentic Reasoning)

Leveraging the long-context and reasoning capabilities of **Google Gemini 1.5 Pro**, we propose a "Deep Thought" mode that runs *before* any code generation.

*   **Implementation**: Enhance `lib/ai/providers.ts` to utilize a dedicated `planning` model alias.
*   **Workflow**:
    1.  User inputs a complex request (e.g., "Create a dashboard with dark mode, real-time charts, and a sidebar").
    2.  **Planner Agent** (Gemini 1.5 Pro) analyzes the request, breaking it down into atomic tasks (e.g., "Setup Sidebar", "Configure Recharts", "Define Color Palette").
    3.  The agent outputs a structured plan (JSON) that drives the subsequent generation steps.
*   **Benefit**: Reduces logical errors in complex UI layouts by forcing a reasoning step and leveraging the massive context window of Gemini 1.5 Pro to hold the entire codebase context.

## 2. Visual Verification Loop (Self-Correcting UI)

Using the strong **Vision** capabilities of **Gemini 1.5 Flash** (for speed) and **Claude 3.5 Sonnet** (for high-fidelity detail), we can implement a "Visual Unit Test".

*   **Implementation**:
    *   Create a `VisualVerificationAgent` using the AI SDK's tool calling capabilities.
    *   Integrate a screenshot tool (e.g., via Playwright or Puppeteer) that feeds the rendered UI back to the model.
*   **Workflow**:
    1.  Theme/Component is generated and rendered.
    2.  A screenshot is taken and sent to the Vision Model.
    3.  Prompt: "Does this UI match the user's request for 'high contrast'? Are there any layout shifts?"
    4.  If the model detects issues, it triggers a `fix_ui` tool call to adjust the CSS/Tailwind classes automatically.

## 3. Autonomous Tool Loop (AI SDK Agentic Workflows)

Transition from simple `generateText` calls to **multi-step agentic workflows** using `maxSteps` in `streamText`.

*   **Implementation**:
    *   Refactor the current generation logic to use the `streamText` function with `maxSteps` enabled (allowing for iterative tool calls).
    *   Define a robust toolset: `readFile`, `writeFile`, `listDir`, `previewTheme`.
*   **Feature**: "Vittima Auto-Coder"
    *   Allows the user to say "Fix the padding on the mobile view".
    *   The Agent enters a loop:
        1.  `readFile` (component source).
        2.  `generateText` (updated code).
        3.  `verify` (optional visual check).
        4.  Submit changes.
*   **Safety**: Implement `needsApproval` (Human-in-the-loop) for file writes, ensuring the user approves changes before they are applied to the filesystem.

## 4. Hybrid Model Dispatch Strategy

Maximize performance and cost-efficiency by routing tasks to the best model.

*   **Configuration**:
    *   **Planning & Reasoning**: `google/gemini-1.5-pro` (Complex reasoning and large context).
    *   **Code Generation**: `anthropic/claude-3.5-sonnet` (High quality code generation) or `google/gemini-1.5-flash` (Speed).
    *   **Visual QA**: `google/gemini-1.5-flash` (Fast vision feedback).
*   **Mechanism**: Update `lib/ai/providers.ts` to export specific model aliases (`planning`, `coding`, `vision`) that map to these provider configurations.

## 5. Sandboxed Execution Environment

To safely run the "Agentic Coding" features, we propose integrating a secure sandbox.

*   **Concept**: When the agent wants to "run" code (e.g., a script to generate a registry), it executes inside a containerized environment (e.g., WebContainers or a secure server-side sandbox) rather than directly on the user's host machine during development (unless explicitly allowed).

---

### Roadmap to Vittima

1.  **Upgrade**: Ensure `ai` SDK is updated to the latest 5.x version to support robust tool calling.
2.  **Config**: configure `gemini-1.5-pro` for planning tasks in `lib/ai/providers.ts`.
3.  **Prototype**: Build the `VisualVerificationAgent` as a standalone script to test efficacy.
4.  **Integrate**: clear the path for "Deep Thought Planning" in the main UI flow.
