import type { ToolSchema } from '../utils/types.js';

export function getSystemTools(): ToolSchema[] {
  return [
    {
      type: 'function',
      function: {
        name: 'echo',
        description: 'Echoes back the input',
        parameters: {
          type: 'object',
          properties: { message: { type: 'string' } },
          required: ['message']
        }
      }
    }
  ];
}

export async function runTool(name: string, args: any): Promise<string> {
  if (name === 'echo') {
    return `Echoed: ${args.message}`;
  }
  throw new Error(`Tool ${name} not found or not implemented.`);
}
