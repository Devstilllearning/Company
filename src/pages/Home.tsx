import { motion } from 'motion/react';
import { ArrowRight, Calendar, Users, Target, Rocket, LayoutDashboard, Sparkles, Brain, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/FirebaseProvider';

export default function Home() {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="relative overflow-hidden bg-black min-h-screen text-white font-sans"
    >
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center px-4 pt-20">
        {/* Background blobs */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-brand-strawberry/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-brand-deep/30 rounded-full blur-[140px] animate-pulse transition-all duration-1000" />
        
        <div className="max-w-6xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-brand-strawberry text-[10px] font-black mb-10 uppercase tracking-[0.4em] shadow-2xl">
              <Shield className="w-4 h-4" /> Established Corporate Institution
            </div>
            <h1 className="text-5xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] font-display">
              <span className="text-brand-deep drop-shadow-2xl">GLOBAL</span> <br />
              <span className="text-white">SYNERGY</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/40 mb-16 max-w-4xl mx-auto leading-relaxed font-medium font-sans">
              BERRIONARE is a premier corporate ecosystem dedicated to combining the power of 
              diversity with unique innovation to produce world-class quality work.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-12 py-7 rounded-2xl bg-brand-deep text-white font-black text-xs uppercase tracking-[0.4em] hover:scale-110 hover:shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all duration-700 flex items-center justify-center gap-4 shadow-2xl"
                >
                  Command Center <LayoutDashboard className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-12 py-7 rounded-2xl bg-brand-strawberry text-white font-black text-xs uppercase tracking-[0.4em] hover:scale-110 hover:shadow-[0_20px_50px_rgba(251,113,133,0.5)] transition-all duration-700 flex items-center justify-center gap-4 shadow-2xl"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              <Link
                to="/schedule"
                className="w-full sm:w-auto px-12 py-7 rounded-2xl bg-white/5 backdrop-blur-xl text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all duration-500 flex items-center justify-center gap-4 border border-white/10 shadow-2xl"
              >
                Schedule Meeting <Calendar className="w-5 h-5 text-brand-strawberry" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intelligence Section */}
      <section className="py-40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bento-card p-16 md:p-32 border-white/10 relative overflow-hidden group !rounded-[4.5rem] bg-white/5"
          >
            <div className="absolute -top-20 -right-20 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-1000 rotate-12">
              <Brain className="w-[600px] h-[600px] text-brand-deep" />
            </div>
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-brand-strawberry/10 text-brand-strawberry text-[10px] font-black mb-10 uppercase tracking-widest border border-brand-strawberry/20">
                <Sparkles className="w-4 h-4" /> Proprietary High-Thinking AI
              </div>
              <h2 className="text-4xl md:text-7xl font-black mb-10 tracking-tighter leading-none text-white font-display">
                BERRIONARE <br />
                <span className="text-brand-deep drop-shadow-amber-100">Intelligence</span>
              </h2>
              <p className="text-xl text-white/50 mb-16 leading-relaxed font-medium">
                Leverage our advanced strategic foresight engine. Designed for complex 
                problem-solving and visionary market analysis, our high-thinking model 
                provides the intellectual edge your business needs.
              </p>
              <Link
                to="/intelligence"
                className="inline-flex items-center gap-4 px-12 py-6 rounded-2xl bg-brand-deep text-white font-black text-xs uppercase tracking-widest hover:scale-105 transition-all duration-500 shadow-2xl shadow-brand-deep/20"
              >
                Consult the Engine <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Preview */}
      <section className="py-40 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              <div className="inline-flex items-center gap-2 text-brand-strawberry text-[10px] font-black uppercase tracking-[0.4em]">
                <Target className="w-4 h-4" /> Strategic Direction
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight text-white font-display">Our Visionary <br />Foundation</h2>
              <p className="text-2xl text-white/40 leading-relaxed italic border-l-[6px] border-brand-strawberry pl-10 py-4 font-medium font-sans">
                "Combining the power of diversity with unique innovation to produce quality work"
              </p>
              <Link to="/about" className="inline-flex items-center text-brand-strawberry font-black text-xs uppercase tracking-widest hover:gap-6 transition-all duration-500 group">
                Explore our legacy <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
              </Link>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            >
              {[
                { icon: Rocket, title: 'Innovation', desc: 'Out-of-the-box ideas' },
                { icon: Target, title: 'Achievement', desc: 'Role models in work' },
                { icon: Users, title: 'Synergy', desc: 'Knowledge sharing' },
                { icon: Globe, title: 'Global Reach', desc: 'Continuous expansion' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9, y: 30 },
                    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="bento-card !p-12 !rounded-[3rem] bg-white/5 hover:bg-white/10 border-white/10 hover:-translate-y-3 transition-all duration-700"
                >
                  <div className="w-16 h-16 rounded-2xl bg-brand-deep/10 flex items-center justify-center mb-10 shadow-inner">
                    <item.icon className="w-8 h-8 text-brand-deep" />
                  </div>
                  <h3 className="font-black text-2xl mb-4 tracking-tighter uppercase text-white font-display">{item.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed font-bold tracking-tight font-sans">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bento-card !p-24 md:!p-32 text-center relative overflow-hidden !rounded-[5rem] border-white/10 bg-brand-dark shadow-[0_50px_100px_rgba(0,0,0,0.4)]"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-deep/10 via-transparent to-brand-deep/5 pointer-events-none" />
            <h2 className="text-5xl md:text-8xl font-black mb-12 tracking-tighter text-white leading-none font-display">Ready to <br />synergize?</h2>
            <p className="text-xl text-white/40 mb-20 max-w-xl mx-auto leading-relaxed font-bold font-sans">
              Join our network of innovators and leaders. Let's create something extraordinary together.
            </p>
            <Link
              to="/contact"
              className="inline-flex px-16 py-7 rounded-2xl bg-brand-deep text-white font-black text-sm uppercase tracking-[0.3em] hover:scale-110 transition-all duration-700 shadow-[0_0_50px_rgba(37,99,235,0.4)]"
            >
              Contact Us Today
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
