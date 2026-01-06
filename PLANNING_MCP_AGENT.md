# TweekUI MCP & Mini-Agent Integration Plan

This document outlines the architecture for integrating TweekUI with Claude Code (via MCP) and "Mini-Agents" (via a headless Python runner).

## 1. MCP Server Architecture

The MCP (Model Context Protocol) Server will act as the bridge between Claude Code (CLI) and the TweekUI application.

### Server Details
- **Type**: `stdio` or `sse` (recommend `stdio` for local Claude Code usage).
- **Language**: TypeScript (can be integrated into the Next.js app or run as a standalone script).

### Tools
The MCP server will expose the following tools to Claude:

1.  **`list_themes`**
    *   **Description**: List available themes in the TweekUI repository.
    *   **Parameters**: `limit` (optional number), `search` (optional string).
    *   **Returns**: JSON list of themes (id, name, description).

2.  **`get_theme`**
    *   **Description**: Get the full style configuration of a specific theme.
    *   **Parameters**: `theme_id` (string).
    *   **Returns**: JSON object conforming to `ThemeStyles`.

3.  **`save_theme`**
    *   **Description**: Save a new theme or update an existing one.
    *   **Parameters**: `name` (string), `styles` (JSON object matching `ThemeStyles`), `description` (optional).
    *   **Returns**: Confirmation message and `theme_id`.

4.  **`validate_theme`**
    *   **Description**: Validate if a given JSON structure matches the TweekUI theme schema.
    *   **Parameters**: `styles` (JSON).

### Resources
*   `tweekui://themes/{theme_id}`: Direct read access to theme content.

### Prompts
*   **`create-shadcn-theme`**: A system prompt that instructs Claude on the valid keys/values for a TweekUI theme (e.g., CSS variables, radius, colors).

---

## 2. Mini-Agent Architecture ("Deep Work")

To leverage "Mini-Agents" (long-running, specialized workflows) compatible with Minimax/Claude Opus, we will implement a "Headless Agent Runner".

### Components

1.  **Python Agent Runner (`scripts/agent/tweak_agent.py`)**
    *   **Role**: Acts as the "Client" similar to `autocoder`.
    *   **Dependencies**: `anthropic` (or `claude_agent_sdk` if available), `requests`.
    *   **Workflow**:
        1.  Receives a high-level goal (e.g., "Create 10 variations of a dashboard theme").
        2.  Loops through the task:
            *   *Plan*: Decides on the next variation.
            *   *Generate*: Uses the LLM (via Claude CLI or API) to generate the JSON.
            *   *Verify*: Calls TweekUI API to check validity.
            *   *Save*: Pushes the result to TweekUI.
    *   **Integration**: Can be triggered via CLI or the Web UI.

2.  **TweekUI Agent API (`app/api/agent/...`)**
    *   **Purpose**: Allow the Python script (running locally) to interact with the Next.js app's database.
    *   **Endpoints**:
        *   `POST /api/agent/themes/save`: Save a generated theme.
        *   `GET /api/agent/themes/list`: Get context.

3.  **Web UI Trigger**
    *   **Location**: `app/ai/page.tsx`.
    *   **Action**: A "Deep Generate" button that calls a Next.js Server Action.
    *   **Server Action**: Spawns the `python3 scripts/agent/tweak_agent.py` process (detached or awaited).

## 3. Configuration

To connect Claude Code with this setup:

```json
// ~/.claude/config.json (Example)
{
  "mcpServers": {
    "tweekui": {
      "command": "node",
      "args": ["/path/to/tweekui/scripts/mcp-server.js"]
    }
  }
}
```

The Python agent will inherit the environment variables or use the `claude` CLI found in the path.
