import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { EngineConfig } from '../services/agentEngine.js';

const CONFIG_FILE = '.agentrc';

export function getConfiguration(): EngineConfig {
  if (fs.existsSync(CONFIG_FILE)) {
    dotenv.config({ path: CONFIG_FILE });
  }

  return {
    baseUrl: process.env.BASE_URL || 'https://api.openai.com/v1',
    apiKey: process.env.API_KEY || '',
    model: process.env.MODEL_NAME || 'gpt-4o',
    language: process.env.LANGUAGE || 'en-US',
    maxLoops: 10
  };
}

export function saveConfiguration(baseUrl: string, modelName: string, apiKey: string): void {
  const configContent = `BASE_URL=${baseUrl || 'https://api.openai.com/v1'}\nMODEL_NAME=${modelName || 'gpt-4o'}\nAPI_KEY=${apiKey}\nLANGUAGE=en-US\n`;
  fs.writeFileSync(CONFIG_FILE, configContent, 'utf-8');
}
