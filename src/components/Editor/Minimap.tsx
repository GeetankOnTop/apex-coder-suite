import { useEffect, useRef } from "react";

interface MinimapProps {
  code: string;
  lineHeight: number;
  fontSize: number;
}

export const Minimap = ({ code, lineHeight, fontSize }: MinimapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lines = code.split("\n");
    const miniLineHeight = 2;
    const width = 100;
    const height = lines.length * miniLineHeight;

    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, width, height);

    // Draw lines
    ctx.fillStyle = "#4a90e2";
    lines.forEach((line, index) => {
      const lineLength = Math.min(line.length, width);
      if (lineLength > 0) {
        ctx.fillRect(2, index * miniLineHeight, lineLength * 0.5, 1);
      }
    });
  }, [code]);

  return (
    <div className="w-[100px] h-full overflow-y-auto bg-editor-bg border-l border-border">
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
};
