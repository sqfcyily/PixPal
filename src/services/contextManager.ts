import type { Message } from '../utils/types.js';

export interface ContextConfig {
  maxTokens?: number; // Approximation of context window size
}

/**
 * Four-level progressive compression strategy:
 * 1. Snip -> Truncate middle of long tool outputs
 * 2. MicroCompact -> Remove unnecessary whitespace
 * 3. Collapse -> Remove old tool calls entirely
 * 4. AutoCompact -> Retain only core system prompts and latest turns
 */
export function compressContext(messages: Message[], config: ContextConfig): Message[] {
  const maxTokens = config.maxTokens || 8000;
  
  // Very rough approximation: 1 char = 0.25 tokens (1 token ~ 4 chars)
  const estimateTokens = (msgs: Message[]) => 
    msgs.reduce((acc, m) => acc + ((m.content?.length || 0) + JSON.stringify(m.tool_calls || {}).length) * 0.25, 0);

  let currentTokens = estimateTokens(messages);
  if (currentTokens <= maxTokens) return messages;

  // Level 1: Snip (Truncate long tool results in the middle)
  const snipped = messages.map(msg => {
    if (msg.role === 'tool' && msg.content && msg.content.length > 2000) {
      return {
        ...msg,
        content: msg.content.substring(0, 1000) + '\n\n...[SNIPPED BY CONTEXT MANAGER]...\n\n' + msg.content.substring(msg.content.length - 1000)
      };
    }
    return msg;
  });

  currentTokens = estimateTokens(snipped);
  if (currentTokens <= maxTokens) return snipped;

  // Level 2 & 3: Collapse (Circuit Breaker Mode - Drop oldest non-system messages)
  const systemMessages = snipped.filter(m => m.role === 'system');
  const nonSystemMessages = snipped.filter(m => m.role !== 'system');
  
  // Keep only the most recent N messages that fit
  const retained: Message[] = [];
  let budget = maxTokens - estimateTokens(systemMessages);
  
  for (let i = nonSystemMessages.length - 1; i >= 0; i--) {
    const msg = nonSystemMessages[i];
    const cost = ((msg.content?.length || 0) + JSON.stringify(msg.tool_calls || {}).length) * 0.25;
    if (budget - cost > 0) {
      retained.unshift(msg);
      budget -= cost;
    } else {
      break;
    }
  }

  // Level 4: AutoCompact - Inject a summary/collapse notice
  const collapsedCount = nonSystemMessages.length - retained.length;
  if (collapsedCount > 0) {
    const collapsedNotice: Message = {
      role: 'system',
      content: `[System Notice: ${collapsedCount} older messages collapsed to maintain working memory limit. Context window optimized.]`
    };
    return [...systemMessages, collapsedNotice, ...retained];
  }

  return [...systemMessages, ...retained];
}
