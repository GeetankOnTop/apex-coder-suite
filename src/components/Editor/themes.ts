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
    ".cm-scroller": {
      lineHeight: lineHeight.toString(),
      fontFamily: "inherit",
    },
    ".cm-cursor, .cm-cursor-primary": {
      borderLeftWidth: "2px",
      transition: smoothCursor ? "left 0.12s cubic-bezier(0.4, 0, 0.2, 1), top 0.12s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
    },
    ".cm-completionIcon": {
      fontSize: "90%",
      width: "1em",
      marginRight: "0.5em",
    },
    ".cm-tooltip.cm-tooltip-autocomplete": {
      borderRadius: "8px",
      border: "1px solid hsl(220 15% 20%)",
      boxShadow: "0 4px 12px hsl(220 15% 5% / 0.3)",
    },
    ".cm-tooltip-autocomplete ul li[aria-selected]": {
      borderRadius: "4px",
    },
  });
};
