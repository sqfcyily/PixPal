import React from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import TerminalDemo from './components/TerminalDemo';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#09090b] text-gray-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
      {/* Navigation (Optional minimalist header) */}
      <nav className="fixed top-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-black text-xl leading-none">
              L
            </div>
            <span className="font-bold text-xl tracking-tight text-white">LiteAgent</span>
          </div>
          <div className="hidden sm:flex gap-6 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#demo" className="hover:text-cyan-400 transition-colors">Demo</a>
            <a href="#install" className="hover:text-cyan-400 transition-colors">Install</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Hero />
        <Features />
        <TerminalDemo />
      </main>

      <Footer />
    </div>
  );
}

export default App;
