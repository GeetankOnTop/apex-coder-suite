let pyodideInstance: any = null;

export async function initPython() {
  if (pyodideInstance) return pyodideInstance;
  
  try {
    // @ts-ignore
    const { loadPyodide } = await import('pyodide');
    pyodideInstance = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
    });
    return pyodideInstance;
  } catch (error) {
    console.error('Failed to load Pyodide:', error);
    throw error;
  }
}

export async function runPython(code: string): Promise<{ output: string; error?: string }> {
  try {
    const pyodide = await initPython();
    
    // Redirect stdout and stderr
    pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
    `);
    
    try {
      // Run the user code
      await pyodide.runPythonAsync(code);
      
      // Get the output
      const output = pyodide.runPython('sys.stdout.getvalue()');
      const errorOutput = pyodide.runPython('sys.stderr.getvalue()');
      
      if (errorOutput && errorOutput.trim()) {
        return { 
          output: output || '',
          error: errorOutput 
        };
      }
      
      return { 
        output: output || 'Code executed successfully (no output)',
        error: undefined 
      };
    } catch (execError: any) {
      const errorOutput = pyodide.runPython('sys.stderr.getvalue()');
      return {
        output: '',
        error: errorOutput || execError.message || 'Execution error'
      };
    }
  } catch (error: any) {
    return {
      output: '',
      error: `Failed to initialize Python: ${error.message || 'Unknown error'}`
    };
  }
}
