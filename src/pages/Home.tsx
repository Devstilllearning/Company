import { motion } from 'motion/react';
import { ArrowRight, Calendar, Users, Target, Rocket, LayoutDashboard, Sparkles, Brain, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/FirebaseProvider';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center px-4 pt-20">
        {/* Background blobs */}
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass border-white/10 text-brand-gold text-[10px] font-black mb-10 uppercase tracking-[0.3em] shadow-xl">
              <Shield className="w-3.5 h-3.5" /> Established Corporate Institution
            </div>
            <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter mb-10 leading-[0.85] text-gradient">
              GLOBAL <br />
              SYNERGY
            </h1>
            <p className="text-lg md:text-2xl text-white/50 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
              Berrionaire is a premier corporate ecosystem dedicated to combining the power of 
              diversity with unique innovation to produce world-class quality work.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-brand-gold text-brand-black font-black text-sm uppercase tracking-widest hover:scale-105 transition-all duration-500 flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(212,175,55,0.2)]"
                >
                  Command Center <LayoutDashboard className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-brand-gold text-brand-black font-black text-sm uppercase tracking-widest hover:scale-105 transition-all duration-500 flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(212,175,55,0.2)]"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              <Link
                to="/schedule"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl glass text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all duration-500 flex items-center justify-center gap-3 border-white/10"
              >
                Schedule Meeting <Calendar className="w-5 h-5 text-brand-gold" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Global Offices', value: '12+' },
              { label: 'Strategic Partners', value: '500+' },
              { label: 'Market Capital', value: '$2.4B' },
              { label: 'Innovation Awards', value: '85' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-6xl font-black text-gradient-gold mb-2">{stat.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence Section */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand-gold/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bento-card p-16 md:p-32 border-brand-gold/20 relative overflow-hidden group !rounded-[4rem]">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
              <Brain className="w-[400px] h-[400px] text-brand-gold" />
            </div>
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-black mb-10 uppercase tracking-widest border border-brand-gold/20">
                <Sparkles className="w-4 h-4" /> Proprietary High-Thinking AI
              </div>
              <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter leading-none">
                Berrionaire <br />
                <span className="text-gradient-gold">Intelligence</span>
              </h2>
              <p className="text-xl text-white/50 mb-16 leading-relaxed font-medium">
                Leverage our advanced strategic foresight engine. Designed for complex 
                problem-solving and visionary market analysis, our high-thinking model 
                provides the intellectual edge your business needs.
              </p>
              <Link
                to="/intelligence"
                className="inline-flex items-center gap-4 px-12 py-6 rounded-2xl bg-brand-gold text-brand-black font-black text-sm uppercase tracking-widest hover:scale-105 transition-all duration-500 shadow-[0_0_50px_rgba(212,175,55,0.3)]"
              >
                Consult the Engine <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Preview */}
      <section className="py-32 bg-brand-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="inline-flex items-center gap-2 text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">
                <Target className="w-4 h-4" /> Strategic Direction
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">Our Visionary <br />Foundation</h2>
              <p className="text-2xl text-white/40 leading-relaxed italic border-l-4 border-brand-gold pl-8 py-2">
                "Combining the power of diversity with unique innovation to produce quality work"
              </p>
              <Link to="/about" className="inline-flex items-center text-brand-gold font-black text-xs uppercase tracking-widest hover:gap-4 transition-all duration-300 group">
                Explore our legacy <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Rocket, title: 'Innovation', desc: 'Out-of-the-box ideas' },
                { icon: Target, title: 'Achievement', desc: 'Role models in work' },
                { icon: Users, title: 'Synergy', desc: 'Knowledge sharing' },
                { icon: Globe, title: 'Global Reach', desc: 'Continuous expansion' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bento-card !p-10 !rounded-[2.5rem]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center mb-8">
                    <item.icon className="w-7 h-7 text-brand-gold" />
                  </div>
                  <h3 className="font-black text-xl mb-3 tracking-tight uppercase">{item.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed font-medium">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bento-card !p-20 md:!p-32 text-center relative overflow-hidden !rounded-[4rem] border-white/5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-gold/10 to-transparent pointer-events-none" />
            <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter">Ready to <br />synergize?</h2>
            <p className="text-xl text-white/40 mb-16 max-w-xl mx-auto leading-relaxed font-medium">
              Join our network of innovators and leaders. Let's create something extraordinary together.
            </p>
            <Link
              to="/contact"
              className="inline-flex px-16 py-6 rounded-2xl bg-white text-brand-black font-black text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all duration-500 shadow-2xl"
            >
              Contact Us Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
