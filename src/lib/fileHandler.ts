import { App } from '@capacitor/app';
import { Filesystem, Directory } from '@capacitor/filesystem';

export interface FileOpenEvent {
  fileName: string;
  content: string;
  language: string;
}

export const initializeFileHandler = (
  onFileOpen: (event: FileOpenEvent) => void
) => {
  // Listen for app URL open events (file associations)
  App.addListener('appUrlOpen', async (data) => {
    try {
      const url = data.url;
      
      // Parse file path from URL
      // Format: codeflow://open?path=/storage/emulated/0/script.lua
      const urlObj = new URL(url);
      const filePath = urlObj.searchParams.get('path');
      
      if (filePath) {
        const fileName = filePath.split('/').pop() || 'file';
        const extension = fileName.split('.').pop()?.toLowerCase() || '';
        
        // Read file content
        const fileContent = await Filesystem.readFile({
          path: filePath,
        });
        
        // Convert base64 or blob to string
        let content = '';
        if (typeof fileContent.data === 'string') {
          content = fileContent.data;
        } else if (fileContent.data instanceof Blob) {
          content = await fileContent.data.text();
        } else {
          content = atob(fileContent.data as string);
        }
        
        // Determine language from extension
        const languageMap: Record<string, string> = {
          lua: 'lua',
          py: 'python',
          js: 'javascript',
          ts: 'typescript',
          jsx: 'javascript',
          tsx: 'typescript',
          html: 'html',
          css: 'css',
          json: 'json',
          md: 'markdown',
          sql: 'sql',
          cpp: 'cpp',
          java: 'java',
          rs: 'rust',
          php: 'php',
          xml: 'xml',
        };
        
        const language = languageMap[extension] || 'javascript';
        
        onFileOpen({
          fileName,
          content,
          language,
        });
      }
    } catch (error) {
      console.error('Failed to open file:', error);
    }
  });
};
