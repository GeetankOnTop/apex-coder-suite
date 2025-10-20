export interface CustomFont {
  name: string;
  url: string;
}

export interface EditorSettings {
  theme: string;
  fontSize: number;
  fontFamily: string;
  customFonts?: CustomFont[];
  backgroundImage?: string;
  lineHeight: number;
  tabSize: number;
  smoothCursor: boolean;
  lineNumbers: boolean;
  lineWrapping: boolean;
  highlightActiveLine: boolean;
  bracketMatching: boolean;
  autoCloseBrackets: boolean;
  autocompletion: boolean;
  foldGutter: boolean;
  showInvisibles: boolean;
  highlightWhitespace: boolean;
}

export const defaultSettings: EditorSettings = {
  theme: "oneDark",
  fontSize: 14,
  fontFamily: "Fira Code",
  backgroundImage: "",
  lineHeight: 1.6,
  tabSize: 2,
  smoothCursor: true,
  lineNumbers: true,
  lineWrapping: true,
  highlightActiveLine: true,
  bracketMatching: true,
  autoCloseBrackets: true,
  autocompletion: true,
  foldGutter: true,
  showInvisibles: false,
  highlightWhitespace: false,
};
