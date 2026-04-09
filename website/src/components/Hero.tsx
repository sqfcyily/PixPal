import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Github, Copy, Check } from 'lucide-react';

const Hero = () => {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText('npm install -g @sqfcy/liteagent');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-50 mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] opacity-30 mix-blend-screen" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Radial Gradient mask for grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,transparent_0%,#09090b_100%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8 backdrop-blur-sm"
        >
          <Terminal size={14} className="text-primary" />
          <span>v0.1.2 is now available on npm</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-6"
        >
          Build AI Agents <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 neon-text">
            Without the Bloat.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 leading-relaxed"
        >
          A lightweight, CLI-first Agent Harness framework built with TypeScript, React Ink, and Bun. 
          Master the core loops of LLM interactions and tool calling in minutes.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Copy Command Button */}
          <div 
            onClick={copyCommand}
            className="group relative flex items-center gap-3 bg-black/40 hover:bg-black/60 border border-primary/30 hover:border-primary/60 px-6 py-4 rounded-xl cursor-pointer transition-all duration-300 hover:neon-glow overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Terminal size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
            <code className="font-mono text-sm text-gray-200">npm install -g @sqfcy/liteagent</code>
            <div className="ml-2 pl-4 border-l border-white/10">
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} className="text-gray-400 group-hover:text-white transition-colors" />}
            </div>
          </div>

          {/* GitHub Button */}
          <a 
            href="https://github.com/sqfcyily/LiteAgent" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl font-medium transition-colors duration-200"
          >
            <Github size={20} />
            View on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;