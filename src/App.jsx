import React, { useState } from 'react';
import { Search, Copy, Check, Terminal, Code2, Zap, Command } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MY_FILES = [
  "madmax.ipynb"
  "dududu.ipynb"
];

function App() {
  const [notebook, setNotebook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadNotebook = async (filename) => {
    setLoading(true);
    setActiveFile(filename);
    try {
      const response = await fetch(`/notebooks/${filename}`);
      if (!response.ok) throw new Error("File not found");
      const data = await response.json();
      setNotebook(data);
    } catch (error) {
      console.error("Error loading notebook:", error);
      alert(`Bro, 404. Could not find /notebooks/${filename}.`);
    }
    setLoading(false);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCodeSelection = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(e.currentTarget);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const filteredFiles = MY_FILES.filter(f => 
    f.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    /* The ultra-dark, dotted background Vercel vibe */
    <div className="flex h-screen bg-zinc-950 text-zinc-300 font-sans overflow-hidden selection:bg-cyan-500/30 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
      
      {/* Brutalist Sidebar */}
      <aside className="w-72 bg-zinc-950/80 backdrop-blur-xl border-r border-zinc-900 flex flex-col z-10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-100 flex items-center gap-2">
              <Zap size={16} className="text-cyan-400" fill="currentColor" />
              Workspace
            </h2>
            <div className="px-2 py-1 bg-zinc-900 rounded text-[10px] font-mono text-zinc-500 border border-zinc-800">v1.0.0</div>
          </div>
          
          {/* Fake Command Palette Search Input */}
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search files..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800/80 text-sm text-zinc-200 rounded-lg pl-9 pr-10 py-2 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-zinc-600"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-zinc-600 font-mono">
              <Command size={10} />K
            </div>
          </div>
        </div>

        <div className="px-4 pb-4 space-y-1 overflow-y-auto flex-1">
          {filteredFiles.map(filename => (
            <button 
              key={filename}
              onClick={() => loadNotebook(filename)}
              className={`w-full text-left px-3 py-2.5 rounded-md transition-all duration-200 flex items-center gap-3 text-sm font-medium group ${
                activeFile === filename 
                  ? 'bg-zinc-900 text-zinc-100 shadow-[inset_2px_0_0_0_#22d3ee]' 
                  : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'
              }`}
            >
              <Code2 size={16} className={activeFile === filename ? 'text-cyan-400' : 'text-zinc-700 group-hover:text-zinc-500 transition-colors'} /> 
              {filename}
            </button>
          ))}
          {filteredFiles.length === 0 && (
             <div className="text-xs text-zinc-600 text-center mt-8 font-mono">No matching files</div>
          )}
        </div>
        
        
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth bg-zinc-950/50 backdrop-blur-3xl">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center z-50">
             {/* Edgy loading state */}
            <div className="flex flex-col items-center gap-4 text-cyan-500/50 font-mono text-xs animate-pulse">
              <Terminal size={32} />
              <span>Fetching nodes...</span>
            </div>
          </div>
        ) : notebook ? (
          <div className="max-w-4xl mx-auto py-12 px-8 pb-32">
            
            {/* Minimal Header */}
            <header className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Runtime active
              </div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500 tracking-tight">
                {activeFile}
              </h1>
            </header>

            {notebook.cells?.map((cell, index) => (
              <div key={index} className="mb-8">
                {cell.cell_type === 'markdown' ? (
                  <div className="prose prose-invert max-w-none px-1 text-zinc-400 leading-relaxed marker:text-cyan-500 prose-a:text-cyan-400 prose-code:text-zinc-300 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:rounded-md">
                    <ReactMarkdown>{cell.source.join('')}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800/80 group transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.05)]">
                    
                    {/* Glassmorphic Copy Button */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      <button 
                        onClick={() => copyToClipboard(cell.source.join(''), index)}
                        className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-800/80 hover:bg-zinc-700/80 backdrop-blur-md rounded-md border border-zinc-700/50 text-xs font-mono text-zinc-300 transition-all active:scale-95"
                      >
                        {copiedIndex === index ? (
                          <><Check size={14} className="text-cyan-400" /> Copied</>
                        ) : (
                          <><Copy size={14} /> Copy</>
                        )}
                      </button>
                    </div>

                    {/* Code Block with custom Ctrl+A lock */}
                    <div 
                      tabIndex={0} 
                      onKeyDown={handleCodeSelection}
                      className="focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:bg-zinc-900 transition-colors"
                    >
                      <SyntaxHighlighter 
                        language="python" 
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, padding: '24px', background: 'transparent', fontSize: '14px', fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
                      >
                        {cell.source.join('')}
                      </SyntaxHighlighter>
                    </div>

                    {/* Output Area - Console Style */}
                    {cell.outputs && cell.outputs.length > 0 && (
                      <div className="border-t border-zinc-800/80 bg-[#0a0a0a] p-4 text-[13px] font-mono text-zinc-500 overflow-x-auto relative">
                        {/* Little console accent */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-800"></div>
                        {cell.outputs.map((out, i) => (
                          <pre key={i} className="m-0 pl-3">
                            {out.text ? out.text.join('') : out.data?.['text/plain']?.join('')}
                          </pre>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600">
            <div className="w-16 h-16 rounded-2xl border border-zinc-800 bg-zinc-900/50 flex items-center justify-center mb-6 shadow-2xl">
              <Code2 size={24} className="text-zinc-500" />
            </div>
            <p className="text-sm font-mono tracking-tight">Select a workspace to start cooking.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;