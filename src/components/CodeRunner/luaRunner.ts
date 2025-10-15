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
    lualib.luaL_openlibs(L);
    
    let output = '';
    
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
    lauxlib.luaL_dostring(L, to_jsstring(printFunc));
    
    // Execute user code
    const result = lauxlib.luaL_dostring(L, to_jsstring(code));
    
    if (result !== 0) {
      const errorMsg = lua.lua_tojsstring(L, -1);
      lua.lua_close(L);
      return { output: '', error: errorMsg };
    }
    
    // Get captured output
    lauxlib.luaL_dostring(L, to_jsstring('return get_output()'));
    output = lua.lua_tojsstring(L, -1) || 'Code executed successfully';
    
    lua.lua_close(L);
    
    return { output, error: undefined };
  } catch (error: any) {
    return {
      output: '',
      error: error.message || 'Execution error'
    };
  }
}
