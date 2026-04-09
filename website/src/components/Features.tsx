import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Code2, Blocks } from 'lucide-react';

const features = [
  {
    title: 'Architectural Parity',
    description: 'Shares the same technical DNA as Anthropic\'s official Claude Code CLI. Built on React Ink virtual DOM and async generator engines.',
    icon: <Cpu className="w-6 h-6 text-primary" />,
    delay: 0.1
  },
  {
    title: 'Zero Bloat',
    description: 'Stripped of commercial redundancy. A pure, readable harness perfect for learning LLM conversation loops and tool invocation mechanics.',
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    delay: 0.2
  },
  {
    title: 'Modern Stack',
    description: 'Powered by Bun for extreme performance. Written in strict TypeScript with Zod validation for robust, type-safe tool execution.',
    icon: <Code2 className="w-6 h-6 text-blue-400" />,
    delay: 0.3
  },
  {
    title: 'Highly Extensible',
    description: 'Native support for the Model Context Protocol (MCP) ecosystem and dynamic Skill loading via markdown frontmatter.',
    icon: <Blocks className="w-6 h-6 text-purple-400" />,
    delay: 0.4
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Built for <span className="text-primary">Hackers</span> & Learners
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Everything you need to understand and build your own CLI AI Agents, packaged in an elegant, minimal codebase.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: feature.delay }}
              className="glass-card rounded-2xl p-8 group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden"
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center mb-6 border border-white/10 group-hover:border-primary/30 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;