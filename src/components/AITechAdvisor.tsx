
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, Terminal, Bot } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface AITechAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AITechAdvisor({ isOpen, onClose }: AITechAdvisorProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm your AI Tech Advisor. Ask me anything about current reviews, tech tips, or the latest hardware specs!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
          systemInstruction: "You are TechPulse AI, a professional tech journalist and hardware expert. Provide concise, expert advice, reviews, and news summaries. Use markdown for structured answers."
        }
      });

      const modelText = response.text || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'model', content: modelText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I hit a snag. Please check your connection or API key." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-brand/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            className="fixed top-0 right-0 z-[70] h-full w-full max-w-lg bg-white shadow-2xl flex flex-col border-l border-zinc-200"
          >
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/30">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold flex items-center gap-2">
                    AI Advisor
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">Neural Engine Active</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-6 space-y-6 bg-zinc-50/30"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex flex-col gap-2 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-brand text-white rounded-tr-none" 
                      : "bg-white border border-zinc-200 text-zinc-800 rounded-tl-none shadow-sm"
                  )}>
                    <div className="markdown-body text-inherit">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                    {msg.role === 'user' ? 'YOU' : 'AI PULSE'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono ml-2">
                  <Terminal className="w-3 h-3 animate-pulse" /> Generating insights...
                </div>
              )}
            </div>

            <div className="p-6 border-t border-zinc-100 bg-white">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about M3 chips, Vision Pro, field tips..."
                  className="w-full bg-zinc-100 border-none rounded-2xl pl-6 pr-14 py-4 text-sm focus:ring-2 focus:ring-accent transition-all outline-none"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-3 bg-brand text-white rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-4 text-[10px] text-zinc-400 text-center uppercase tracking-widest flex items-center justify-center gap-2">
                <Sparkles className="w-3 h-3" /> Powered by Gemini 3.1 Flash
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
