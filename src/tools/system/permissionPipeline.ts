import type { ToolSchema } from '../../utils/types.js';

export type PermissionDecision = 'allow' | 'deny' | 'ask';
export type PermissionMode = 'default' | 'auto' | 'plan' | 'bypassPermissions' | 'bubble';

export interface ToolPermissionContext {
  readonly mode: PermissionMode;
  readonly allowRules: string[];
  readonly denyRules: string[];
  readonly askRules: string[];
  readonly bypassAvailable: boolean;
}

export function checkPermissions(
  toolName: string, 
  args: any, 
  context: ToolPermissionContext
): PermissionDecision {
  // Phase 1: validateInput
  if (!args) return 'ask'; // Graceful degradation

  // Format the call signature, e.g. Bash(npm test)
  let callSignature = toolName;
  if (toolName === 'bash_command' && args.command) {
    callSignature = `Bash(${args.command})`;
  }

  // Phase 2: Rule Matching (deny > ask > allow) Priority Iron Law
  
  // 1a. Check deny rules
  for (const rule of context.denyRules) {
    if (matchRule(callSignature, rule)) return 'deny';
  }

  // 1b. Check ask rules
  for (const rule of context.askRules) {
    if (matchRule(callSignature, rule)) return 'ask';
  }

  // 1c. bypass mode overrides (unless explicitly denied above)
  if (context.mode === 'bypassPermissions' || (context.mode === 'plan' && context.bypassAvailable)) {
    return 'allow';
  }

  // 1d. plan mode (read-only)
  if (context.mode === 'plan') {
    const writeTools = ['bash_command', 'write_file', 'edit_file', 'delete_file', 'rename_file'];
    if (writeTools.includes(toolName)) return 'deny';
  }

  // 2b. Check allow rules
  for (const rule of context.allowRules) {
    if (matchRule(callSignature, rule)) return 'allow';
  }

  // Phase 3 & 4: Context Evaluation and Fallback
  if (context.mode === 'auto') {
    // YOLO classifier auto-approval mock
    const readOnlyTools = ['read_file', 'glob', 'grep', 'echo'];
    if (readOnlyTools.includes(toolName)) return 'allow';
    
    // In a real implementation, this would trigger the 2-second Promise.race speculative classifier
    // For LiteAgent, we fallback to ask for potentially destructive tools if no rules matched
    return 'ask';
  }

  // default mode: always ask
  return 'ask';
}

function matchRule(signature: string, rule: string): boolean {
  if (rule === signature) return true;
  
  // Prefix match (e.g. Bash(npm:*))
  if (rule.endsWith(':*)')) {
    const prefix = rule.slice(0, -3); // e.g. Bash(npm
    if (signature.startsWith(prefix)) return true;
  }
  
  // Wildcard match (e.g. Bash(npm *))
  if (rule.includes('*')) {
    // Escape regex chars except *
    const regexStr = rule.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    const regex = new RegExp(`^${regexStr}$`);
    return regex.test(signature);
  }
  
  return false;
}
