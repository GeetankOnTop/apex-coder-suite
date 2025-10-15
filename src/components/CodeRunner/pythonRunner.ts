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
    
    // Redirect stdout
    let output = '';
    pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
    `);
    
    // Run the user code
    await pyodide.runPythonAsync(code);
    
    // Get the output
    output = pyodide.runPython('sys.stdout.getvalue()');
    const error = pyodide.runPython('sys.stderr.getvalue()');
    
    return { 
      output: output || 'Code executed successfully',
      error: error || undefined 
    };
  } catch (error: any) {
    return {
      output: '',
      error: error.message || 'Execution error'
    };
  }
}
