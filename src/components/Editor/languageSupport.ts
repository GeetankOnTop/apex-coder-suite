import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { php } from "@codemirror/lang-php";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { rust } from "@codemirror/lang-rust";
import { luaSupport } from "./luaSupport";

export const getLanguageExtension = (language: string) => {
  switch (language.toLowerCase()) {
    case "javascript":
    case "js":
      return javascript();
    case "typescript":
    case "ts":
      return javascript({ typescript: true });
    case "jsx":
      return javascript({ jsx: true });
    case "tsx":
      return javascript({ typescript: true, jsx: true });
    case "python":
    case "py":
      return python();
    case "html":
      return html();
    case "css":
      return css();
    case "json":
      return json();
    case "markdown":
    case "md":
      return markdown();
    case "sql":
      return sql();
    case "xml":
      return xml();
    case "php":
      return php();
    case "java":
      return java();
    case "cpp":
    case "c++":
    case "c":
      return cpp();
    case "rust":
    case "rs":
      return rust();
    case "lua":
      return luaSupport();
    case "luau":
      return luaSupport(); // Luau uses Lua syntax
    default:
      return javascript();
  }
};

export const getLanguageFromExtension = (extension: string): string => {
  const extMap: Record<string, string> = {
    js: "javascript",
    mjs: "javascript",
    cjs: "javascript",
    ts: "typescript",
    tsx: "tsx",
    jsx: "jsx",
    py: "python",
    pyw: "python",
    html: "html",
    htm: "html",
    css: "css",
    scss: "css",
    sass: "css",
    json: "json",
    md: "markdown",
    markdown: "markdown",
    sql: "sql",
    xml: "xml",
    php: "php",
    java: "java",
    cpp: "cpp",
    cc: "cpp",
    cxx: "cpp",
    c: "cpp",
    h: "cpp",
    hpp: "cpp",
    rs: "rust",
    lua: "lua",
    luau: "luau",
  };
  return extMap[extension.toLowerCase()] || "javascript";
};

export const languages = [
  { value: "javascript", label: "JavaScript", extensions: [".js", ".mjs", ".cjs"] },
  { value: "typescript", label: "TypeScript", extensions: [".ts"] },
  { value: "jsx", label: "React JSX", extensions: [".jsx"] },
  { value: "tsx", label: "React TSX", extensions: [".tsx"] },
  { value: "python", label: "Python", extensions: [".py", ".pyw"] },
  { value: "html", label: "HTML", extensions: [".html", ".htm"] },
  { value: "css", label: "CSS", extensions: [".css", ".scss", ".sass"] },
  { value: "json", label: "JSON", extensions: [".json"] },
  { value: "markdown", label: "Markdown", extensions: [".md", ".markdown"] },
  { value: "sql", label: "SQL", extensions: [".sql"] },
  { value: "xml", label: "XML", extensions: [".xml"] },
  { value: "php", label: "PHP", extensions: [".php"] },
  { value: "java", label: "Java", extensions: [".java"] },
  { value: "cpp", label: "C++", extensions: [".cpp", ".cc", ".cxx", ".c", ".h", ".hpp"] },
  { value: "rust", label: "Rust", extensions: [".rs"] },
  { value: "lua", label: "Lua", extensions: [".lua"] },
  { value: "luau", label: "Luau", extensions: [".luau"] },
];

