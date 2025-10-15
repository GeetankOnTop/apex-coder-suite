import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, X, Loader2 } from "lucide-react";
import { runPython } from "./pythonRunner";
import { runLua } from "./luaRunner";
import { toast } from "sonner";

interface CodeRunnerProps {
  code: string;
  language: string;
  onClose: () => void;
}

export const CodeRunner = ({ code, language, onClose }: CodeRunnerProps) => {
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);

  const canRun = language === "python" || language === "lua" || language === "luau";

  const handleRun = async () => {
    if (!canRun) {
      toast.error("This language is not supported for execution");
      return;
    }

    setIsRunning(true);
    setOutput("Running...\n");

    try {
      let result;
      if (language === "python") {
        result = await runPython(code);
      } else if (language === "lua" || language === "luau") {
        result = await runLua(code);
      }

      if (result) {
        if (result.error) {
          setOutput(`Error:\n${result.error}`);
          toast.error("Execution failed");
        } else {
          setOutput(result.output);
          toast.success("Code executed successfully");
        }
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
      toast.error("Execution failed");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Output</span>
          <span className="text-xs text-muted-foreground">
            ({language.toUpperCase()})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleRun}
            disabled={isRunning || !canRun}
            className="gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run
              </>
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <pre className="text-sm font-mono whitespace-pre-wrap">
          {output || "Click 'Run' to execute your code"}
        </pre>
      </ScrollArea>
    </div>
  );
};
