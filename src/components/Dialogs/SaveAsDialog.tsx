import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";

interface SaveAsDialogProps {
  currentName: string;
  onConfirm: (newName: string) => void;
  onCancel: () => void;
}

export const SaveAsDialog = ({ currentName, onConfirm, onCancel }: SaveAsDialogProps) => {
  const [fileName, setFileName] = useState(currentName);

  const handleConfirm = () => {
    if (fileName.trim()) {
      onConfirm(fileName.trim());
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-card/95 border-border shadow-glow">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            Save File As
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter a new name for your file
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="filename" className="text-foreground">
              File Name
            </Label>
            <Input
              id="filename"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              placeholder="my-file.js"
              className="bg-input border-border focus:ring-primary focus:border-primary transition-smooth"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!fileName.trim()} className="shadow-glow">
            Save As
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
