import { useState, useCallback, useEffect } from "react";
import { CodeEditor } from "@/components/Editor/CodeEditor";
import { EditorToolbar } from "@/components/Toolbar/EditorToolbar";
import { FileTab } from "@/components/FileTabs/FileTab";
import { SettingsPanel } from "@/components/Settings/SettingsPanel";
import { NewFileDialog } from "@/components/Dialogs/NewFileDialog";
import { Button } from "@/components/ui/button";
import { Plus, FileCode2, Settings } from "lucide-react";
import { toast } from "sonner";
import { EditorSettings, defaultSettings } from "@/types/settings";
import codeflowIcon from "@/assets/codeflow-icon.png";

interface File {
  id: string;
  name: string;
  content: string;
  language: string;
}

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("codeflow-settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to load settings");
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("codeflow-settings", JSON.stringify(settings));
  }, [settings]);

  const activeFile = files.find((f) => f.id === activeFileId);

  const handleCodeChange = useCallback(
    (newContent: string) => {
      if (!activeFileId) return;
      setFiles((prev) =>
        prev.map((f) => (f.id === activeFileId ? { ...f, content: newContent } : f))
      );
    },
    [activeFileId]
  );

  const handleLanguageChange = useCallback(
    (newLanguage: string) => {
      if (!activeFileId) return;
      setFiles((prev) =>
        prev.map((f) => (f.id === activeFileId ? { ...f, language: newLanguage } : f))
      );
    },
    [activeFileId]
  );

  const handleSave = useCallback(() => {
    if (!activeFile) return;
    localStorage.setItem(`file-${activeFile.id}`, activeFile.content);
    toast.success("File saved successfully!");
  }, [activeFile]);

  const handleDownload = useCallback(() => {
    if (!activeFile) return;
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
          const { getLanguageFromExtension } = require("@/components/Editor/languageSupport");
          const newFile: File = {
            id: Date.now().toString(),
            name: file.name,
            content,
            language: getLanguageFromExtension(extension),
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

  const handleNewFile = (fileName: string, language: string) => {
    const newFile: File = {
      id: Date.now().toString(),
      name: fileName,
      content: `// ${fileName}\n`,
      language,
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setShowNewFileDialog(false);
    toast.success("New file created!");
  };

  const handleCloseFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (activeFileId === id) {
      const remainingFiles = files.filter((f) => f.id !== id);
      setActiveFileId(remainingFiles.length > 0 ? remainingFiles[0].id : null);
    }
    toast.success("File closed!");
  };

  return (
    <div className="h-full w-full flex flex-col bg-editor-bg overflow-hidden">
      {/* File Tabs & Actions */}
      <div className="bg-card border-b border-border flex items-center justify-between">
        <div className="flex items-center overflow-x-auto flex-1">
          {files.length > 0 ? (
            files.map((file) => (
              <FileTab
                key={file.id}
                id={file.id}
                name={file.name}
                isActive={file.id === activeFileId}
                onSelect={() => setActiveFileId(file.id)}
                onClose={() => handleCloseFile(file.id)}
              />
            ))
          ) : (
            <div className="px-4 py-2 text-muted-foreground text-sm">No files open</div>
          )}
        </div>

        <div className="flex items-center gap-1 px-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setShowNewFileDialog(true)}
            title="New File"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setShowSettings(true)}
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Toolbar - only show if file is open */}
      {activeFile && (
        <EditorToolbar
          language={activeFile.language}
          onLanguageChange={handleLanguageChange}
          onSave={handleSave}
          onDownload={handleDownload}
          onUpload={handleUpload}
          fileName={activeFile.name}
        />
      )}

      {/* Editor or Empty State */}
      <div className="flex-1 overflow-hidden bg-editor-bg">
        {activeFile ? (
          <CodeEditor
            value={activeFile.content}
            onChange={handleCodeChange}
            language={activeFile.language}
            settings={settings}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <img
              src={codeflowIcon}
              alt="CodeFlow"
              className="w-32 h-32 mb-6 opacity-80"
            />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              CodeFlow
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              Professional code editor with multi-language support, advanced features, and full customization
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowNewFileDialog(true)}
                className="gap-2"
              >
                <FileCode2 className="h-4 w-4" />
                New File
              </Button>
              <Button onClick={handleUpload} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Open File
              </Button>
            </div>
            <div className="mt-8 text-sm text-muted-foreground space-y-1">
              <p>✨ 17+ languages including Lua & Luau</p>
              <p>🎨 Multiple themes & custom fonts</p>
              <p>⚡ Advanced features: autocomplete, folding, search</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar - only show if file is open */}
      {activeFile && (
        <div className="h-7 bg-card border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Lines: {activeFile.content.split("\n").length}</span>
            <span>Characters: {activeFile.content.length}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">CodeFlow</span>
            <span>{activeFile.language.toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* New File Dialog */}
      {showNewFileDialog && (
        <NewFileDialog
          onConfirm={handleNewFile}
          onCancel={() => setShowNewFileDialog(false)}
        />
      )}
    </div>
  );
};

export default Index;
