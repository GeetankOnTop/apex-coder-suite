import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { EditorSettings } from "@/types/settings";
import { themes } from "../Editor/themes";
import { Separator } from "@/components/ui/separator";
import { useRef } from "react";
import { toast } from "sonner";

interface SettingsPanelProps {
  settings: EditorSettings;
  onSettingsChange: (settings: EditorSettings) => void;
  onClose: () => void;
}

export const SettingsPanel = ({
  settings,
  onSettingsChange,
  onClose,
}: SettingsPanelProps) => {
  const fontInputRef = useRef<HTMLInputElement>(null);

  const handleFontUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".ttf,.otf,.woff,.woff2";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const fontName = file.name.split(".")[0];
          const reader = new FileReader();
          
          reader.onload = async (e) => {
            const fontData = e.target?.result as ArrayBuffer;
            const base64 = btoa(
              new Uint8Array(fontData).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            );
            const fontURL = `data:font/woff2;base64,${base64}`;
            
            const fontFace = new FontFace(fontName, `url(${fontURL})`);
            await fontFace.load();
            document.fonts.add(fontFace);
            
            const customFonts = settings.customFonts || [];
            const existingIndex = customFonts.findIndex(f => f.name === fontName);
            
            let updatedFonts;
            if (existingIndex >= 0) {
              updatedFonts = [...customFonts];
              updatedFonts[existingIndex] = { name: fontName, url: fontURL };
            } else {
              updatedFonts = [...customFonts, { name: fontName, url: fontURL }];
            }
            
            onSettingsChange({
              ...settings,
              customFonts: updatedFonts,
            });
            
            toast.success(`Font "${fontName}" loaded`);
          };
          
          reader.readAsArrayBuffer(file);
        } catch (error) {
          toast.error("Failed to load font");
        }
      }
    };
    input.click();
  };

  const handleBackgroundUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageURL = e.target?.result as string;
            onSettingsChange({
              ...settings,
              backgroundImage: imageURL,
            });
            toast.success("Background image set!");
          };
          reader.readAsDataURL(file);
        } catch (error) {
          toast.error("Failed to load image");
        }
      }
    };
    input.click();
  };

  const handleRemoveBackground = () => {
    onSettingsChange({
      ...settings,
      backgroundImage: "",
    });
    toast.success("Background image removed");
  };

  return (
    <div className="fixed inset-0 bg-editor-bg/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-card border border-border rounded-xl shadow-soft w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Editor Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Theme */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Theme</Label>
            <Select
              value={settings.theme}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, theme: value })
              }
            >
              <SelectTrigger className="bg-input border-border transition-all duration-300 hover:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {themes.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value} className="transition-colors duration-200">
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Background Image */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Background Image</Label>
            <div className="flex gap-2">
              <Button 
                onClick={handleBackgroundUpload} 
                variant="outline"
                className="flex-1 gap-2 transition-all duration-300 hover:scale-105"
              >
                <Upload className="h-4 w-4" />
                {settings.backgroundImage ? "Change Background" : "Upload Background"}
              </Button>
              {settings.backgroundImage && (
                <Button 
                  onClick={handleRemoveBackground} 
                  variant="destructive"
                  className="transition-all duration-300 hover:scale-105"
                >
                  Remove
                </Button>
              )}
            </div>
            {settings.backgroundImage && (
              <div className="relative h-24 rounded-lg overflow-hidden border border-border animate-in fade-in zoom-in duration-300">
                <img 
                  src={settings.backgroundImage} 
                  alt="Background preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Font Settings */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Font</Label>
            
            <div className="space-y-2">
              <Label className="text-sm">Font Family</Label>
              <div className="flex gap-2">
                <Select
                  value={settings.fontFamily}
                  onValueChange={(value) =>
                    onSettingsChange({ ...settings, fontFamily: value })
                  }
                >
                  <SelectTrigger className="flex-1 bg-input border-border transition-all duration-300 hover:border-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="Fira Code">Fira Code</SelectItem>
                    <SelectItem value="Monaco">Monaco</SelectItem>
                    <SelectItem value="Consolas">Consolas</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                    <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                    <SelectItem value="Source Code Pro">Source Code Pro</SelectItem>
                    {settings.customFonts?.map((font) => (
                      <SelectItem key={font.name} value={font.name}>
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleFontUpload} 
                  variant="outline"
                  className="gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Upload className="h-4 w-4" />
                  Upload Font
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">
                Font Size: {settings.fontSize}px
              </Label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([value]) =>
                  onSettingsChange({ ...settings, fontSize: value })
                }
                min={10}
                max={24}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">
                Line Height: {settings.lineHeight}
              </Label>
              <Slider
                value={[settings.lineHeight]}
                onValueChange={([value]) =>
                  onSettingsChange({ ...settings, lineHeight: value })
                }
                min={1.2}
                max={2.5}
                step={0.1}
              />
            </div>
          </div>

          <Separator />

          {/* Editor Settings */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Editor</Label>

            <div className="space-y-2">
              <Label className="text-sm">Tab Size: {settings.tabSize}</Label>
              <Slider
                value={[settings.tabSize]}
                onValueChange={([value]) =>
                  onSettingsChange({ ...settings, tabSize: value })
                }
                min={2}
                max={8}
                step={1}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Smooth Cursor</Label>
              <Switch
                checked={settings.smoothCursor}
                onCheckedChange={(checked) =>
                  onSettingsChange({ ...settings, smoothCursor: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Line Numbers</Label>
              <Switch
                checked={settings.lineNumbers}
                onCheckedChange={(checked) =>
                  onSettingsChange({ ...settings, lineNumbers: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Line Wrapping</Label>
              <Switch
                checked={settings.lineWrapping}
                onCheckedChange={(checked) =>
                  onSettingsChange({ ...settings, lineWrapping: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Highlight Active Line</Label>
              <Switch
                checked={settings.highlightActiveLine}
                onCheckedChange={(checked) =>
                  onSettingsChange({ ...settings, highlightActiveLine: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Bracket Matching</Label>
              <Switch
                checked={settings.bracketMatching}
                onCheckedChange={(checked) =>
                  onSettingsChange({ ...settings, bracketMatching: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Auto Close Brackets</Label>
              <Switch
                checked={settings.autoCloseBrackets}
                onCheckedChange={(checked) =>
                  onSettingsChange({ ...settings, autoCloseBrackets: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Autocompletion</Label>
              <Switch
                checked={settings.autocompletion}
                onCheckedChange={(checked) =>
                  onSettingsChange({ ...settings, autocompletion: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Code Folding</Label>
              <Switch
                checked={settings.foldGutter}
                onCheckedChange={(checked) =>
                  onSettingsChange({ ...settings, foldGutter: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Show Invisibles</Label>
              <Switch
                checked={settings.showInvisibles}
                onCheckedChange={(checked) =>
                  onSettingsChange({ ...settings, showInvisibles: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Highlight Whitespace</Label>
              <Switch
                checked={settings.highlightWhitespace}
                onCheckedChange={(checked) =>
                  onSettingsChange({
                    ...settings,
                    highlightWhitespace: checked,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
