import { oneDark } from "@codemirror/theme-one-dark";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { EditorView } from "@codemirror/view";

export const getTheme = (themeName: string) => {
  switch (themeName) {
    case "oneDark":
      return oneDark;
    case "vscode":
      return vscodeDark;
    case "githubLight":
      return githubLight;
    case "githubDark":
      return githubDark;
    case "dracula":
      return dracula;
    default:
      return oneDark;
  }
};

export const themes = [
  { value: "oneDark", label: "One Dark" },
  { value: "vscode", label: "VS Code Dark" },
  { value: "githubLight", label: "GitHub Light" },
  { value: "githubDark", label: "GitHub Dark" },
  { value: "dracula", label: "Dracula" },
];

export const createCustomTheme = (
  fontSize: number,
  fontFamily: string,
  lineHeight: number,
  smoothCursor: boolean
) => {
  return EditorView.theme({
    "&": {
      fontSize: `${fontSize}px`,
      fontFamily: fontFamily,
      height: "100%",
    },
    ".cm-content": {
      caretColor: "hsl(200 98% 55%)",
    },
    ".cm-scroller": {
      lineHeight: lineHeight.toString(),
      fontFamily: "inherit",
    },
    ".cm-cursor, .cm-cursor-primary": {
      borderLeftColor: "hsl(200 98% 55%)",
      borderLeftWidth: "2.5px",
      borderLeftStyle: "solid",
      marginLeft: "-1.25px",
    },
    ".cm-selectionBackground, ::selection": {
      backgroundColor: "hsl(200 98% 55% / 0.3) !important",
    },
    ".cm-focused .cm-selectionBackground": {
      backgroundColor: "hsl(200 98% 55% / 0.3) !important",
    },
    ".cm-activeLine": {
      backgroundColor: "hsl(215 15% 15%)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "hsl(215 15% 15%)",
    },
    ".cm-completionIcon": {
      fontSize: "90%",
      width: "1.2em",
      marginRight: "0.6em",
      opacity: 0.9,
    },
    ".cm-tooltip.cm-tooltip-autocomplete": {
      backgroundColor: "hsl(215 20% 14%)",
      borderRadius: "10px",
      border: "1px solid hsl(215 15% 25%)",
      boxShadow: "0 8px 24px hsl(215 20% 5% / 0.4)",
      padding: "4px",
    },
    ".cm-tooltip-autocomplete ul": {
      fontFamily: "inherit",
    },
    ".cm-tooltip-autocomplete ul li": {
      padding: "4px 8px",
      borderRadius: "6px",
    },
    ".cm-tooltip-autocomplete ul li[aria-selected]": {
      backgroundColor: "hsl(200 98% 55% / 0.15)",
      color: "hsl(210 20% 98%)",
    },
  }, { dark: true });
};
