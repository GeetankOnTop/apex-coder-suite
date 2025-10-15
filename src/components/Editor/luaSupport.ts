import { StreamLanguage, LanguageSupport } from "@codemirror/language";
import { lua } from "@codemirror/legacy-modes/mode/lua";
import { CompletionContext } from "@codemirror/autocomplete";

export const luaLanguage = StreamLanguage.define(lua);

// Comprehensive Lua/Luau completions
const luaCompletions = [
  // Keywords
  "and", "break", "do", "else", "elseif", "end", "false", "for", "function",
  "if", "in", "local", "nil", "not", "or", "repeat", "return", "then", "true",
  "until", "while", "goto",
  
  // Luau specific keywords
  "continue", "type", "typeof", "export",
  
  // Basic functions
  "assert", "collectgarbage", "dofile", "error", "getfenv", "getmetatable",
  "ipairs", "load", "loadfile", "loadstring", "next", "pairs", "pcall",
  "print", "rawequal", "rawget", "rawlen", "rawset", "select", "setfenv",
  "setmetatable", "tonumber", "tostring", "type", "typeof", "unpack", "warn",
  "xpcall", "_G", "_VERSION",
  
  // String library
  "string.byte", "string.char", "string.dump", "string.find", "string.format",
  "string.gmatch", "string.gsub", "string.len", "string.lower", "string.match",
  "string.pack", "string.packsize", "string.rep", "string.reverse", "string.sub",
  "string.unpack", "string.upper", "string.split", "string.join",
  
  // Table library
  "table.concat", "table.insert", "table.maxn", "table.move", "table.pack",
  "table.remove", "table.sort", "table.unpack", "table.create", "table.find",
  "table.clear", "table.freeze", "table.isfrozen", "table.clone", "table.getn",
  
  // Math library
  "math.abs", "math.acos", "math.asin", "math.atan", "math.atan2", "math.ceil",
  "math.cos", "math.cosh", "math.deg", "math.exp", "math.floor", "math.fmod",
  "math.frexp", "math.huge", "math.ldexp", "math.log", "math.log10", "math.max",
  "math.min", "math.modf", "math.pi", "math.pow", "math.rad", "math.random",
  "math.randomseed", "math.sin", "math.sinh", "math.sqrt", "math.tan", "math.tanh",
  "math.clamp", "math.sign", "math.round", "math.noise", "math.map",
  
  // Bit32 library (Luau)
  "bit32.arshift", "bit32.band", "bit32.bnot", "bit32.bor", "bit32.btest",
  "bit32.bxor", "bit32.extract", "bit32.lrotate", "bit32.lshift", "bit32.replace",
  "bit32.rrotate", "bit32.rshift", "bit32.countlz", "bit32.countrz",
  
  // OS library
  "os.time", "os.date", "os.clock", "os.difftime", "os.execute", "os.exit",
  "os.getenv", "os.remove", "os.rename", "os.setlocale", "os.tmpname",
  
  // IO library
  "io.close", "io.flush", "io.input", "io.lines", "io.open", "io.output",
  "io.popen", "io.read", "io.tmpfile", "io.type", "io.write",
  
  // Debug library
  "debug.debug", "debug.gethook", "debug.getinfo", "debug.getlocal",
  "debug.getmetatable", "debug.getregistry", "debug.getupvalue", "debug.getuservalue",
  "debug.sethook", "debug.setlocal", "debug.setmetatable", "debug.setupvalue",
  "debug.setuservalue", "debug.traceback", "debug.upvalueid", "debug.upvaluejoin",
  "debug.profilebegin", "debug.profileend",
  
  // Coroutine library
  "coroutine.create", "coroutine.resume", "coroutine.running", "coroutine.status",
  "coroutine.wrap", "coroutine.yield", "coroutine.isyieldable", "coroutine.close",
  
  // UTF8 library
  "utf8.char", "utf8.charpattern", "utf8.codes", "utf8.codepoint", "utf8.len",
  "utf8.offset", "utf8.graphemes", "utf8.nfcnormalize", "utf8.nfdnormalize",
  
  // Package/Module
  "require", "module", "package.config", "package.cpath", "package.loaded",
  "package.loadlib", "package.path", "package.preload", "package.searchers",
  "package.searchpath",
  
  // Roblox specific (Luau)
  "game", "workspace", "script", "Instance.new", "wait", "spawn", "delay",
  "tick", "time", "elapsedTime", "version", "stats", "settings", "UserSettings",
  "Enum", "Color3.new", "Color3.fromRGB", "Color3.fromHSV", "Vector2.new",
  "Vector3.new", "UDim.new", "UDim2.new", "CFrame.new", "Region3.new",
  "NumberRange.new", "NumberSequence.new", "ColorSequence.new", "Ray.new",
  "Rect.new", "TweenInfo.new", "PathWaypoint.new", "PhysicalProperties.new",
  "BrickColor.new", "BrickColor.random", "BrickColor.palette",
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
