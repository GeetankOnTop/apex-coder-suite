import { ViewPlugin, EditorView } from "@codemirror/view";

export const smoothCursor = (enabled: boolean) => {
  if (!enabled) return [];
  
  return ViewPlugin.fromClass(
    class {
      constructor(view: EditorView) {
        this.addCursorStyles(view);
      }

      update(update: any) {
        if (update.docChanged || update.selectionSet) {
          this.addCursorStyles(update.view);
        }
      }

      addCursorStyles(view: EditorView) {
        const cursorElement = view.dom.querySelector('.cm-cursor') as HTMLElement;
        if (cursorElement) {
          cursorElement.style.transition = 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)';
        }
      }
    }
  );
};
