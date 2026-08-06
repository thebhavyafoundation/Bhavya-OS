/**
 * Bhavya OS — Tools Module
 * Tool abstractions.
 */

export class Tools {
  constructor() {
    this.tools = new Map();
  }

  register(tool) {
    this.tools.set(tool.id, tool);
    return tool;
  }

  async execute(toolId, params) {
    const tool = this.tools.get(toolId);
    if (!tool) throw new Error(`Tool ${toolId} not found`);
    
    const startTime = Date.now();
    const result = await tool.execute(params);
    const duration = Date.now() - startTime;
    
    return {
      toolId,
      params,
      result,
      duration,
      timestamp: new Date().toISOString(),
    };
  }

  getTool(toolId) {
    return this.tools.get(toolId);
  }

  listTools() {
    return [...this.tools.values()];
  }
}

// Built-in tools
export const builtInTools = {
  readFile: {
    id: "read-file",
    name: "Read File",
    execute: async ({ path }) => {
      const { readFileSync } = await import("fs");
      return readFileSync(path, "utf-8");
    },
  },
  writeFile: {
    id: "write-file",
    name: "Write File",
    execute: async ({ path, content }) => {
      const { writeFileSync } = await import("fs");
      writeFileSync(path, content);
      return { success: true };
    },
  },
  runCommand: {
    id: "run-command",
    name: "Run Command",
    execute: async ({ command, cwd }) => {
      const { execSync } = await import("child_process");
      return execSync(command, { cwd, encoding: "utf-8" });
    },
  },
};
