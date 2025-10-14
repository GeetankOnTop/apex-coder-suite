import { useEffect, useRef } from "react";

interface HtmlPreviewProps {
  content: string;
}

export const HtmlPreview = ({ content }: HtmlPreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(content);
      iframeDoc.close();
    }
  }, [content]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full bg-white"
      title="HTML Preview"
      sandbox="allow-scripts allow-same-origin"
    />
  );
};
