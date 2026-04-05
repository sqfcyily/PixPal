import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as readline from 'readline';
import { runEngine } from './core/engine.js';
import { CLIChannel } from './channels/cli/CLIChannel.js';
import { FeishuChannel } from './channels/feishu/FeishuChannel.js';
import type { Channel } from './channels/base.js';

const CONFIG_FILE = '.agentrc';

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function initConfig(): Promise<void> {
  if (!fs.existsSync(CONFIG_FILE)) {
    console.log('✨ Welcome to PixPal! Let\'s set up your agent.\n');
    const baseUrl = await askQuestion('🔗 Enter BASE_URL (e.g. https://api.openai.com/v1): ');
    const model = await askQuestion('🤖 Enter MODEL_NAME (e.g. gpt-4o): ');
    const apiKey = await askQuestion('🔑 Enter API_KEY: ');
    
    const configContent = `BASE_URL=${baseUrl || 'https://api.openai.com/v1'}\nMODEL_NAME=${model || 'gpt-4o'}\nAPI_KEY=${apiKey}\nLANGUAGE=en-US\nCHANNEL=cli\n`;
    fs.writeFileSync(CONFIG_FILE, configContent, 'utf-8');
    console.log(`\n✅ Configuration saved to ${CONFIG_FILE}\n`);
  }
}

async function main() {
  await initConfig();
  
  // Initialize configuration from .env or .agentrc
  dotenv.config({ path: CONFIG_FILE });

  const config = {
    baseUrl: process.env.BASE_URL || 'https://api.openai.com/v1',
    apiKey: process.env.API_KEY || '',
    model: process.env.MODEL_NAME || 'gpt-4o',
    language: process.env.LANGUAGE || 'en-US',
    channel: process.env.CHANNEL || 'cli',
    feishuAppId: process.env.FEISHU_APP_ID || '',
    feishuAppSecret: process.env.FEISHU_APP_SECRET || ''
  };

  console.log(`\n🚀 PixPal Starting... [Model: ${config.model}, Channel: ${config.channel}]\n`);

  let activeChannel: Channel;

  // Mount the selected channel
  if (config.channel === 'feishu') {
    activeChannel = new FeishuChannel(config.feishuAppId, config.feishuAppSecret);
  } else {
    activeChannel = new CLIChannel();
  }

  await activeChannel.connect();

  const tools = [{
    type: 'function' as const,
    function: {
      name: 'echo',
      description: 'Echoes back the input',
      parameters: {
        type: 'object',
        properties: { message: { type: 'string' } },
        required: ['message']
      }
    }
  }];

  // State: Maintain context across the entire session
  const sessionMessages: any[] = [
    { role: 'system', content: `You are PixPal, a helpful pixel-art assistant. Always use tools when necessary. Language preference: ${config.language}.` }
  ];

  // Infinite REPL Loop
  while (true) {
    const userInput = await askQuestion('\n> ');
    if (!userInput.trim()) continue;
    if (userInput.trim().toLowerCase() === 'exit' || userInput.trim().toLowerCase() === 'quit') {
      console.log('Goodbye! 👋');
      process.exit(0);
    }

    sessionMessages.push({ role: 'user', content: userInput });

    // Run engine and pass the full message history
    const stream = runEngine(sessionMessages, tools, config);

    // Block and wait for the channel to render the stream fully before asking for next input
    await activeChannel.renderEngineStream(userInput, stream);
  }
}

main().catch(err => {
  console.error("Fatal Error:", err);
  process.exit(1);
});
