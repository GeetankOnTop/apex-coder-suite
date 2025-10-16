import { oneDark } from "@codemirror/theme-one-dark";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

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
  { value: "device", label: "Match Device" },
];

const blueHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "hsl(200 98% 65%)", fontStyle: "italic" },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: "hsl(210 20% 98%)" },
  { tag: [t.function(t.variableName), t.labelName], color: "hsl(200 98% 65%)", fontStyle: "italic" },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "hsl(165 90% 65%)" },
  { tag: [t.definition(t.name), t.separator], color: "hsl(210 20% 98%)" },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: "hsl(190 95% 60%)" },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: "hsl(165 90% 65%)" },
  { tag: [t.meta, t.comment], color: "hsl(215 15% 55%)", fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: "hsl(200 98% 65%)", textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: "hsl(200 98% 65%)" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: "hsl(190 95% 60%)" },
  { tag: [t.processingInstruction, t.string, t.inserted], color: "hsl(130 50% 65%)" },
  { tag: t.invalid, color: "hsl(30 85% 60%)" },
]);

export const createCustomTheme = (
  fontSize: number,
  fontFamily: string,
  lineHeight: number,
  smoothCursor: boolean
) => {
  return [
    EditorView.theme({
      "&": {
        fontSize: `${fontSize}px`,
        fontFamily: fontFamily,
        height: "100%",
      },
      ".cm-content": {
        caretColor: "hsl(200 98% 65%)",
      },
      ".cm-scroller": {
        lineHeight: lineHeight.toString(),
        fontFamily: "inherit",
      },
      ".cm-cursor, .cm-cursor-primary": {
        borderLeftColor: "hsl(200 98% 65%)",
        borderLeftWidth: "2.5px",
        borderLeftStyle: "solid",
        marginLeft: "-1.25px",
        transition: smoothCursor ? "left 0.12s cubic-bezier(0.4, 0, 0.2, 1), top 0.12s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
      },
      ".cm-selectionBackground, ::selection": {
        backgroundColor: "hsl(200 98% 65% / 0.25) !important",
      },
      ".cm-focused .cm-selectionBackground": {
        backgroundColor: "hsl(200 98% 65% / 0.25) !important",
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
        borderRadius: "12px",
        border: "1px solid hsl(215 15% 25%)",
        boxShadow: "0 8px 24px hsl(215 20% 5% / 0.5)",
        padding: "6px",
      },
      ".cm-tooltip-autocomplete ul": {
        fontFamily: "inherit",
      },
      ".cm-tooltip-autocomplete ul li": {
        padding: "6px 10px",
        borderRadius: "8px",
        transition: "all 0.15s ease",
      },
      ".cm-tooltip-autocomplete ul li[aria-selected]": {
        backgroundColor: "hsl(200 98% 65% / 0.2)",
        color: "hsl(210 20% 98%)",
      },
    }, { dark: true }),
    syntaxHighlighting(blueHighlightStyle)
  ];
};
