# Vittima Edge Features Proposal

This proposal outlines a set of cutting-edge features for the "Vittima" release of TweakUI, leveraging the latest advancements in agentic coding from the Google Generative AI and Anthropic Claude ecosystems, as well as the newly released **Vercel AI SDK 6**.

**Note on References:** This proposal assumes the availability of technologies released in late 2025/early 2026 (e.g., Gemini 3 Flash, Vercel AI SDK 6).

## Executive Summary

The "Vittima" release will focus on making the AI agent not just a code generator, but a **state-aware, reversible, and specialized collaborator**. By integrating the new **Claude Agent SDK** features and **Vercel AI SDK 6**, we can deliver features like time-travel debugging (Rewind), specialized sub-agents for different UI concerns, and high-fidelity multi-modal generation.

## Proposed Features

### 1. Vittima Rewind (Time-Travel Editing)
**Powered by:** Claude Agent SDK (Checkpoints & Rewind)

Allow users to experiment with complex UI changes (e.g., "Change the entire color scheme to pastel and update font typography") with the safety of an instant "undo" button that reverts not just the text buffer, but the entire file system state.

- **Mechanism:** Leverage the `enable_file_checkpointing` option and `rewind_files()` method found in the `claude-agent-sdk-python`.
- **User Benefit:** Fearless experimentation. Users can try risky changes and "rewind" to a known stable state if the agent hallucinates or breaks the build.

### 2. Vittima Sub-Agents (Specialized Workers)
**Powered by:** Vercel AI SDK 6 (`ToolLoopAgent` & `Agent` abstraction)

Instead of a single monolithic agent, deploy a swarm of specialized sub-agents coordinated by a central planner.

- **`TailwindArchitect`**: specialized in `tailwind.config.ts`, ensuring design tokens are consistent.
- **`ComponentRefiner`**: specialized in `shadcn/ui` internals, knowing exactly which files to touch for a component update.
- **`ContentStrategist`**: specialized in updating text content and copy without breaking layout.
- **Implementation:** Use the new [`ToolLoopAgent`](https://vercel.com/blog/ai-sdk-6#agents) class in Vercel AI SDK 6 to define these reusable, type-safe agents.

### 3. Safe & Smart Tooling
**Powered by:** Vercel AI SDK 6 (`needsApproval`) & Claude Programmatic Tool Calling

Enhance safety and precision in agent operations.

- **Human-in-the-loop Safety:** Use the new `needsApproval: true` flag in AI SDK 6 for destructive operations (e.g., deleting files or overwriting core configs).
- **Code-First Logic:** Use **Claude Programmatic Tool Calling** (`anthropic.tools.codeExecution`) to allow the agent to write and execute Python/JS scripts for logic-heavy tasks (like calculating color palettes) instead of relying on token prediction.

### 4. Multi-Modal UI Scaffolding
**Powered by:** Google Gemini 3 Flash / 1.5 Pro

Leverage Gemini's superior vision and long-context capabilities for "Screenshot to Code" workflows.

- **Technology:** [Gemini 3 Flash](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/release-notes#December_17_2025) (released Dec 2025) offers state-of-the-art reasoning and agentic capabilities.
- **Workflow:** User pastes a screenshot of a desired design. Gemini 3 Flash analyzes the image and generates the initial scaffolding (JSX/Tailwind). The context is then handed to a Claude-based "Refiner" agent to polish the code.

## Architecture Updates Required

To support these features, the following infrastructure updates are proposed:

1.  **Upgrade Vercel AI SDK:** Update `ai` to `^6.0.0` to unlock `ToolLoopAgent` and `needsApproval`.
2.  **Install Claude Agent SDK:** Add `@anthropic-ai/claude-agent-sdk` (or Python equivalent for backend agents) to leverage checkpoints.
3.  **Update Google SDK:** Ensure `@google/generative-ai` is updated to support Gemini 3 Flash.
4.  **Agent Environment:** Re-introduce or update the Python agent environment to support `claude-agent-sdk-python` for backend-heavy agent tasks requiring filesystem checkpoints.

## Next Steps

1.  Approve this proposal.
2.  Create a technical design document for the "Vittima Rewind" feature.
3.  Begin incremental upgrade of dependencies to AI SDK 6.
