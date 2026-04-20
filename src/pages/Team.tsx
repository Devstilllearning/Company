import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, ChevronRight, Star, Loader2, Sparkles, User as UserIcon, Shield as ShieldIcon, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../components/FirebaseProvider';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export default function Team() {
  const { profile, user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    // Roles that should appear in the team section
    const teamRoles = ['admin', 'ceo', 'treasurer', 'secretary', 'marketing_manager', 'finance_manager', 'strategy_lead'];
    
    const teamQuery = query(
      collection(db, 'users'),
      where('role', 'in', teamRoles),
      orderBy('role', 'asc')
    );

    const unsubscribe = onSnapshot(teamQuery, (snapshot) => {
      const members = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTeamMembers(members);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'users');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    if (!isAdmin) return;
    setUpdatingId(userId);
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'users');
    } finally {
      setUpdatingId(null);
    }
  };

  const roleDefinitions = [
    { id: 'ceo', label: 'Chief Executive Officer' },
    { id: 'treasurer', label: 'Treasurer' },
    { id: 'secretary', label: 'Secretary' },
    { id: 'marketing_manager', label: 'Marketing Manager' },
    { id: 'finance_manager', label: 'Finance Manager' },
    { id: 'strategy_lead', label: 'Strategy Lead' },
    { id: 'admin', label: 'Executive Admin' },
  ];

  const filterOptions = [
    { id: 'all', label: 'All Architects' },
    ...roleDefinitions.map(r => ({ id: r.id, label: r.label.split(' ').pop() || r.label }))
  ];

  const filteredMembers = teamMembers.filter(member => 
    selectedRole === 'all' || member.role === selectedRole
  );

  const getRoleLabel = (role: string) => {
    return roleDefinitions.find(r => r.id === role)?.label || 'Team Member';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    }
  };

  return (
    <div className="py-32 px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-strawberry/5 blur-[120px] -mr-64 -mt-64 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-strawberry/5 blur-[120px] -ml-64 -mb-64 rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-32"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border-brand-strawberry/30 text-brand-strawberry text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-lg"
          >
            <Sparkles className="w-4 h-4" /> Professional Synergy
          </motion.div>
          <h1 className="text-4xl md:text-7xl font-black mb-10 tracking-tighter leading-[0.85] text-brand-deep">
            The <span className="text-gradient">Architects</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/50 max-w-4xl mx-auto leading-relaxed font-medium">
            Our structured organization is built on the pillars of synergy, 
            innovation, and world-class performance. Meet the visionaries driving 
            BERRIONARE towards global excellence.
          </p>

          {/* Role Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 flex flex-wrap justify-center gap-4"
          >
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedRole(option.id)}
                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border ${
                  selectedRole === option.id
                    ? 'bg-brand-deep text-white border-brand-deep shadow-2xl shadow-brand-deep/30 scale-105'
                    : 'bg-white/5 text-white/30 border-white/10 hover:border-brand-strawberry/30 hover:text-brand-strawberry hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-8">
            <Loader2 className="w-20 h-20 text-brand-strawberry animate-spin" />
            <p className="text-brand-strawberry font-black uppercase tracking-[0.4em] text-xs">Assembling the team...</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredMembers.map((member) => (
                <motion.div
                  key={member.id}
                  variants={itemVariants}
                  layout
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                  className="group relative"
                >
                  <div className="bento-card !p-0 overflow-hidden hover:border-brand-strawberry/40 transition-all duration-1000 hover:-translate-y-6 shadow-2xl relative bg-white/5 border-white/10">
                    <div className="aspect-[4/5] overflow-hidden relative">
                      <img
                        src={member.photoURL || `https://picsum.photos/seed/${member.uid}/600/800`}
                        alt={member.displayName}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent opacity-80" />
                      
                      {member.uid === user?.uid && (
                        <div className="absolute top-8 right-8">
                          <div className="bg-brand-strawberry p-4 rounded-2xl text-white shadow-2xl animate-pulse">
                            <Star className="w-6 h-6 fill-current" />
                          </div>
                        </div>
                      )}

                      <div className="absolute bottom-10 left-10">
                        <span className="px-6 py-2.5 rounded-full bg-brand-deep text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl border border-white/10 flex items-center gap-2">
                          {getRoleLabel(member.role)}
                          {isAdmin && <SettingsIcon className="w-3 h-3 text-white/50" />}
                        </span>
                      </div>
                    </div>
                    <div className="p-12 relative">
                      {/* Admin Role Controller */}
                      {isAdmin && (
                        <div className="mb-10 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                          <div className="flex items-center gap-3 mb-2">
                            <ShieldIcon className="w-4 h-4 text-brand-strawberry" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Admin Controls</span>
                          </div>
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleUpdate(member.id, e.target.value)}
                            disabled={updatingId === member.id}
                            className="w-full bg-brand-soft border border-brand-strawberry/20 rounded-xl px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-brand-strawberry transition-all duration-300 disabled:opacity-50 h-16 cursor-pointer shadow-inner"
                          >
                            {roleDefinitions.map(role => (
                              <option key={role.id} value={role.id} className="bg-brand-dark">{role.label}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="flex items-center gap-4 mb-6">
                        <h3 className="text-4xl font-black tracking-tighter text-white font-display group-hover:text-brand-deep transition-colors duration-500">{member.displayName || 'Anonymous Partner'}</h3>
                        {member.uid === user?.uid && (
                          <span className="text-[10px] font-black uppercase px-4 py-1.5 rounded-full bg-brand-strawberry/20 text-brand-strawberry tracking-[0.2em] border border-brand-strawberry/20">You</span>
                        )}
                      </div>
                      
                      <p className="text-white/60 text-lg leading-relaxed mb-6 font-medium italic border-l-2 border-brand-strawberry/30 pl-8 font-sans">
                        "{member.bio || 'This partner has been strategically selected for their unique contributions to the BERRIONARE vision.'}"
                      </p>
                      
                      <div className="flex items-center gap-4 text-brand-strawberry font-sans">
                        <UserIcon className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-brand-strawberry transition-colors duration-500">{member.email}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {!loading && filteredMembers.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-40 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-brand-deep/10 flex items-center justify-center mx-auto mb-10 border border-brand-deep/20">
                  <Users className="w-12 h-12 text-brand-deep" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 font-display">
                  {selectedRole === 'all' ? 'Awaiting Leadership' : 'Position Unfilled'}
                </h3>
                <p className="text-white/40 font-medium font-sans">
                  {selectedRole === 'all' 
                    ? 'The board is currently selecting the executive team members.' 
                    : `We are currently processing candidates for the ${getRoleLabel(selectedRole)} position.`}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
