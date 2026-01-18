# Agent Guidelines (Vittima Release)

This repository is transitioning to an agent-first workflow under the Vittima release initiatives.

## General Directives
*   **Deep Planning**: Before making significant changes to architecture or data models, invoke the "Deep Thought" protocol (Gemini 2.5) to analyze the full context and prevent regression.
*   **Visual Verification**: UI changes must be verified visually. If you cannot see the UI, request a screenshot or use the "Visual Verification" agent (Claude Opus) when available.
*   **Self-Correction**: If a build fails or tests break, analyze the error log and attempt to fix it autonomously before requesting human intervention.

## Environment Requirements
*   **AI SDK**: Ensure `ai` package is v6.0.0 or higher (Installed: v6.0.39).
*   **Google Provider**: Ensure `@ai-sdk/google` is v3.0.0 or higher (Installed: v3.0.10).

## Coding Standards
*   **File Structure**: Follow the existing Next.js App Router structure.
*   **Styling**: Use Tailwind CSS and `shadcn/ui` components. Avoid custom CSS files unless absolutely necessary.
*   **State Management**: Prefer server state (React Query) over client state (Zustand) where possible.
*   **Components**: Ensure components are small, reusable, and typed strictly with TypeScript.

## Tools & Scripts
*   Run `pnpm generate-theme-registry` after modifying themes or adding new ones.
*   Run `pnpm lint` to verify code quality.
*   Run `pnpm build` to ensure production readiness.
