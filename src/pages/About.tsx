import { motion } from 'motion/react';
import { CheckCircle2, Target, Users, Lightbulb, Sparkles } from 'lucide-react';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="py-32 px-4 relative overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-deep/10 blur-[120px] -ml-64 -mt-64 rounded-full" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-strawberry/5 blur-[120px] -mr-64 -mb-64 rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-32"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border-brand-strawberry/30 text-brand-strawberry text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-lg">
            <Sparkles className="w-4 h-4" /> Corporate Heritage
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-10 tracking-tighter leading-[0.85] text-white font-display">
            Our <span className="text-brand-deep">Legacy</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-4xl mx-auto leading-relaxed font-medium">
            BERRIONARE stands as a premier corporate institution, a collective of visionary 
            leaders and innovative architects dedicated to establishing the gold standard 
            in global business excellence through diversity and strategic creativity.
          </p>
        </motion.div>

        {/* Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center mb-48">
          <motion.div
            variants={itemVariants}
            className="space-y-12"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-brand-strawberry/10 text-brand-strawberry text-[10px] font-black uppercase tracking-[0.3em] border border-brand-strawberry/20">
              <Target className="w-4 h-4" /> Strategic Vision
            </div>
            <h2 className="text-3xl md:text-5xl font-black leading-[0.95] tracking-tighter text-white font-display">
              Combining the power of diversity with unique innovation to produce world-class quality work.
            </h2>
            <p className="text-lg text-white/40 leading-relaxed font-medium italic border-l-2 border-brand-strawberry/30 pl-8 font-sans">
              "We operate under the fundamental principle that true innovation is born at the 
              nexus of diverse perspectives. By cultivating an elite environment where 
              visionary ideas are nurtured and global synergy is prioritized, we deliver 
              solutions that transcend conventional boundaries."
            </p>
          </motion.div>
          <motion.div 
            variants={itemVariants}
            className="relative group"
          >
            <div className="aspect-video rounded-[4rem] overflow-hidden bg-white/5 p-4 border border-white/10 group-hover:border-brand-deep/30 transition-all duration-1000 shadow-2xl">
              <img
                src="https://picsum.photos/seed/vision/1200/800"
                alt="Vision"
                className="w-full h-full object-cover rounded-[3rem] group-hover:scale-110 transition-transform duration-1000 opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-brand-deep/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-brand-deep/20 transition-all duration-1000" />
          </motion.div>
        </div>

        {/* Mission */}
        <div className="space-y-24">
          <div className="text-center">
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-brand-strawberry/10 text-brand-strawberry text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-brand-strawberry/20 font-sans"
            >
              <Lightbulb className="w-4 h-4" /> Our Mission
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-20 text-white font-display">Three Pillars of Excellence</h2>
          </div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {[
              {
                title: "Sharpen Creativity",
                desc: "Sharpen team creativity to present out-of-the-box and innovative ideas that challenge the status quo.",
                icon: Lightbulb,
                color: "brand-strawberry"
              },
              {
                title: "Excellence as Standard",
                desc: "Serve as a role model for other students and professionals in terms of work quality and achievement.",
                icon: CheckCircle2,
                color: "brand-deep"
              },
              {
                title: "Synergistic Culture",
                desc: "Foster a culture of knowledge sharing so that we can all synergize effectively and grow together.",
                icon: Users,
                color: "white"
              }
            ].map((mission, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bento-card !p-14 group transition-all duration-700 relative overflow-hidden bg-white/5 border-white/10 shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-deep/5 blur-[60px] -mr-16 -mt-16 rounded-full group-hover:bg-brand-deep/10 transition-all duration-700" />
                <div className="w-20 h-20 rounded-3xl bg-brand-deep/10 flex items-center justify-center mb-12 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 border border-brand-deep/20 shadow-inner">
                  <mission.icon className="w-10 h-10 text-brand-strawberry" />
                </div>
                <h3 className="text-3xl font-black mb-8 tracking-tight uppercase group-hover:text-brand-strawberry transition-colors duration-300 text-white font-display">{mission.title}</h3>
                <p className="text-white/40 leading-relaxed font-bold text-lg">
                  {mission.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
