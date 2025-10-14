import { useEffect, useRef } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { 
  syntaxHighlighting, 
  defaultHighlightStyle,
  bracketMatching,
  foldGutter,
  foldKeymap,
  indentOnInput
} from "@codemirror/language";
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { lintKeymap } from "@codemirror/lint";
import { getLanguageExtension } from "./languageSupport";
import { getTheme, createCustomTheme } from "./themes";
import { smoothCursor } from "./smoothCursor";
import { EditorSettings } from "@/types/settings";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  settings: EditorSettings;
}

export const CodeEditor = ({ value, onChange, language, settings }: CodeEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const extensions = [
      drawSelection(),
      settings.lineWrapping ? EditorView.lineWrapping : [],
      history(),
      settings.foldGutter ? foldGutter() : [],
      settings.bracketMatching ? bracketMatching() : [],
      settings.autoCloseBrackets ? closeBrackets() : [],
      settings.autocompletion ? autocompletion({
        activateOnTyping: true,
        icons: true,
        closeOnBlur: true,
        maxRenderedOptions: 100,
        defaultKeymap: true,
      }) : [],
      highlightSelectionMatches(),
      syntaxHighlighting(defaultHighlightStyle),
      indentOnInput(),
      settings.highlightActiveLine ? highlightActiveLine() : [],
      settings.highlightActiveLine ? highlightActiveLineGutter() : [],
      settings.lineNumbers ? lineNumbers() : [],
      smoothCursor(settings.smoothCursor),
      getTheme(settings.theme),
      createCustomTheme(
        settings.fontSize,
        settings.fontFamily,
        settings.lineHeight,
        settings.smoothCursor
      ),
      getLanguageExtension(language),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...closeBracketsKeymap,
        ...searchKeymap,
        ...lintKeymap,
        indentWithTab,
      ]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChange(update.state.doc.toString());
        }
      }),
    ];

    const state = EditorState.create({
      doc: value,
      extensions: extensions.flat(),
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      viewRef.current?.destroy();
    };
  }, [language, settings]);

  useEffect(() => {
    if (viewRef.current && value !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return <div ref={editorRef} className="h-full w-full" />;
};
