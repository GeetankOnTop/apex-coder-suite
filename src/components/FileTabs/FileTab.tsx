import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FileTabProps {
  id: string;
  name: string;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
}

export const FileTab = ({ name, isActive, onSelect, onClose }: FileTabProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`
        group relative flex items-center gap-2 px-4 py-2.5 cursor-pointer
        transition-smooth overflow-hidden
        ${isClosing ? "animate-[scale-out_0.3s_ease-out,fade-out_0.3s_ease-out]" : ""}
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
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent animate-in slide-in-from-bottom duration-300"></div>
      )}
      
      {/* Hover glow effect */}
      <div className={`absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <span className={`relative text-sm font-medium transition-smooth ${isActive ? 'text-primary' : ''}`}>
        {name}
      </span>
      
      <Button
        variant="ghost"
        size="icon"
        className={`
          relative h-5 w-5 p-0 rounded-md
          opacity-0 group-hover:opacity-100
          hover:bg-destructive/20 hover:text-destructive
          transition-all duration-200
          hover:scale-110 hover:rotate-90
          active:scale-95
        `}
        onClick={handleClose}
      >
        <div className="absolute inset-0 bg-destructive/10 rounded-md opacity-0 hover:opacity-100 blur-sm transition-opacity"></div>
        <X className="relative h-3.5 w-3.5 stroke-[2.5]" />
      </Button>
    </div>
  );
};
