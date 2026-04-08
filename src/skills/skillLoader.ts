import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface Skill {
  name: string;
  instructions: string;
}

export async function loadSkills(): Promise<Skill[]> {
  const skills: Skill[] = [
    {
      name: 'core_behavior',
      instructions: 'You are a lightweight, general-purpose agent harness built on TypeScript and React Ink. You can handle software development, data analysis, and any general tasks.'
    }
  ];

  // Try to load custom persona from ~/.liteagent/AGENT.md or ~/.liteagent/SOUL.md
  const globalDir = path.join(os.homedir(), '.liteagent');
  const agentFile = path.join(globalDir, 'AGENT.md');
  const soulFile = path.join(globalDir, 'SOUL.md');

  if (fs.existsSync(agentFile)) {
    skills.push({
      name: 'custom_persona_agent',
      instructions: fs.readFileSync(agentFile, 'utf-8')
    });
  }

  if (fs.existsSync(soulFile)) {
    skills.push({
      name: 'custom_persona_soul',
      instructions: fs.readFileSync(soulFile, 'utf-8')
    });
  }

  // Future expansion: read from ~/.liteagent/skill directory
  const skillDir = path.join(globalDir, 'skill');
  if (fs.existsSync(skillDir) && fs.statSync(skillDir).isDirectory()) {
    const files = fs.readdirSync(skillDir);
    for (const file of files) {
      if (file.endsWith('.md') || file.endsWith('.txt')) {
        const skillPath = path.join(skillDir, file);
        const skillName = path.basename(file, path.extname(file));
        skills.push({
          name: `skill_${skillName}`,
          instructions: fs.readFileSync(skillPath, 'utf-8')
        });
      }
    }
  }

  return skills;
}
