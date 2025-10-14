import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { getLanguageFromExtension } from "../Editor/languageSupport";

interface NewFileDialogProps {
  onConfirm: (fileName: string, language: string) => void;
  onCancel: () => void;
}

export const NewFileDialog = ({ onConfirm, onCancel }: NewFileDialogProps) => {
  const [fileName, setFileName] = useState("");

  const handleConfirm = () => {
    if (!fileName.trim()) return;
    
    const extension = fileName.includes(".") 
      ? fileName.split(".").pop() || "txt"
      : "txt";
    
    const language = getLanguageFromExtension(extension);
    const finalName = fileName.includes(".") ? fileName : `${fileName}.txt`;
    
    onConfirm(finalName, language);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-editor-bg/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-soft w-full max-w-md">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">New File</h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fileName">File Name (with extension)</Label>
            <Input
              id="fileName"
              placeholder="example.js"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Extension determines syntax: .js, .py, .lua, .tsx, etc.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!fileName.trim()}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};
