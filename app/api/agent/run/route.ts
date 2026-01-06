import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { goal, iterations } = await req.json();

    if (!goal) {
      return NextResponse.json({ error: "Goal is required" }, { status: 400 });
    }

    // Path to the python script
    const scriptPath = path.join(process.cwd(), "scripts/agent/tweak_agent.py");

    // Spawn the process
    // Note: In a real serverless environment (Vercel), this spawn might not work or might be killed quickly.
    // Ideally, this should be offloaded to a separate worker service.
    // But for a local tool or containerized app, this works.
    const pythonProcess = spawn("python3", [scriptPath, goal, (iterations || "3").toString()]);

    pythonProcess.stdout.on("data", (data) => {
      console.log(`[Agent StdOut]: ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`[Agent StdErr]: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`[Agent] child process exited with code ${code}`);
    });

    // We return immediately, not waiting for the process to finish (fire and forget)
    // In a real UI, we'd return a job ID and poll for status.
    return NextResponse.json({ success: true, message: "Agent started" });
  } catch (error) {
    console.error("Failed to start agent:", error);
    return NextResponse.json({ error: "Failed to start agent" }, { status: 500 });
  }
}
