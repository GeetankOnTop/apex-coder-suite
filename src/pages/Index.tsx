import { useState, useCallback } from "react";
import { CodeEditor } from "@/components/Editor/CodeEditor";
import { EditorToolbar } from "@/components/Toolbar/EditorToolbar";
import { FileTab } from "@/components/FileTabs/FileTab";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface File {
  id: string;
  name: string;
  content: string;
  language: string;
}

const DEFAULT_FILES: File[] = [
  {
    id: "1",
    name: "app.js",
    language: "javascript",
    content: `// Welcome to CodeMaster - Professional Code Editor
// Powered by CodeMirror 6

function greet(name) {
  console.log(\`Hello, \${name}! 👋\`);
  return \`Welcome to CodeMaster!\`;
}

// Try editing this code
const message = greet("Developer");
console.log(message);

// Features:
// ✅ Syntax highlighting
// ✅ Auto-completion
// ✅ Code folding
// ✅ Multi-language support
// ✅ Search & replace (Ctrl+F)
// ✅ Line numbers
// ✅ Bracket matching
`,
  },
];

const Index = () => {
  const [files, setFiles] = useState<File[]>(DEFAULT_FILES);
  const [activeFileId, setActiveFileId] = useState<string>(DEFAULT_FILES[0].id);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  const handleCodeChange = useCallback(
    (newContent: string) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === activeFileId ? { ...f, content: newContent } : f))
      );
    },
    [activeFileId]
  );

  const handleLanguageChange = useCallback(
    (newLanguage: string) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === activeFileId ? { ...f, language: newLanguage } : f))
      );
    },
    [activeFileId]
  );

  const handleSave = useCallback(() => {
    localStorage.setItem(`file-${activeFile.id}`, activeFile.content);
    toast.success("File saved successfully!");
  }, [activeFile]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([activeFile.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  }, [activeFile]);

  const handleUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const extension = file.name.split(".").pop() || "txt";
          const languageMap: Record<string, string> = {
            js: "javascript",
            ts: "typescript",
            jsx: "jsx",
            tsx: "tsx",
            py: "python",
            html: "html",
            css: "css",
            json: "json",
            md: "markdown",
            sql: "sql",
            xml: "xml",
            php: "php",
            java: "java",
            cpp: "cpp",
            rs: "rust",
          };
          const newFile: File = {
            id: Date.now().toString(),
            name: file.name,
            content,
            language: languageMap[extension] || "javascript",
          };
          setFiles((prev) => [...prev, newFile]);
          setActiveFileId(newFile.id);
          toast.success("File uploaded!");
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  const handleNewFile = () => {
    const newFile: File = {
      id: Date.now().toString(),
      name: `untitled-${files.length + 1}.js`,
      content: "// New file\n",
      language: "javascript",
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
    toast.success("New file created!");
  };

  const handleCloseFile = (id: string) => {
    if (files.length === 1) {
      toast.error("Cannot close the last file!");
      return;
    }
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (activeFileId === id) {
      setActiveFileId(files[0].id === id ? files[1].id : files[0].id);
    }
    toast.success("File closed!");
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-gradient-primary border-b border-border flex items-center justify-between px-6 shadow-glow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-background/10 backdrop-blur-sm flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">CodeMaster</h1>
            <p className="text-xs text-white/80">Professional Code Editor</p>
          </div>
        </div>
      </div>

      {/* File Tabs */}
      <div className="bg-card border-b border-border flex items-center overflow-x-auto">
        {files.map((file) => (
          <FileTab
            key={file.id}
            id={file.id}
            name={file.name}
            isActive={file.id === activeFileId}
            onSelect={() => setActiveFileId(file.id)}
            onClose={() => handleCloseFile(file.id)}
          />
        ))}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 ml-2 flex-shrink-0"
          onClick={handleNewFile}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Toolbar */}
      <EditorToolbar
        language={activeFile.language}
        onLanguageChange={handleLanguageChange}
        onSave={handleSave}
        onDownload={handleDownload}
        onUpload={handleUpload}
        fileName={activeFile.name}
      />

      {/* Editor */}
      <div className="flex-1 overflow-hidden bg-editor-bg">
        <CodeEditor
          value={activeFile.content}
          onChange={handleCodeChange}
          language={activeFile.language}
        />
      </div>

      {/* Status Bar */}
      <div className="h-7 bg-card border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Lines: {activeFile.content.split("\n").length}</span>
          <span>Characters: {activeFile.content.length}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">CodeMirror 6</span>
          <span>{activeFile.language.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
