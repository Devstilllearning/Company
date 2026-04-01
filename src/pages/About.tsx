import { motion } from 'motion/react';
import { CheckCircle2, Target, Users, Lightbulb } from 'lucide-react';

export default function About() {
  return (
    <div className="py-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-32"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border-brand-gold/30 text-brand-gold text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-lg shadow-brand-gold/5">
            Corporate Heritage
          </div>
          <h1 className="text-6xl md:text-9xl font-black mb-10 tracking-tighter leading-[0.85]">
            Our <span className="text-gradient-gold">Legacy</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/50 max-w-4xl mx-auto leading-relaxed font-medium">
            Berrionaire stands as a premier corporate institution, a collective of visionary 
            leaders and innovative architects dedicated to establishing the gold standard 
            in global business excellence through diversity and strategic creativity.
          </p>
        </motion.div>

        {/* Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center mb-48">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-black uppercase tracking-[0.3em] border border-brand-gold/20">
              <Target className="w-4 h-4" /> Strategic Vision
            </div>
            <h2 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter">
              Combining the power of diversity with unique innovation to produce world-class quality work.
            </h2>
            <p className="text-xl text-white/40 leading-relaxed font-medium italic border-l-2 border-brand-gold/30 pl-8">
              "We operate under the fundamental principle that true innovation is born at the 
              nexus of diverse perspectives. By cultivating an elite environment where 
              visionary ideas are nurtured and global synergy is prioritized, we deliver 
              solutions that transcend conventional boundaries."
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="aspect-video rounded-[4rem] overflow-hidden glass p-4 border-white/5 group-hover:border-brand-gold/30 transition-all duration-1000 shadow-2xl">
              <img
                src="https://picsum.photos/seed/vision/1200/800"
                alt="Vision"
                className="w-full h-full object-cover rounded-[3rem] group-hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-brand-purple/20 rounded-full blur-[120px] pointer-events-none group-hover:bg-brand-purple/30 transition-all duration-1000" />
          </motion.div>
        </div>

        {/* Mission */}
        <div className="space-y-24">
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-brand-purple/20"
            >
              <Lightbulb className="w-4 h-4" /> Our Mission
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-20">Three Pillars of Excellence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Sharpen Creativity",
                desc: "Sharpen team creativity to present out-of-the-box and innovative ideas that challenge the status quo.",
                icon: Lightbulb,
                color: "brand-purple"
              },
              {
                title: "Excellence as Standard",
                desc: "Serve as a role model for other students and professionals in terms of work quality and achievement.",
                icon: CheckCircle2,
                color: "brand-gold"
              },
              {
                title: "Synergistic Culture",
                desc: "Foster a culture of knowledge sharing so that we can all synergize effectively and grow together.",
                icon: Users,
                color: "brand-red"
              }
            ].map((mission, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bento-card !p-14 group hover:border-brand-gold/50 transition-all duration-700 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${mission.color}/5 blur-[60px] -mr-16 -mt-16 rounded-full group-hover:bg-${mission.color}/10 transition-all duration-700`} />
                <div className={`w-20 h-20 rounded-3xl bg-${mission.color}/10 flex items-center justify-center mb-12 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 border border-${mission.color}/20`}>
                  <mission.icon className={`w-10 h-10 text-${mission.color}`} />
                </div>
                <h3 className="text-3xl font-black mb-8 tracking-tight uppercase group-hover:text-brand-gold transition-colors duration-300">{mission.title}</h3>
                <p className="text-white/40 leading-relaxed font-medium text-lg">
                  {mission.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
