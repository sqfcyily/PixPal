import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const sequence = [
  { text: 'bun start', type: 'user', delay: 1000 },
  { text: '🚀 Welcome to LiteAgent! Let\'s set up your agent.', type: 'system', delay: 1500 },
  { text: '🔗 Enter BASE_URL: https://api.openai.com/v1', type: 'system', delay: 2000 },
  { text: '🤖 Enter MODEL_NAME: gpt-4o', type: 'system', delay: 2500 },
  { text: '🔑 Enter API_KEY: sk-*******************', type: 'system', delay: 3000 },
  { text: '■ LiteAgent:', type: 'agent-header', delay: 4000 },
  { text: '  Welcome to LiteAgent!', type: 'agent', delay: 4100 },
  { text: '  Type `/mode` to select an AI model, `/dev` to toggle developer logs.', type: 'agent', delay: 4200 },
  { text: '┌──────────────────────────────────────────────────────────────────────────┐', type: 'border', delay: 4500 },
  { text: '│ LiteAgent │ gpt-4o │ /workspace/project               Press Ctrl+C to exit │', type: 'status', delay: 4600 },
  { text: '│ ❯ Type a message...                                                        │', type: 'prompt', delay: 4700 },
  { text: '└──────────────────────────────────────────────────────────────────────────┘', type: 'border', delay: 4800 },
  { text: '/mode', type: 'user-input', delay: 6000 },
  { text: '■ LiteAgent: ✅ Model switched to qwen3.6-plus', type: 'agent-success', delay: 7000 },
];

const TerminalDemo = () => {
  const [lines, setLines] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    
    const runSequence = () => {
      setLines([]);
      setIsTyping(true);
      
      sequence.forEach((item, index) => {
        const timeout = setTimeout(() => {
          setLines(prev => [...prev, index]);
          if (index === sequence.length - 1) {
            setIsTyping(false);
            // Restart after a while
            setTimeout(runSequence, 5000);
          }
        }, item.delay);
        timeouts.push(timeout);
      });
    };

    runSequence();

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <section id="demo" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#050505]">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/10 bg-[#0c0c0e]"
        >
          {/* Terminal Header */}
          <div className="flex items-center px-4 py-3 bg-[#18181b] border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="mx-auto text-xs text-gray-500 font-medium">bash - LiteAgent</div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto min-h-[400px]">
            <div className="flex flex-col gap-1">
              <div className="text-gray-400 mb-2">~ %</div>
              
              {lines.map((lineIndex) => {
                const line = sequence[lineIndex];
                
                if (line.type === 'user') {
                  return <div key={lineIndex} className="text-gray-300"><span className="text-green-400">~ %</span> {line.text}</div>;
                }
                if (line.type === 'user-input') {
                  return (
                    <div key={lineIndex} className="relative -mt-10 ml-4 z-10 text-gray-300">
                      {line.text}
                    </div>
                  );
                }
                if (line.type === 'system') {
                  return <div key={lineIndex} className="text-gray-400">{line.text}</div>;
                }
                if (line.type === 'agent-header') {
                  return <div key={lineIndex} className="text-primary font-bold mt-4">{line.text}</div>;
                }
                if (line.type === 'agent') {
                  return <div key={lineIndex} className="text-gray-300">{line.text}</div>;
                }
                if (line.type === 'border') {
                  return <div key={lineIndex} className="text-gray-600 whitespace-pre">{line.text}</div>;
                }
                if (line.type === 'status') {
                  return <div key={lineIndex} className="text-gray-400 whitespace-pre">│ <span className="text-primary font-bold">LiteAgent</span> │ gpt-4o │ /workspace/project               Press Ctrl+C to exit │</div>;
                }
                if (line.type === 'prompt') {
                  return <div key={lineIndex} className="text-gray-400 whitespace-pre">│ <span className="text-green-400 font-bold">❯</span> Type a message...                                                        │</div>;
                }
                if (line.type === 'agent-success') {
                  return <div key={lineIndex} className="mt-4"><span className="text-primary font-bold">■ LiteAgent:</span> <span className="text-green-400">{line.text.replace('■ LiteAgent: ', '')}</span></div>;
                }
                
                return null;
              })}

              {isTyping && (
                <motion.div 
                  animate={{ opacity: [1, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-2 h-4 bg-gray-400 mt-1 inline-block" 
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TerminalDemo;