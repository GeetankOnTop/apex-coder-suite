import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileTabProps {
  id: string;
  name: string;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
}

export const FileTab = ({ name, isActive, onSelect, onClose }: FileTabProps) => {
  return (
    <div
      className={`
        group relative flex items-center gap-2 px-4 py-2.5 cursor-pointer
        transition-smooth overflow-hidden
        ${
          isActive
            ? "bg-editor-bg text-foreground"
            : "bg-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground"
        }
      `}
      onClick={onSelect}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent"></div>
      )}
      
      {/* Hover glow effect */}
      <div className={`absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <span className={`relative text-sm font-medium ${isActive ? 'text-primary' : ''}`}>
        {name}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-smooth"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};
