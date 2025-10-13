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
        group flex items-center gap-2 px-4 py-2 border-r border-border cursor-pointer
        transition-all duration-200
        ${isActive 
          ? "bg-background text-foreground border-b-2 border-b-primary" 
          : "bg-card text-muted-foreground hover:bg-background/50"
        }
      `}
      onClick={onSelect}
    >
      <span className="text-sm font-medium">{name}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
