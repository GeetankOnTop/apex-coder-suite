import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FolderOpen, Upload } from "lucide-react";

interface OpenFileDialogProps {
  onConfirm: (fileName: string, content: string, language: string) => void;
  onCancel: () => void;
}

export const OpenFileDialog = ({ onConfirm, onCancel }: OpenFileDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const content = await file.text();
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    const languageMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      lua: 'lua',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown',
      sql: 'sql',
      cpp: 'cpp',
      java: 'java',
      rs: 'rust',
      php: 'php',
      xml: 'xml',
    };

    const language = languageMap[extension] || 'javascript';
    onConfirm(file.name, content, language);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-card/95 border-border shadow-glow">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FolderOpen className="h-5 w-5 text-primary" />
            Open File
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select a file from your computer to open
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-6">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".js,.jsx,.ts,.tsx,.py,.lua,.html,.css,.json,.md,.sql,.cpp,.java,.rs,.php,.xml,.txt"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-24 text-lg shadow-glow hover:shadow-[0_6px_40px_hsl(200_98%_55%/0.3)] transition-smooth"
            size="lg"
          >
            <Upload className="mr-3 h-6 w-6" />
            Choose File to Open
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
