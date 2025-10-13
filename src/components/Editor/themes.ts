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
    },
    ".cm-scroller": {
      lineHeight: lineHeight.toString(),
      fontFamily: "inherit",
    },
    ".cm-cursor": {
      transition: smoothCursor ? "all 0.1s ease" : "none",
    },
  });
};
