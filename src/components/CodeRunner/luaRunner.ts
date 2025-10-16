let luaInstance: any = null;

export async function initLua() {
  if (luaInstance) return luaInstance;
  
  try {
    // @ts-ignore
    const fengari = await import('fengari-web');
    luaInstance = fengari;
    return luaInstance;
  } catch (error) {
    console.error('Failed to load Fengari:', error);
    throw error;
  }
}

export async function runLua(code: string): Promise<{ output: string; error?: string }> {
  try {
    const { lua, lauxlib, lualib, to_jsstring } = await initLua();
    
    const L = lauxlib.luaL_newstate();
    if (!L) {
      return { output: '', error: 'Failed to create Lua state' };
    }
    
    lualib.luaL_openlibs(L);
    
    // Override print function to capture output
    const printFunc = `
      local outputs = {}
      local old_print = print
      print = function(...)
        local args = {...}
        local strs = {}
        for i, v in ipairs(args) do
          strs[i] = tostring(v)
        end
        table.insert(outputs, table.concat(strs, "\\t"))
      end
      
      _G.get_output = function()
        return table.concat(outputs, "\\n")
      end
    `;
    
    // Load the print override
    const overrideResult = lauxlib.luaL_dostring(L, to_jsstring(printFunc));
    if (overrideResult !== 0) {
      const errorMsg = lua.lua_tojsstring(L, -1);
      lua.lua_close(L);
      return { output: '', error: `Setup error: ${errorMsg}` };
    }
    
    // Execute user code
    const result = lauxlib.luaL_dostring(L, to_jsstring(code));
    
    if (result !== 0) {
      const errorMsg = lua.lua_tojsstring(L, -1);
      lua.lua_close(L);
      return { output: '', error: errorMsg };
    }
    
    // Get captured output
    lauxlib.luaL_dostring(L, to_jsstring('return get_output()'));
    const output = lua.lua_tojsstring(L, -1);
    
    lua.lua_close(L);
    
    return { 
      output: output && output.trim() ? output : 'Code executed successfully (no output)',
      error: undefined 
    };
  } catch (error: any) {
    return {
      output: '',
      error: `Lua execution error: ${error.message || 'Unknown error'}`
    };
  }
}
