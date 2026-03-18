import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Loader2, Terminal, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PythonIDEProps {
  initialCode?: string;
  title?: string;
  description?: string;
}

declare global {
  interface Window {
    loadPyodide: (config?: { indexURL?: string }) => Promise<any>;
  }
}

let pyodideInstance: any = null;
let pyodideLoading = false;
let pyodideLoadPromise: Promise<any> | null = null;

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;

  if (pyodideLoading && pyodideLoadPromise) {
    return pyodideLoadPromise;
  }

  pyodideLoading = true;

  // Load Pyodide script if not already loaded
  if (!window.loadPyodide) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Pyodide"));
      document.head.appendChild(script);
    });
  }

  pyodideLoadPromise = window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
  });

  pyodideInstance = await pyodideLoadPromise;
  pyodideLoading = false;
  return pyodideInstance;
}

export function PythonIDE({ initialCode = "", title, description }: PythonIDEProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCode(initialCode);
    setOutput("");
  }, [initialCode]);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput("");

    try {
      if (!pyodideInstance) {
        setIsLoading(true);
        setOutput("⏳ Loading Python runtime (first time only)...");
      }

      const pyodide = await getPyodide();
      setIsLoading(false);

      // Capture stdout/stderr
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
      `);

      try {
        pyodide.runPython(code);
        const stdout = pyodide.runPython("sys.stdout.getvalue()");
        const stderr = pyodide.runPython("sys.stderr.getvalue()");
        const result = stdout + (stderr ? `\n${stderr}` : "");
        setOutput(result || "✓ Code executed successfully (no output)");
      } catch (err: any) {
        setOutput(`❌ Error: ${err.message}`);
      }
    } catch (err: any) {
      setIsLoading(false);
      setOutput(`❌ Failed to initialize Python: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  }, [code]);

  const handleReset = () => {
    setCode(initialCode);
    setOutput("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
    // Ctrl/Cmd + Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRun();
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-foreground">
            {title || "Python Editor"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
            className="h-7 px-3 text-xs bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isRunning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
            ) : (
              <Play className="h-3.5 w-3.5 mr-1" />
            )}
            Run
          </Button>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="px-4 py-2 bg-muted/30 border-b border-border">
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      )}

      {/* Code Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className={cn(
            "w-full min-h-[180px] p-4 font-mono text-sm leading-relaxed resize-y",
            "bg-[hsl(220,20%,12%)] text-[hsl(210,20%,90%)]",
            "focus:outline-none focus:ring-0 border-0",
            "placeholder:text-[hsl(215,15%,40%)]"
          )}
          placeholder="# Write your Python code here..."
        />
        <div className="absolute bottom-2 right-3 text-[10px] text-[hsl(215,15%,40%)]">
          Ctrl+Enter to run
        </div>
      </div>

      {/* Output */}
      {(output || isRunning) && (
        <div className="border-t border-border">
          <div className="px-4 py-1.5 bg-muted/50 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">Output</span>
          </div>
          <pre
            className={cn(
              "p-4 font-mono text-sm min-h-[60px] max-h-[200px] overflow-auto whitespace-pre-wrap",
              "bg-[hsl(220,20%,12%)] text-[hsl(145,60%,70%)]",
              output.startsWith("❌") && "text-destructive"
            )}
          >
            {isRunning && isLoading ? (
              <span className="text-[hsl(38,92%,60%)]">{output}</span>
            ) : (
              output
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
