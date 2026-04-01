import { motion } from 'motion/react';
import { teamData } from '../data/mockData';
import { Users, ChevronRight, Star } from 'lucide-react';
import { useAuth } from '../components/FirebaseProvider';

export default function Team() {
  const { profile, user } = useAuth();

  // If user is logged in, we can show them as a special member or just at the top
  const currentUserMember = user ? {
    id: user.uid,
    name: profile?.displayName || 'You',
    role: profile?.role === 'admin' ? 'Executive Admin' : 'Valued Member',
    description: profile?.role === 'admin' 
      ? 'Overseeing strategic operations and system integrity for Berrionaire.' 
      : 'Contributing to the Berrionaire ecosystem through active engagement.',
    photo: profile?.photoURL || 'https://picsum.photos/seed/user/400/400',
    isCurrentUser: true
  } : null;

  return (
    <div className="py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-32"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border-brand-gold/30 text-brand-gold text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-lg shadow-brand-gold/5">
            Executive Leadership
          </div>
          <h1 className="text-6xl md:text-9xl font-black mb-10 tracking-tighter leading-[0.85]">
            The <span className="text-gradient-gold">Architects</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/50 max-w-4xl mx-auto leading-relaxed font-medium">
            Meet the visionaries and strategic leaders driving Berrionaire towards global 
            excellence. Our structured organization is built on the pillars of synergy, 
            innovation, and world-class performance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Show current user first if logged in */}
          {currentUserMember && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative"
            >
              <div className="bento-card !p-0 overflow-hidden border-brand-gold/30 hover:border-brand-gold transition-all duration-1000 hover:-translate-y-6 bg-brand-purple/5 shadow-2xl shadow-brand-purple/20">
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={currentUserMember.photo}
                    alt={currentUserMember.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-90" />
                  <div className="absolute top-8 right-8">
                    <div className="bg-brand-gold p-4 rounded-2xl text-brand-black shadow-2xl animate-bounce">
                      <Star className="w-6 h-6 fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-10 left-10">
                    <span className="px-6 py-2.5 rounded-full bg-brand-purple text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl border border-white/10">
                      {currentUserMember.role}
                    </span>
                  </div>
                </div>
                <div className="p-12">
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-4xl font-black tracking-tighter">{currentUserMember.name}</h3>
                    <span className="text-[10px] font-black uppercase px-4 py-1.5 rounded-full bg-white/10 text-white/40 tracking-[0.2em] border border-white/5">You</span>
                  </div>
                  <p className="text-white/40 text-lg leading-relaxed mb-12 font-medium italic border-l-2 border-brand-purple/30 pl-8">
                    "{currentUserMember.description}"
                  </p>
                  <button className="w-full py-6 rounded-2xl bg-brand-gold text-brand-black hover:bg-brand-gold/80 transition-all duration-500 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-brand-gold/20 group/btn">
                    Edit Profile <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {teamData.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bento-card !p-0 overflow-hidden hover:border-brand-gold/50 transition-all duration-1000 hover:-translate-y-6 shadow-2xl relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-[60px] -mr-16 -mt-16 rounded-full group-hover:bg-brand-gold/10 transition-all duration-1000" />
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-10 left-10">
                    <span className="px-6 py-2.5 rounded-full bg-brand-gold text-brand-black text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl border border-brand-black/10">
                      {member.role}
                    </span>
                  </div>
                </div>
                <div className="p-12">
                  <h3 className="text-4xl font-black mb-6 tracking-tighter group-hover:text-brand-gold transition-colors duration-300">{member.name}</h3>
                  <p className="text-white/40 text-lg leading-relaxed mb-12 font-medium italic border-l-2 border-brand-gold/30 pl-8">
                    "{member.description}"
                  </p>
                  
                  {member.members && member.members.length > 0 && (
                    <div className="pt-10 border-t border-white/5">
                      <div className="flex items-center gap-4 text-brand-gold mb-8">
                        <Users className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Team Members</span>
                      </div>
                      <div className="flex -space-x-5 overflow-hidden">
                        {member.members.map((sub) => (
                          <div key={sub.id} className="relative group/sub">
                            <img
                              className="inline-block h-14 w-14 rounded-2xl ring-4 ring-brand-black object-cover hover:scale-110 hover:z-10 transition-all duration-500"
                              src={sub.photo}
                              alt={sub.name}
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 px-5 py-2.5 bg-brand-gold text-brand-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl opacity-0 group-hover/sub:opacity-100 transition-all duration-500 whitespace-nowrap shadow-2xl translate-y-4 group-hover/sub:translate-y-0 border border-brand-black/10">
                              {sub.name} • {sub.role}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button className="mt-12 w-full py-6 rounded-2xl glass hover:bg-white/10 transition-all duration-500 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em] border-white/5 group/btn">
                    View Details <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
