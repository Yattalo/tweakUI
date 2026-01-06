import { db } from "@/db";
import { theme } from "@/db/schema";
import { ThemeStyles } from "@/types/theme";
import { cuid } from "@/utils/cuid";
import { NextRequest, NextResponse } from "next/server";

// Define a simpler schema for the agent payload
interface AgentThemePayload {
  name: string;
  styles: ThemeStyles;
}

export async function GET() {
  try {
    // For local agent usage, we might need to bypass auth or use a specific API key.
    // For now, let's assume the agent runs locally and we might restrict by IP or use a shared secret.
    // But since this is a demo/dev tool, we'll try to get the user if possible, or fallback to a default "Agent" user if configured.
    // IMPORTANT: In production, this needs proper API Key authentication.

    // Simplification: List the last 50 themes
    const themes = await db.query.theme.findMany({
      limit: 50,
      orderBy: (theme, { desc }) => [desc(theme.updatedAt)],
    });

    return NextResponse.json({ themes });
  } catch (error) {
    console.error("Agent API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: AgentThemePayload = await req.json();

    if (!body.name || !body.styles) {
        return NextResponse.json({ error: "Missing name or styles" }, { status: 400 });
    }

    // Generate a new ID
    const id = cuid();

    // We need a userId. In a real app, the Agent should probably act on behalf of a user.
    // For this implementation, I'll attempt to find a 'demo' user or use a placeholder if the DB constraint allows.
    // However, the schema says userId is NOT NULL and references user.id.
    // So we must have a valid user.
    // Strategy: The agent request should ideally carry a userId or we pick the first admin user.

    // Hack for prototype: Fetch the first user found in DB to assign the theme to.
    const firstUser = await db.query.user.findFirst();

    if (!firstUser) {
        return NextResponse.json({ error: "No users found in DB to assign theme to." }, { status: 404 });
    }

    await db.insert(theme).values({
      id,
      userId: firstUser.id,
      name: body.name,
      styles: body.styles,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, themeId: id });
  } catch (error) {
    console.error("Agent API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
