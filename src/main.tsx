#!/usr/bin/env bun
import { getConfiguration, saveConfiguration } from './config/index.js';
import { runChatCommand } from './commands/chat.js';
import { render } from 'ink';
import React from 'react';
import { SetupWizard } from './buddy/SetupWizard.js';

async function main() {
  let config = getConfiguration();

  if (!config.apiKey) {
    await new Promise<void>(resolve => {
      const { unmount } = render(
        <SetupWizard onComplete={(baseUrl, modelName, apiKey) => {
          saveConfiguration(baseUrl, modelName, apiKey);
          unmount();
          resolve();
        }} />
      );
    });
    config = getConfiguration();
  }

  // Ensure stdin is active so Node.js event loop doesn't exit prematurely before Ink mounts.
  // This is required whether we ran the setup wizard (readline) or not.
  process.stdin.resume();
  if (typeof process.stdin.ref === 'function') {
    process.stdin.ref(); // 💡 Crucial: prevent Node.js from unref-ing stdin and exiting!
  }
  
  // 💡 Force the event loop to stay alive during the async transition phase
  // (e.g. loading MCP clients, skills) before React Ink mounts.
  const keepAlive = setInterval(() => {}, 1000);
  setTimeout(() => clearInterval(keepAlive), 5000); // Clear after 5s assuming Ink has mounted

  const args = process.argv.slice(2);
  const isDev = args.includes('--dev');
  config.isDev = isDev;

  const command = args[0] && !args[0].startsWith('--') ? args[0] : 'chat';

  switch (command) {
    case 'chat':
    default:
      await runChatCommand(config);
      break;
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
