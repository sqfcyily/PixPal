import React, { useState, useEffect } from 'react';
import { render, Box, Text } from 'ink';
import { DioramaStage, DioramaState } from '../../ui/components/Diorama/Stage.js';
import type { Channel } from '../base.js';
import type { EngineEvent } from '../../core/types.js';

export class CLIChannel implements Channel {
  private renderInstance: any;

  async connect(): Promise<void> {
    console.clear();
    console.log('✨ PixPal CLI Initialized. Type your message below.\n');
  }

  onMessage(callback: (message: string) => void): void {
    // In a real CLI, we use readline for user input. Handled directly in index.ts for loop control.
  }

  async sendMessage(content: string): Promise<string> {
    // Message rendering is handled by React UI
    return 'cli-msg-1';
  }

  async updateMessage(messageId: string, content: string): Promise<void> {
    // Updates are handled natively by React/Ink via state changes.
  }

  async renderEngineStream(prompt: string, stream: AsyncGenerator<EngineEvent, void, unknown>): Promise<void> {
    // Unmount previous instance if exists to keep terminal clean
    if (this.renderInstance) {
      this.renderInstance.unmount();
    }
    
    this.renderInstance = render(<CLIRootApp prompt={prompt} stream={stream} />);
    
    // Wait until the stream finishes
    for await (const event of stream) {
       // Loop consumed by React hook inside CLIRootApp
    }
  }
}

// ---------------------------------------------------------
// React Root for the CLI Channel
// ---------------------------------------------------------
const CLIRootApp: React.FC<{ prompt: string, stream: AsyncGenerator<EngineEvent, void, unknown> }> = ({ prompt, stream }) => {
  const [dioramaState, setDioramaState] = useState<DioramaState>({ status: 'Pending', message: 'Ready...' });
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const consumeStream = async () => {
      for await (const event of stream) {
        switch (event.type) {
          case 'thinking':
            setDioramaState(prev => ({ ...prev, status: 'In_Progress', message: event.content }));
            break;
          case 'tool_start':
            setDioramaState(prev => ({ ...prev, status: 'In_Progress', message: 'Using tool...', toolInfo: `Executing [${event.toolName}] with args: ${event.args}` }));
            setLogs(prev => [...prev, `> Starting Tool: ${event.toolName}`]);
            break;
          case 'tool_end':
            setDioramaState(prev => ({ ...prev, status: 'In_Progress', message: 'Tool finished. Resuming thought...', toolInfo: `Result: ${event.result}` }));
            setLogs(prev => [...prev, `> Finished Tool: ${event.toolName}`]);
            break;
          case 'completed':
            setDioramaState({ status: 'Completed', message: event.content });
            setLogs(prev => [...prev, `> Task Completed.`]);
            break;
          case 'error':
            setDioramaState({ status: 'Failed', message: event.error.message });
            setLogs(prev => [...prev, `> Error: ${event.error.message}`]);
            break;
        }
      }
    };
    consumeStream();
  }, [stream]);

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="yellow">You: {prompt}</Text>
      <DioramaStage state={dioramaState} />
    </Box>
  );
};
