import { promises as fs } from 'fs';
import * as path from 'path';
import { BaseTool } from '../base.js';

export class ReadFileTool extends BaseTool {
  readonly name = 'read_file';
  readonly description = 'Reads the contents of a file from the local file system. Use this to inspect file contents.';
  readonly inputSchema = {
    type: 'object',
    properties: {
      file_path: { type: 'string', description: 'The absolute or relative path to the file to read' }
    },
    required: ['file_path']
  };

  async call(input: { file_path: string }): Promise<string> {
    try {
      const content = await fs.readFile(input.file_path, 'utf-8');
      return content;
    } catch (err: any) {
      return `Failed to read file: ${err.message}`;
    }
  }
}

export class WriteFileTool extends BaseTool {
  readonly name = 'write_file';
  readonly description = 'Creates a new file or overwrites an existing file with the provided content.';
  readonly inputSchema = {
    type: 'object',
    properties: {
      file_path: { type: 'string', description: 'The absolute or relative path where the file will be created/overwritten' },
      content: { type: 'string', description: 'The entire content to write into the file' }
    },
    required: ['file_path', 'content']
  };

  async call(input: { file_path: string, content: string }): Promise<string> {
    try {
      await fs.mkdir(path.dirname(input.file_path), { recursive: true });
      await fs.writeFile(input.file_path, input.content, 'utf-8');
      return `Successfully wrote to file: ${input.file_path}`;
    } catch (err: any) {
      return `Failed to write file: ${err.message}`;
    }
  }
}

export class EditFileTool extends BaseTool {
  readonly name = 'edit_file';
  readonly description = 'Modifies an existing file by replacing a specific string with a new string. Ensure the old_string matches the file content exactly.';
  readonly inputSchema = {
    type: 'object',
    properties: {
      file_path: { type: 'string', description: 'The absolute or relative path to the file to edit' },
      old_string: { type: 'string', description: 'The exact string to be replaced' },
      new_string: { type: 'string', description: 'The string to replace the old_string with' }
    },
    required: ['file_path', 'old_string', 'new_string']
  };

  async call(input: { file_path: string, old_string: string, new_string: string }): Promise<string> {
    try {
      const content = await fs.readFile(input.file_path, 'utf-8');
      if (!content.includes(input.old_string)) {
        return `Error: The string provided in old_string was not found in the file. No changes made.`;
      }
      const newContent = content.replace(input.old_string, input.new_string);
      await fs.writeFile(input.file_path, newContent, 'utf-8');
      return `Successfully edited file: ${input.file_path}`;
    } catch (err: any) {
      return `Failed to edit file: ${err.message}`;
    }
  }
}

export class RenameFileTool extends BaseTool {
  readonly name = 'rename_file';
  readonly description = 'Renames a file or moves it to a new path.';
  readonly inputSchema = {
    type: 'object',
    properties: {
      old_path: { type: 'string', description: 'The current path of the file' },
      new_path: { type: 'string', description: 'The new path for the file' }
    },
    required: ['old_path', 'new_path']
  };

  async call(input: { old_path: string, new_path: string }): Promise<string> {
    try {
      await fs.mkdir(path.dirname(input.new_path), { recursive: true });
      await fs.rename(input.old_path, input.new_path);
      return `Successfully renamed ${input.old_path} to ${input.new_path}`;
    } catch (err: any) {
      return `Failed to rename file: ${err.message}`;
    }
  }
}

export class DeleteFileTool extends BaseTool {
  readonly name = 'delete_file';
  readonly description = 'Deletes a file from the file system. Use with caution.';
  readonly inputSchema = {
    type: 'object',
    properties: {
      file_path: { type: 'string', description: 'The absolute or relative path to the file to delete' }
    },
    required: ['file_path']
  };

  async call(input: { file_path: string }): Promise<string> {
    try {
      await fs.unlink(input.file_path);
      return `Successfully deleted file: ${input.file_path}`;
    } catch (err: any) {
      return `Failed to delete file: ${err.message}`;
    }
  }
}
