"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AgentModeToggle() {
  const [open, setOpen] = useState(false);
  const [goal, setGoal] = useState("");
  const [iterations, setIterations] = useState("3");
  const [isLoading, setIsLoading] = useState(false);

  const handleRunAgent = async () => {
    if (!goal) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, iterations: parseInt(iterations) }),
      });

      if (response.ok) {
        toast.success("Agent workflow started. Check the console or themes list for results.");
        setOpen(false);
      } else {
        const error = await response.json();
        toast.error(`Error: ${error.error}`);
      }
    } catch {
      toast.error("Failed to contact server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Bot className="h-4 w-4" />
          <span className="hidden sm:inline">Agent Mode</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Run Deep Agent Workflow</DialogTitle>
          <DialogDescription>
            Launch a headless agent process (Python) to iterate on themes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="goal">Goal / Prompt</Label>
            <Textarea
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="E.g. Create 5 variations of a dashboard for a fintech app..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="iterations">Iterations</Label>
            <Input
              id="iterations"
              type="number"
              value={iterations}
              onChange={(e) => setIterations(e.target.value)}
              min={1}
              max={10}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleRunAgent} disabled={isLoading}>
            {isLoading ? "Launching..." : "Launch Agent"}
            <Play className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
