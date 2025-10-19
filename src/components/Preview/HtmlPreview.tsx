import { useEffect, useRef } from "react";

interface HtmlPreviewProps {
  content: string;
  onExternalCssFound?: (cssUrls: string[]) => void;
}

export const HtmlPreview = ({ content, onExternalCssFound }: HtmlPreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (iframeDoc) {
      // Parse HTML to find external CSS files
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const linkTags = doc.querySelectorAll('link[rel="stylesheet"]');
      
      const cssUrls: string[] = [];
      linkTags.forEach((link) => {
        const href = link.getAttribute('href');
        if (href) {
          cssUrls.push(href);
        }
      });

      // Notify parent component about external CSS files
      if (cssUrls.length > 0 && onExternalCssFound) {
        onExternalCssFound(cssUrls);
      }

      // Enhanced HTML content with base tag for relative URLs
      const enhancedContent = content.replace(
        '<head>',
        '<head><base href="/" target="_blank">'
      );

      iframeDoc.open();
      iframeDoc.write(enhancedContent);
      iframeDoc.close();

      // Enable live reload for external CSS
      const links = iframeDoc.querySelectorAll('link[rel="stylesheet"]');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('data:')) {
          // Force reload CSS by adding timestamp
          const url = new URL(href, window.location.href);
          url.searchParams.set('t', Date.now().toString());
          link.setAttribute('href', url.toString());
        }
      });
    }
  }, [content, onExternalCssFound]);

  return (
    <div className="relative w-full h-full bg-white">
      <iframe
        ref={iframeRef}
        className="w-full h-full"
        title="HTML Preview"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
      <div className="absolute top-2 right-2 px-3 py-1 bg-primary/90 text-primary-foreground text-xs rounded-md shadow-glow backdrop-blur-sm">
        Live Preview
      </div>
    </div>
  );
};
