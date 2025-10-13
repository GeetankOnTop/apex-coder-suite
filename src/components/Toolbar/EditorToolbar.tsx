import { 
  Play, 
  Download, 
  Upload, 
  Settings, 
  Moon, 
  Sun, 
  Save,
  FileCode,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages } from "../Editor/languageSupport";

interface EditorToolbarProps {
  language: string;
  onLanguageChange: (language: string) => void;
  onSave: () => void;
  onDownload: () => void;
  onUpload: () => void;
  fileName: string;
}

export const EditorToolbar = ({
  language,
  onLanguageChange,
  onSave,
  onDownload,
  onUpload,
  fileName,
}: EditorToolbarProps) => {
  return (
    <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4 gap-4">
      <div className="flex items-center gap-3">
        <FileCode className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium text-foreground hidden sm:inline">
          {fileName}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onSave}
          className="h-9 w-9"
          title="Save (Ctrl+S)"
        >
          <Save className="h-4 w-4" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onDownload}
          className="h-9 w-9"
          title="Download"
        >
          <Download className="h-4 w-4" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onUpload}
          className="h-9 w-9"
          title="Upload File"
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
