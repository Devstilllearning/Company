import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Send, Loader2, Sparkles, Shield, Target, TrendingUp, ArrowRight } from 'lucide-react';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { useAuth } from '../components/FirebaseProvider';

export default function Intelligence() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState('');

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsThinking(true);
    setError('');
    setResponse('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const result = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          systemInstruction: `You are the Berrionaire Strategic Intelligence AI. 
          Your purpose is to provide high-level, professional, and strategic advice for the "official company" Berrionaire. 
          Berrionaire's vision is "Combining the power of diversity with unique innovation to produce quality work".
          Your tone should be authoritative, sophisticated, and visionary. 
          Focus on long-term growth, ethical innovation, and global impact. 
          Provide structured, deep-thinking responses.`
        },
      });

      setResponse(result.text || 'No response generated.');
    } catch (err: any) {
      console.error('AI Error:', err);
      setError('The intelligence engine encountered an error. Please try again.');
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border-brand-gold/30 text-brand-gold text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-lg shadow-brand-gold/5"
          >
            <Sparkles className="w-4 h-4" /> Berrionaire Intelligence Engine
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            Strategic <span className="text-gradient-gold">Foresight</span>
          </h1>
          <p className="text-xl text-white/50 max-w-3xl mx-auto font-medium leading-relaxed">
            Access our proprietary high-thinking AI model for deep strategic analysis, 
            market innovation, and visionary leadership guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Capabilities */}
          <div className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bento-card !p-12"
            >
              <h3 className="text-2xl font-black mb-12 tracking-tight flex items-center gap-4">
                <Target className="w-8 h-8 text-brand-red" /> Strategic Focus
              </h3>
              <ul className="space-y-10">
                {[
                  { title: 'Market Disruption', desc: 'Identify untapped opportunities' },
                  { title: 'Ethical Innovation', desc: 'Build sustainable technology' },
                  { title: 'Global Synergy', desc: 'Optimize cross-border collaboration' },
                  { title: 'Risk Mitigation', desc: 'Predict and navigate challenges' }
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 group"
                  >
                    <div className="w-1.5 h-8 rounded-full bg-brand-red/20 group-hover:bg-brand-red transition-all duration-500 flex-shrink-0" />
                    <div>
                      <p className="font-black text-lg tracking-tight mb-1 group-hover:text-brand-gold transition-colors duration-300">{item.title}</p>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bento-card !p-12 bg-gradient-to-br from-brand-purple/10 to-transparent border-brand-purple/20"
            >
              <h3 className="text-xl font-black mb-8 tracking-tight flex items-center gap-4">
                <Shield className="w-7 h-7 text-brand-purple" /> Secure Analysis
              </h3>
              <p className="text-sm text-white/40 leading-relaxed font-medium italic border-l-2 border-brand-purple/30 pl-6">
                "All strategic consultations are processed through our private, 
                high-thinking neural network, ensuring the highest level of 
                confidentiality and intellectual property protection."
              </p>
            </motion.div>
          </div>

          {/* Right Column: Interaction */}
          <div className="lg:col-span-2 space-y-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bento-card !p-12 min-h-[750px] flex flex-col relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 blur-[120px] -mr-48 -mt-48 rounded-full group-hover:bg-brand-gold/10 transition-all duration-1000" />
              
              {/* Response Area */}
              <div className="flex-1 overflow-y-auto mb-12 space-y-10 custom-scrollbar pr-8 relative z-10">
                <AnimatePresence mode="wait">
                  {!response && !isThinking ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-10 py-24"
                    >
                      <div className="w-28 h-28 rounded-[3rem] glass flex items-center justify-center bg-white/5 border-white/10 shadow-2xl group-hover:border-brand-gold/20 transition-all duration-500">
                        <Brain className="w-14 h-14 text-white/10 group-hover:text-brand-gold/20 transition-colors duration-500" />
                      </div>
                      <div>
                        <h4 className="text-3xl font-black mb-4 tracking-tight">Awaiting Consultation</h4>
                        <p className="text-white/30 max-w-sm mx-auto font-medium leading-relaxed text-lg">
                          Describe your strategic challenge or visionary goal to begin the high-thinking analysis.
                        </p>
                      </div>
                    </motion.div>
                  ) : isThinking ? (
                    <motion.div
                      key="thinking"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-12"
                    >
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center animate-pulse bg-brand-gold/10 border-brand-gold/30 shadow-lg shadow-brand-gold/5">
                          <Brain className="w-9 h-9 text-brand-gold" />
                        </div>
                        <div className="flex items-center gap-5 text-brand-gold font-black text-xs tracking-[0.4em] uppercase">
                          <Loader2 className="w-6 h-6 animate-spin" /> Deep Thinking in Progress...
                        </div>
                      </div>
                      <div className="space-y-6">
                        <motion.div 
                          animate={{ opacity: [0.3, 0.6, 0.3], width: ['60%', '80%', '60%'] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="h-4 bg-white/5 rounded-full" 
                        />
                        <motion.div 
                          animate={{ opacity: [0.3, 0.6, 0.3], width: ['90%', '100%', '90%'] }}
                          transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
                          className="h-4 bg-white/5 rounded-full" 
                        />
                        <motion.div 
                          animate={{ opacity: [0.3, 0.6, 0.3], width: ['70%', '90%', '70%'] }}
                          transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
                          className="h-4 bg-white/5 rounded-full" 
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="response"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-12"
                    >
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center bg-brand-gold/10 border-brand-gold/30 shadow-xl shadow-brand-gold/5">
                          <TrendingUp className="w-9 h-9 text-brand-gold" />
                        </div>
                        <h4 className="text-xs font-black text-brand-gold uppercase tracking-[0.5em]">Strategic Output</h4>
                      </div>
                      <div className="text-white/80 leading-[2] whitespace-pre-wrap font-sans text-xl font-medium selection:bg-brand-gold/30 selection:text-white">
                        {response}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input Area */}
              <form onSubmit={handleConsult} className="relative z-10">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-16 left-0 right-0 text-brand-red text-[10px] font-black uppercase tracking-[0.2em] text-center"
                  >
                    {error}
                  </motion.div>
                )}
                <div className="relative group/input">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your strategic query (e.g., 'Analyze the impact of AI on global wealth distribution in 2030')"
                    className="w-full bg-white/5 border border-white/10 rounded-[3rem] px-12 py-10 pr-28 focus:outline-none focus:border-brand-gold focus:bg-white/[0.08] transition-all duration-500 resize-none h-48 text-white placeholder:text-white/20 font-medium text-lg shadow-inner"
                    disabled={isThinking}
                  />
                  <button
                    type="submit"
                    disabled={isThinking || !prompt.trim()}
                    className="absolute bottom-10 right-10 w-16 h-16 rounded-2xl bg-brand-gold text-brand-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:scale-100 shadow-2xl shadow-brand-gold/20 group/btn"
                  >
                    {isThinking ? <Loader2 className="w-8 h-8 animate-spin" /> : <Send className="w-8 h-8 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
