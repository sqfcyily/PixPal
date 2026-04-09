import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Terminal, FileCode } from 'lucide-react';

const Footer = () => {
  const [copiedGlobal, setCopiedGlobal] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);

  const copyText = (text: string, setCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="install" className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-bg-dark relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-gray-400">Choose your preferred way to run LiteAgent.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Option 1: Global Install */}
          <div className="glass-card rounded-2xl p-8 border-t-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Terminal className="text-primary w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold">Global Install</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Best for everyday use as a global CLI assistant.
            </p>
            
            <div className="space-y-4">
              <div className="bg-black/50 border border-white/5 rounded-lg p-4 flex justify-between items-center group hover:border-white/10 transition-colors">
                <code className="text-sm font-mono text-gray-300">npm install -g @sqfcy/liteagent</code>
                <button 
                  onClick={() => copyText('npm install -g @sqfcy/liteagent', setCopiedGlobal)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  {copiedGlobal ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="bg-black/50 border border-white/5 rounded-lg p-4 flex justify-between items-center">
                <code className="text-sm font-mono text-gray-300">liteagent</code>
                <span className="text-xs text-gray-500">Run it anywhere</span>
              </div>
            </div>
          </div>

          {/* Option 2: Source Code */}
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <FileCode className="text-blue-400 w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold">Source / Bun</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Best for hacking, learning the architecture, and extending skills.
            </p>
            
            <div className="space-y-3">
              <div className="bg-black/50 border border-white/5 rounded-lg p-3 flex justify-between items-center group hover:border-white/10 transition-colors">
                <code className="text-xs font-mono text-gray-300 truncate mr-2">git clone https://github.com/sqfcyily/LiteAgent.git</code>
                <button 
                  onClick={() => copyText('git clone https://github.com/sqfcyily/LiteAgent.git', setCopiedClone)}
                  className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                >
                  {copiedClone ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>
              <div className="bg-black/50 border border-white/5 rounded-lg p-3">
                <code className="text-xs font-mono text-gray-300">cd LiteAgent && bun install</code>
              </div>
              <div className="bg-black/50 border border-white/5 rounded-lg p-3">
                <code className="text-xs font-mono text-gray-300">bun start</code>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">LiteAgent</span>
            <span>© {new Date().getFullYear()} sqfcyily.</span>
          </div>
          <div className="flex gap-6">
            <a href="https://github.com/sqfcyily/LiteAgent" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://www.npmjs.com/package/@sqfcy/liteagent" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">NPM</a>
            <a href="https://github.com/sqfcyily/LiteAgent/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">License (MIT)</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;