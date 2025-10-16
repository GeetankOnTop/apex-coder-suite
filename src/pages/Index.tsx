import { useState, useCallback, useEffect } from "react";
import { CodeEditor } from "@/components/Editor/CodeEditor";
import { FileTab } from "@/components/FileTabs/FileTab";
import { SettingsPanel } from "@/components/Settings/SettingsPanel";
import { NewFileDialog } from "@/components/Dialogs/NewFileDialog";
import { HtmlPreview } from "@/components/Preview/HtmlPreview";
import { CodeRunner } from "@/components/CodeRunner/CodeRunner";
import { Minimap } from "@/components/Editor/Minimap";
import { Button } from "@/components/ui/button";
import { Plus, FileCode2, Settings, Eye, EyeOff, Play } from "lucide-react";
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
  const [showPreview, setShowPreview] = useState(false);
  const [showRunner, setShowRunner] = useState(false);

  // Load everything from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("codeflow-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        
        // Handle device theme preference
        if (parsed.theme === "device") {
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          parsed.theme = prefersDark ? "oneDark" : "githubLight";
        }
        
        setSettings(parsed);
        
        // Load custom fonts
        if (parsed.customFonts) {
          parsed.customFonts.forEach(async (font: { name: string; url: string }) => {
            try {
              const fontFace = new FontFace(font.name, `url(${font.url})`);
              await fontFace.load();
              document.fonts.add(fontFace);
            } catch (e) {
              console.error(`Failed to load font: ${font.name}`);
            }
          });
        }
      } catch (e) {
        console.error("Failed to load settings");
      }
    }
    
    // Listen for device theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e: MediaQueryListEvent) => {
      const savedSettings = localStorage.getItem("codeflow-settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.theme === "device") {
          setSettings((prev) => ({
            ...prev,
            theme: e.matches ? "oneDark" : "githubLight",
          }));
        }
      }
    };
    
    mediaQuery.addEventListener("change", handleThemeChange);
    return () => mediaQuery.removeEventListener("change", handleThemeChange);

    const savedFiles = localStorage.getItem("codeflow-files");
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles);
        setFiles(parsedFiles);
        if (parsedFiles.length > 0) {
          const savedActiveId = localStorage.getItem("codeflow-active-file");
          setActiveFileId(savedActiveId || parsedFiles[0].id);
        }
      } catch (e) {
        console.error("Failed to load files");
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("codeflow-settings", JSON.stringify(settings));
  }, [settings]);

  // Save files to localStorage
  useEffect(() => {
    if (files.length > 0) {
      localStorage.setItem("codeflow-files", JSON.stringify(files));
    }
  }, [files]);

  // Save active file ID
  useEffect(() => {
    if (activeFileId) {
      localStorage.setItem("codeflow-active-file", activeFileId);
    }
  }, [activeFileId]);

  const activeFile = files.find((f) => f.id === activeFileId);
  const isHtmlFile = activeFile?.language === "html" || activeFile?.name.endsWith(".html");
  const canRun = activeFile?.language === "python" || activeFile?.language === "lua" || activeFile?.language === "luau";

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
      {/* Header with centered logo and actions */}
      <div className="bg-card border-b border-border flex items-center justify-center px-4 py-3 gap-4 transition-all duration-300">
        {!activeFile && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
            <img src={codeflowIcon} alt="CodeFlow" className="w-8 h-8" />
            <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
              CodeFlow
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          {canRun && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setShowRunner(!showRunner)}
              title={showRunner ? "Hide Runner" : "Show Runner"}
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
          {isHtmlFile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setShowPreview(!showPreview)}
              title={showPreview ? "Hide Preview" : "Show Preview"}
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
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

      {/* File Tabs - Centered */}
      {files.length > 0 && (
        <div className="bg-card border-b border-border flex items-center justify-center overflow-x-auto">
          <div className="flex items-center gap-1 px-4">
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
          </div>
        </div>
      )}

      {/* Editor with Minimap and Runner */}
      <div className="flex-1 overflow-hidden bg-editor-bg flex">
        {activeFile ? (
          <>
            <div className={`${(showPreview && isHtmlFile) || showRunner ? 'w-1/2' : 'flex-1'} h-full flex transition-all duration-300`}>
              <div className="flex-1 animate-in fade-in duration-300">
                <CodeEditor
                  value={activeFile.content}
                  onChange={handleCodeChange}
                  language={activeFile.language}
                  settings={settings}
                />
              </div>
              <Minimap 
                code={activeFile.content} 
                lineHeight={settings.lineHeight}
                fontSize={settings.fontSize}
              />
            </div>
            {showPreview && isHtmlFile && (
              <div className="w-1/2 h-full animate-in slide-in-from-right duration-300">
                <HtmlPreview content={activeFile.content} />
              </div>
            )}
            {showRunner && canRun && (
              <div className="w-1/2 h-full animate-in slide-in-from-right duration-300">
                <CodeRunner 
                  code={activeFile.content}
                  language={activeFile.language}
                  onClose={() => setShowRunner(false)}
                />
              </div>
            )}
          </>
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
              Professional code editor with Python & Lua execution, live HTML preview, and comprehensive autocomplete
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowNewFileDialog(true)}
                className="gap-2"
              >
                <FileCode2 className="h-4 w-4" />
                New File
              </Button>
            </div>
            <div className="mt-8 text-sm text-muted-foreground space-y-1">
              <p>17+ languages with syntax highlighting</p>
              <p>Run Python and Lua code instantly</p>
              <p>200+ Lua/Luau autocomplete suggestions</p>
              <p>Code minimap for quick navigation</p>
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
