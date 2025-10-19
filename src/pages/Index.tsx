import { useState, useCallback, useEffect } from "react";
import { CodeEditor } from "@/components/Editor/CodeEditor";
import { FileTab } from "@/components/FileTabs/FileTab";
import { SettingsPanel } from "@/components/Settings/SettingsPanel";
import { NewFileDialog } from "@/components/Dialogs/NewFileDialog";
import { SaveAsDialog } from "@/components/Dialogs/SaveAsDialog";
import { OpenFileDialog } from "@/components/Dialogs/OpenFileDialog";
import { HtmlPreview } from "@/components/Preview/HtmlPreview";
import { CodeRunner } from "@/components/CodeRunner/CodeRunner";
import { Button } from "@/components/ui/button";
import { Plus, FileCode2, Settings, Eye, EyeOff, Play, Save, FolderOpen, FilePlus } from "lucide-react";
import { toast } from "sonner";
import { EditorSettings, defaultSettings } from "@/types/settings";
import { secureStorage } from "@/lib/encryption";
import { initializeFileHandler } from "@/lib/fileHandler";
import { discordRPC } from "@/lib/discordRPC";
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
  const [showSaveAsDialog, setShowSaveAsDialog] = useState(false);
  const [showOpenFileDialog, setShowOpenFileDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showRunner, setShowRunner] = useState(false);

  // Load everything from secureStorage on mount
  useEffect(() => {
    const savedSettings = secureStorage.getItem("codeflow-settings");
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
      const savedSettings = secureStorage.getItem("codeflow-settings");
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

    const savedFiles = secureStorage.getItem("codeflow-files");
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles);
        setFiles(parsedFiles);
        if (parsedFiles.length > 0) {
          const savedActiveId = secureStorage.getItem("codeflow-active-file");
          setActiveFileId(savedActiveId || parsedFiles[0].id);
        }
      } catch (e) {
        console.error("Failed to load files");
      }
    }

    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  // Initialize file handler for native app
  useEffect(() => {
    initializeFileHandler(({ fileName, content, language }) => {
      const newFile: File = {
        id: Date.now().toString(),
        name: fileName,
        content,
        language,
      };
      setFiles((prev) => [...prev, newFile]);
      setActiveFileId(newFile.id);
      toast.success(`Opened ${fileName} from file manager!`, {
        description: "File opened successfully",
      });
    });

    // Connect Discord RPC
    discordRPC.connect();

    return () => {
      discordRPC.disconnect();
    };
  }, []);

  // Save settings to secureStorage
  useEffect(() => {
    secureStorage.setItem("codeflow-settings", JSON.stringify(settings));
  }, [settings]);

  // Save files to secureStorage
  useEffect(() => {
    if (files.length > 0) {
      secureStorage.setItem("codeflow-files", JSON.stringify(files));
    }
  }, [files]);

  // Save active file ID
  useEffect(() => {
    if (activeFileId) {
      secureStorage.setItem("codeflow-active-file", activeFileId);
    }
  }, [activeFileId]);

  const activeFile = files.find((f) => f.id === activeFileId);
  const isHtmlFile = activeFile?.language === "html" || activeFile?.name.endsWith(".html");
  const canRun = activeFile?.language === "python" || activeFile?.language === "lua" || activeFile?.language === "luau";

  // Update Discord RPC when active file changes
  useEffect(() => {
    if (activeFile) {
      const lines = activeFile.content.split("\n").length;
      discordRPC.updateActivity(activeFile.name, activeFile.language, lines);
    } else {
      discordRPC.clearActivity();
    }
  }, [activeFile]);

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

  const handleSave = () => {
    toast.success("File saved!", {
      description: "Your changes are secured in encrypted storage",
    });
  };

  const handleSaveAs = (newName: string) => {
    if (!activeFileId) return;
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, name: newName } : f))
    );
    setShowSaveAsDialog(false);
    toast.success("File saved as " + newName, {
      description: "Encrypted and stored securely",
    });
  };

  const handleOpenFile = (fileName: string, content: string, language: string) => {
    const newFile: File = {
      id: Date.now().toString(),
      name: fileName,
      content,
      language,
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setShowOpenFileDialog(false);
    toast.success("File opened!", {
      description: fileName,
    });
  };

  const handleExternalCssFound = async (cssUrls: string[]) => {
    // Auto-open external CSS files as tabs
    for (const cssUrl of cssUrls) {
      try {
        const response = await fetch(cssUrl);
        const content = await response.text();
        const fileName = cssUrl.split('/').pop() || 'styles.css';
        
        // Check if file already exists
        const exists = files.some(f => f.name === fileName);
        if (!exists) {
          const newFile: File = {
            id: Date.now().toString() + Math.random(),
            name: fileName,
            content,
            language: 'css',
          };
          setFiles((prev) => [...prev, newFile]);
          toast.success(`Auto-opened ${fileName}`, {
            description: "External CSS file loaded",
          });
        }
      } catch (error) {
        console.error(`Failed to load CSS: ${cssUrl}`, error);
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-editor-bg overflow-hidden">
      {/* Header with stunning gradient and actions */}
      <div className="relative bg-gradient-to-r from-card via-card/95 to-card border-b border-border/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
        <div className="relative flex items-center justify-between px-6 py-3">
          {/* Logo Section */}
          <div className={`flex items-center gap-3 transition-all duration-500 ${activeFile ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
              <img src={codeflowIcon} alt="CodeFlow" className="relative w-9 h-9" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-in fade-in slide-in-from-left-3 duration-700">
              CodeFlow
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {activeFile && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-smooth"
                  onClick={handleSave}
                  title="Save (Ctrl+S)"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-secondary/10 hover:text-secondary transition-smooth"
                  onClick={() => setShowSaveAsDialog(true)}
                  title="Save As"
                >
                  <FilePlus className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-accent/10 hover:text-accent transition-smooth"
              onClick={() => setShowOpenFileDialog(true)}
              title="Open File"
            >
              <FolderOpen className="h-4 w-4" />
            </Button>
            {canRun && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-smooth"
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
                className="h-9 w-9 hover:bg-secondary/10 hover:text-secondary transition-smooth"
                onClick={() => setShowPreview(!showPreview)}
                title={showPreview ? "Hide Preview" : "Show Preview"}
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            )}
            <div className="h-6 w-px bg-border/50 mx-1"></div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-accent/10 hover:text-accent transition-smooth"
              onClick={() => setShowNewFileDialog(true)}
              title="New File"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-muted/50 transition-smooth"
              onClick={() => setShowSettings(true)}
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* File Tabs - Stunning Design */}
      {files.length > 0 && (
        <div className="relative bg-card/80 border-b border-border/50 backdrop-blur-md overflow-x-auto">
          <div className="absolute inset-0 bg-gradient-accent opacity-5"></div>
          <div className="relative flex items-center gap-1 px-4 py-1">
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

      {/* Editor and Runner */}
      <div className="flex-1 overflow-hidden bg-editor-bg flex">
        {activeFile ? (
          <>
            <div className={`${(showPreview && isHtmlFile) || showRunner ? 'w-1/2' : 'flex-1'} h-full transition-all duration-300 animate-in fade-in`}>
              <CodeEditor
                value={activeFile.content}
                onChange={handleCodeChange}
                language={activeFile.language}
                settings={settings}
              />
            </div>
            {showPreview && isHtmlFile && (
              <div className="w-1/2 h-full animate-in slide-in-from-right duration-300">
                <HtmlPreview 
                  content={activeFile.content}
                  onExternalCssFound={handleExternalCssFound}
                />
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
          <div className="h-full flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="relative mb-8 animate-in fade-in zoom-in duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 blur-2xl rounded-full"></div>
                <img
                  src={codeflowIcon}
                  alt="CodeFlow"
                  className="relative w-40 h-40 drop-shadow-2xl"
                />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                CodeFlow
              </h1>
              <p className="text-muted-foreground mb-10 max-w-xl text-lg animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300">
                Professional code editor with Python & Lua execution, live HTML preview, and comprehensive autocomplete
              </p>
              <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-500">
                <Button
                  onClick={() => setShowNewFileDialog(true)}
                  className="gap-2 text-base px-6 py-6 shadow-glow hover:shadow-[0_6px_40px_hsl(200_98%_55%/0.35)] transition-smooth"
                  size="lg"
                >
                  <FileCode2 className="h-5 w-5" />
                  New File
                </Button>
                <Button
                  onClick={() => setShowOpenFileDialog(true)}
                  variant="outline"
                  className="gap-2 text-base px-6 py-6 bg-card/50 backdrop-blur-sm hover:bg-accent/20 hover:border-accent transition-smooth"
                  size="lg"
                >
                  <FolderOpen className="h-5 w-5" />
                  Open File
                </Button>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-4 text-sm text-muted-foreground max-w-lg animate-in fade-in slide-in-from-bottom duration-700 delay-700">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-primary backdrop-blur-sm border border-primary/20">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>17+ languages</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-accent backdrop-blur-sm border border-secondary/20">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span>Python & Lua runners</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-primary backdrop-blur-sm border border-accent/20">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>200+ autocomplete</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-accent backdrop-blur-sm border border-primary/20">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Encrypted storage</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar - Enhanced */}
      {activeFile && (
        <div className="relative h-7 bg-gradient-to-r from-card via-card/95 to-card border-t border-border/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
          <div className="relative flex items-center justify-between px-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                <span>Lines: {activeFile.content.split("\n").length}</span>
              </div>
              <span>Characters: {activeFile.content.length}</span>
              <span className="text-primary/70">🔒 Encrypted</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline font-medium">CodeFlow</span>
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                {activeFile.language.toUpperCase()}
              </span>
            </div>
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

      {/* Dialogs */}
      {showNewFileDialog && (
        <NewFileDialog
          onConfirm={handleNewFile}
          onCancel={() => setShowNewFileDialog(false)}
        />
      )}
      {showSaveAsDialog && activeFile && (
        <SaveAsDialog
          currentName={activeFile.name}
          onConfirm={handleSaveAs}
          onCancel={() => setShowSaveAsDialog(false)}
        />
      )}
      {showOpenFileDialog && (
        <OpenFileDialog
          onConfirm={handleOpenFile}
          onCancel={() => setShowOpenFileDialog(false)}
        />
      )}
    </div>
  );
};

export default Index;
