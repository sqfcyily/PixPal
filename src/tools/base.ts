import type { ToolSchema } from '../utils/types.js';

export abstract class BaseTool {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly inputSchema: Record<string, any>;

  abstract call(input: any): Promise<string>;

  toSchema(): ToolSchema {
    return {
      type: 'function',
      function: {
        name: this.name,
        description: this.description,
        parameters: this.inputSchema
      }
    };
  }
}
