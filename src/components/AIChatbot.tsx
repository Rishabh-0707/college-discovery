'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageSquare, X, Send, Trash2, ArrowRight } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Hello! I am your **AI College Comparison Assistant**.\n\nI can query the database in real-time to compare institutions side-by-side or find specific metrics. Ask me things like:\n\n- *\"Compare IIT Bombay and BITS Pilani\"*\n- *\"Which college has the highest package?\"*\n- *\"Which college has the lowest fees?\"*",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    if (!textToSend) setInput('');

    // Append user message
    const updatedMessages = [...messages, { role: 'user', content: query } as Message];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '❌ Sorry, I encountered an error connecting to the database. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (query: string) => {
    handleSend(query);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "👋 Hello! I am your **AI College Comparison Assistant**.\n\nAsk me comparison questions like:\n\n- *\"Compare IIT Bombay and BITS Pilani\"*\n- *\"Which college has the highest package?\"*\n- *\"Which college has the lowest fees?\"*",
      },
    ]);
  };

  // Zero-dependency rich markdown parser to render lists, tables, and bold tags
  const renderMarkdown = (text: string) => {
    // Basic bold replacement: **text** to <strong>text</strong>
    const parseBoldText = (str: string) => {
      const parts = str.split(/\*\*(.*?)\*\*/g);
      return parts.map((part, i) => {
        if (i % 2 === 1) return <strong key={i} className="font-extrabold text-slate-900">{part}</strong>;
        // Parse italic: *text*
        const italicParts = part.split(/\*(.*?)\*/g);
        return italicParts.map((ip, j) => {
          if (j % 2 === 1) return <em key={j} className="italic text-slate-800">{ip}</em>;
          return ip;
        });
      });
    };

    return text.split('\n').map((line, idx) => {
      // Table support
      if (line.startsWith('|')) {
        if (line.includes('---')) return null;
        const cells = line.split('|').map(c => c.trim()).filter(Boolean);
        const isHeaderLine = idx === 2 || line.toLowerCase().includes('metric');
        return (
          <div key={idx} className={`grid grid-cols-3 gap-2 border-b border-slate-100 py-2 text-xs leading-normal ${isHeaderLine ? 'font-bold bg-slate-50 text-slate-800' : 'text-slate-600'}`}>
            {cells.map((cell, cIdx) => (
              <div key={cIdx} className={cIdx === 0 ? "font-semibold text-left text-slate-800" : "text-center"}>
                {parseBoldText(cell)}
              </div>
            ))}
          </div>
        );
      }

      // Headers support
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="font-serif text-base font-bold text-slate-900 mt-4 mb-2 border-b pb-1">{parseBoldText(line.replace('### ', ''))}</h4>;
      }
      if (line.startsWith('#### ')) {
        return <h5 key={idx} className="font-sans text-xs font-bold text-slate-500 mt-3 mb-1 uppercase tracking-wider">{parseBoldText(line.replace('#### ', ''))}</h5>;
      }

      // List support
      if (line.startsWith('- ')) {
        return <li key={idx} className="ml-4 list-disc text-xs text-slate-600 my-1">{parseBoldText(line.replace('- ', ''))}</li>;
      }
      if (line.match(/^\d+\.\s/)) {
        return <li key={idx} className="ml-4 list-decimal text-xs text-slate-600 my-1">{parseBoldText(line.replace(/^\d+\.\s/, ''))}</li>;
      }

      // Default paragraph
      return line.trim() ? <p key={idx} className="text-xs text-slate-600 leading-relaxed mb-2.5">{parseBoldText(line)}</p> : null;
    }).filter(Boolean);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#E81A2D] text-white shadow-xl shadow-red-500/30 hover:bg-[#c91525] hover:scale-105 transition-all duration-300 pointer-events-auto"
        title="AI Assistant"
      >
        {isOpen ? <X className="h-6 w-6" /> : (
          <div className="relative">
            <MessageSquare className="h-6 w-6" />
            <Sparkles className="absolute -top-2.5 -right-2.5 h-4 w-4 text-yellow-300 animate-pulse" />
          </div>
        )}
      </button>

      {/* Slide-Up Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] bg-white/90 backdrop-blur-2xl border border-slate-200/60 shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-fade-in pointer-events-auto">
          {/* Header */}
          <div className="bg-slate-900 px-4 py-3 flex items-center justify-between text-white border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 rounded-full bg-[#E81A2D] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 border border-slate-900 animate-ping"></span>
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold tracking-wide">CollegeQ AI</h3>
                <span className="text-[10px] text-slate-400 tracking-wider font-medium uppercase">Active Assistant</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={clearChat}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Clear Chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200/50 rounded-bl-none'
                }`}>
                  {msg.role === 'user' ? (
                    <p className="text-xs leading-relaxed">{msg.content}</p>
                  ) : (
                    renderMarkdown(msg.content)
                  )}
                </div>
              </div>
            ))}

            {/* Suggestions (Pills) rendered only in initial assistant state */}
            {messages.length === 1 && (
              <div className="space-y-2 pt-2 animate-fade-in">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Quick Searches</p>
                <div className="flex flex-col gap-2">
                  {[
                    "Compare IIT Bombay vs BITS Pilani",
                    "Which college has the highest package?",
                    "Which college has the lowest fees?"
                  ].map((sugg) => (
                    <button
                      key={sugg}
                      onClick={() => handleSuggestionClick(sugg)}
                      className="flex items-center justify-between text-left text-[11px] font-semibold text-slate-700 bg-white border border-slate-200/60 rounded-xl px-3.5 py-2 hover:border-[#E81A2D] hover:text-[#E81A2D] hover:bg-red-50/20 transition-all shadow-sm"
                    >
                      <span>{sugg}</span>
                      <ArrowRight className="h-3 w-3 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200/50 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#E81A2D] animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 rounded-full bg-[#E81A2D] animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 rounded-full bg-[#E81A2D] animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-white border-t border-slate-200/80 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask AI to compare colleges, fees..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-50 px-4 py-2 text-xs border border-slate-200/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E81A2D] focus:border-[#E81A2D]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
