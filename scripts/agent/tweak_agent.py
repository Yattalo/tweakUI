import sys
import json
import time
import requests
import subprocess
import os

# Configuration
API_BASE_URL = "http://localhost:3000/api/agent"
CLAUDE_CLI = "claude" # Assumes 'claude' is in PATH

def log(message):
    print(f"[Agent] {message}", file=sys.stderr)

def call_claude(prompt):
    """
    Calls the Claude CLI to get a response.
    Mimics the behavior of using the SDK/CLI.
    """
    log(f"Calling Claude with prompt: {prompt[:50]}...")
    try:
        # We use the CLI via subprocess.
        # Note: This requires the user to be authenticated with `claude login` locally.
        # We pass the prompt to stdin.
        result = subprocess.run(
            [CLAUDE_CLI, "-p", prompt],
            capture_output=True,
            text=True
        )
        if result.returncode != 0:
            log(f"Claude CLI Error: {result.stderr}")
            return None
        return result.stdout
    except FileNotFoundError:
        log("Claude CLI not found. Using Mock response for testing.")
        # MOCK RESPONSE for Sandbox environment where 'claude' CLI might not be authenticated
        return mock_generate_theme(prompt)

def mock_generate_theme(prompt):
    """
    Generates a valid JSON theme response for testing purposes.
    """
    import random
    colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#33FFF5"]
    primary = random.choice(colors)
    return json.dumps({
        "name": f"Generated Theme {random.randint(1, 100)}",
        "styles": {
            "type": "dark",
            "css": "",
            "colors": {
                "light": {
                    "background": "0 0% 100%",
                    "foreground": "240 10% 3.9%",
                    "card": "0 0% 100%",
                    "card-foreground": "240 10% 3.9%",
                    "popover": "0 0% 100%",
                    "popover-foreground": "240 10% 3.9%",
                    "primary": "240 5.9% 10%",
                    "primary-foreground": "0 0% 98%",
                    "secondary": "240 4.8% 95.9%",
                    "secondary-foreground": "240 5.9% 10%",
                    "muted": "240 4.8% 95.9%",
                    "muted-foreground": "240 3.8% 46.1%",
                    "accent": "240 4.8% 95.9%",
                    "accent-foreground": "240 5.9% 10%",
                    "destructive": "0 84.2% 60.2%",
                    "destructive-foreground": "0 0% 98%",
                    "border": "240 5.9% 90%",
                    "input": "240 5.9% 90%",
                    "ring": "240 10% 3.9%",
                    "chart-1": "12 76% 61%",
                    "chart-2": "173 58% 39%",
                    "chart-3": "197 37% 24%",
                    "chart-4": "43 74% 66%",
                    "chart-5": "27 87% 67%"
                },
                "dark": {
                    "background": "240 10% 3.9%",
                    "foreground": "0 0% 98%",
                    "card": "240 10% 3.9%",
                    "card-foreground": "0 0% 98%",
                    "popover": "240 10% 3.9%",
                    "popover-foreground": "0 0% 98%",
                    "primary": "0 0% 98%",
                    "primary-foreground": "240 5.9% 10%",
                    "secondary": "240 3.7% 15.9%",
                    "secondary-foreground": "0 0% 98%",
                    "muted": "240 3.7% 15.9%",
                    "muted-foreground": "240 5% 64.9%",
                    "accent": "240 3.7% 15.9%",
                    "accent-foreground": "0 0% 98%",
                    "destructive": "0 62.8% 30.6%",
                    "destructive-foreground": "0 0% 98%",
                    "border": "240 3.7% 15.9%",
                    "input": "240 3.7% 15.9%",
                    "ring": "240 4.9% 83.9%",
                    "chart-1": "220 70% 50%",
                    "chart-2": "160 60% 45%",
                    "chart-3": "30 80% 55%",
                    "chart-4": "280 65% 60%",
                    "chart-5": "340 75% 55%"
                }
            },
            "radius": 0.5
        }
    })

def save_theme_to_api(theme_data):
    url = f"{API_BASE_URL}/themes"
    try:
        response = requests.post(url, json=theme_data)
        if response.status_code == 200:
            log(f"Success: Saved theme '{theme_data.get('name')}'")
            return True
        else:
            log(f"Failed to save theme: {response.text}")
            return False
    except Exception as e:
        log(f"API Connection Error: {e}")
        return False

def run_agent_workflow(goal, iterations=3):
    log(f"Starting Agent Workflow for goal: {goal}")

    system_instruction = """
    You are an expert UI designer for Shadcn/UI and Tailwind CSS.
    Output ONLY valid JSON representing a theme.
    The JSON must have 'name' (string) and 'styles' (object).
    'styles' object must match the structure of Shadcn themes (colors for light/dark, radius, etc).
    """

    for i in range(iterations):
        prompt = f"{system_instruction}\n\nTask: Create variation #{i+1} for the goal: {goal}. ensure it is unique."

        # 1. Generate
        response_text = call_claude(prompt)
        if not response_text:
            continue

        # 2. Parse & Validate
        try:
            # Try to find JSON in the response
            start = response_text.find('{')
            end = response_text.rfind('}') + 1
            if start != -1 and end != -1:
                json_str = response_text[start:end]
                theme_data = json.loads(json_str)

                # 3. Save
                save_theme_to_api(theme_data)
            else:
                log("Could not find JSON in response")
        except json.JSONDecodeError:
            log("Failed to decode JSON from response")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python tweak_agent.py <goal> [iterations]")
        sys.exit(1)

    goal = sys.argv[1]
    iterations = int(sys.argv[2]) if len(sys.argv) > 2 else 1

    run_agent_workflow(goal, iterations)
