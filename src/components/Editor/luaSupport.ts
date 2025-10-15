import { StreamLanguage, LanguageSupport } from "@codemirror/language";
import { lua } from "@codemirror/legacy-modes/mode/lua";
import { CompletionContext } from "@codemirror/autocomplete";

export const luaLanguage = StreamLanguage.define(lua);

// Lua/Luau built-in functions and keywords
const luaCompletions = [
  // Keywords
  "and", "break", "do", "else", "elseif", "end", "false", "for", "function",
  "if", "in", "local", "nil", "not", "or", "repeat", "return", "then", "true",
  "until", "while",
  // Luau specific
  "continue", "type", "typeof", "export",
  // Built-in functions
  "print", "warn", "error", "assert", "select", "tonumber", "tostring",
  "type", "typeof", "pairs", "ipairs", "next", "pcall", "xpcall",
  "setmetatable", "getmetatable", "rawget", "rawset", "rawequal",
  // String functions
  "string.byte", "string.char", "string.find", "string.format", "string.gmatch",
  "string.gsub", "string.len", "string.lower", "string.match", "string.rep",
  "string.reverse", "string.sub", "string.upper", "string.split",
  // Table functions
  "table.concat", "table.insert", "table.remove", "table.sort", "table.pack",
  "table.unpack", "table.move", "table.create", "table.find", "table.clear",
  // Math functions
  "math.abs", "math.acos", "math.asin", "math.atan", "math.atan2", "math.ceil",
  "math.cos", "math.cosh", "math.deg", "math.exp", "math.floor", "math.fmod",
  "math.frexp", "math.huge", "math.ldexp", "math.log", "math.max", "math.min",
  "math.modf", "math.pi", "math.pow", "math.rad", "math.random", "math.randomseed",
  "math.sin", "math.sinh", "math.sqrt", "math.tan", "math.tanh", "math.clamp",
  "math.sign", "math.round",
  // OS functions
  "os.time", "os.date", "os.clock", "os.difftime",
].map(label => ({ label, type: "keyword" }));

function luaAutocomplete(context: CompletionContext) {
  const word = context.matchBefore(/\w*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;
  
  return {
    from: word.from,
    options: luaCompletions,
  };
}

export function luaSupport() {
  return new LanguageSupport(luaLanguage, [
    luaLanguage.data.of({
      autocomplete: luaAutocomplete,
    }),
  ]);
}
