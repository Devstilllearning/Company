import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Camera, Save, Shield, Bell, ChevronRight, Loader2, CheckCircle2, AlertCircle, Clock, Plus, Trash2, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../components/FirebaseProvider';
import { doc, updateDoc, addDoc, collection, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export default function Settings() {
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [role, setRole] = useState(profile?.role?.toLowerCase() || 'client');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Admin Config State
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState('');
  const [isAdminSaving, setIsAdminSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setPhotoURL(profile.photoURL || '');
      setRole(profile.role?.toLowerCase() || 'client');
    }
  }, [profile]);

  useEffect(() => {
    if (activeTab === 'Admin' && profile?.role === 'admin') {
      const fetchConfig = async () => {
        try {
          const configRef = doc(db, 'config', 'scheduling');
          const configSnap = await getDoc(configRef);
          if (configSnap.exists()) {
            setAvailableSlots(configSnap.data().availableTimeSlots || []);
          }
        } catch (err) {
          console.error('Error fetching config:', err);
        }
      };
      fetchConfig();
    }
  }, [activeTab, profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: displayName,
        photoURL: photoURL,
        role: role,
      });

      // Create a security notification
      await addDoc(collection(db, 'notifications'), {
        recipientUid: user.uid,
        title: 'Security Alert: Profile Updated',
        message: `Your profile information (Name/Photo) was updated on ${new Date().toLocaleString()}. If this wasn't you, please contact support.`,
        isRead: false,
        type: 'security',
        createdAt: serverTimestamp(),
      });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAdminConfig = async () => {
    if (profile?.role !== 'admin') return;
    setIsAdminSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const configRef = doc(db, 'config', 'scheduling');
      await setDoc(configRef, {
        availableTimeSlots: availableSlots,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setMessage({ type: 'success', text: 'Admin configuration saved successfully!' });
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, 'config/scheduling');
      setMessage({ type: 'error', text: 'Failed to save admin configuration.' });
    } finally {
      setIsAdminSaving(false);
    }
  };

  const addSlot = () => {
    if (newSlot && !availableSlots.includes(newSlot)) {
      setAvailableSlots([...availableSlots, newSlot].sort());
      setNewSlot('');
    }
  };

  const removeSlot = (slot: string) => {
    setAvailableSlots(availableSlots.filter(s => s !== slot));
  };

  const tabs = [
    { icon: User, label: 'Profile' },
    { icon: Shield, label: 'Security' },
    { icon: Bell, label: 'Notifications' },
  ];

  if (profile?.role === 'admin') {
    tabs.push({ icon: SettingsIcon, label: 'Admin' });
  }

  return (
    <div className="py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border-brand-gold/30 text-brand-gold text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-lg shadow-brand-gold/5">
            Account Preferences
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
            System <span className="text-gradient-gold">Settings</span>
          </h1>
          <p className="text-xl text-white/40 max-w-2xl font-medium">Manage your executive profile, security protocols, and platform configurations.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bento-card !p-4 sticky top-32">
              {tabs.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveTab(item.label)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-500 group ${
                    activeTab === item.label 
                      ? 'bg-brand-purple text-white shadow-2xl shadow-brand-purple/30 scale-[1.02] z-10' 
                      : 'hover:bg-white/5 text-white/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl transition-all duration-500 ${activeTab === item.label ? 'bg-white/20 text-white' : 'bg-white/5 text-white/30 group-hover:text-brand-gold'}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-all duration-500 ${activeTab === item.label ? 'rotate-90 text-white' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-brand-gold'}`} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {activeTab === 'Profile' && (
              <motion.form 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSave} 
                className="bento-card !p-12 md:!p-16 space-y-12 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[80px] -mr-32 -mt-32 rounded-full group-hover:bg-brand-gold/10 transition-all duration-1000" />
                
                <div className="flex flex-col items-center sm:flex-row gap-10 pb-12 border-b border-white/5 relative z-10">
                  <div className="relative group/avatar">
                    <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden glass p-1.5 ring-2 ring-white/5 group-hover/avatar:ring-brand-gold/50 transition-all duration-700 shadow-2xl">
                      <img
                        src={photoURL || 'https://picsum.photos/seed/user/200/200'}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-[2rem] transition-transform duration-1000 group-hover/avatar:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 p-3 bg-brand-gold rounded-2xl text-brand-black shadow-2xl transform group-hover/avatar:scale-110 group-hover/avatar:rotate-12 transition-all duration-500 cursor-pointer">
                      <Camera className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left space-y-3">
                    <h3 className="text-4xl font-black tracking-tighter text-gradient-gold">{profile?.displayName || 'User'}</h3>
                    <p className="text-lg text-white/30 font-medium tracking-tight">{profile?.email}</p>
                    <div className="pt-2">
                      <span className="px-5 py-2 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-gold text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-brand-purple/10">
                        {profile?.role || 'Client'}
                      </span>
                    </div>
                  </div>
                </div>

                {message.text && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-3xl text-sm font-black uppercase tracking-widest flex items-center gap-4 relative z-10 ${
                    message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    {message.text}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 gap-10 relative z-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-3 ml-2">
                      <User className="w-4 h-4 text-brand-gold" /> Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand-gold focus:bg-white/[0.08] transition-all duration-500 text-white placeholder:text-white/10 text-lg shadow-inner"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-3 ml-2">
                      <Camera className="w-4 h-4 text-brand-gold" /> Profile Photo URL
                    </label>
                    <input
                      type="text"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand-gold focus:bg-white/[0.08] transition-all duration-500 text-white placeholder:text-white/10 text-lg shadow-inner"
                    />
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest ml-2">Direct image URL required for profile synchronization.</p>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-3 ml-2">
                      <Mail className="w-4 h-4 text-brand-gold" /> Email Address
                    </label>
                    <input
                      disabled
                      type="email"
                      value={profile?.email || ''}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 opacity-40 cursor-not-allowed text-white/50 text-lg shadow-inner"
                    />
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest ml-2">Email identity is immutable for security protocol integrity.</p>
                  </div>

                  {(profile?.role === 'admin' || profile?.email === 'nataliariyadi37@gmail.com') && (
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-3 ml-2">
                        <Shield className="w-4 h-4 text-brand-gold" /> Account Role
                      </label>
                      <div className="relative group/select">
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand-gold focus:bg-white/[0.08] transition-all duration-500 text-white appearance-none cursor-pointer text-lg shadow-inner"
                        >
                          <option value="client" className="bg-brand-black">Client</option>
                          <option value="admin" className="bg-brand-black">Admin</option>
                        </select>
                        <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 rotate-90 pointer-events-none group-hover/select:text-brand-gold transition-colors duration-300" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-8 relative z-10">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto px-16 py-6 rounded-2xl bg-brand-purple text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-brand-purple/80 transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl shadow-brand-purple/30 group/btn"
                  >
                    {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 group-hover/btn:scale-110 transition-transform duration-300" />}
                    {isSaving ? 'Synchronizing...' : 'Save Changes'}
                  </button>
                </div>
              </motion.form>
            )}

            {activeTab === 'Security' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bento-card !p-12 md:!p-16 space-y-12 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-64 h-64 bg-brand-purple/5 blur-[80px] -ml-32 -mt-32 rounded-full group-hover:bg-brand-purple/10 transition-all duration-1000" />
                
                <div className="flex items-center gap-8 mb-12 relative z-10">
                  <div className="w-20 h-20 rounded-3xl bg-brand-purple/20 flex items-center justify-center border border-brand-purple/30 shadow-xl">
                    <Shield className="w-10 h-10 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-gradient-gold tracking-tighter">Security Protocols</h3>
                    <p className="text-lg text-white/30 font-medium">Protect your executive credentials and data integrity.</p>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-between group/item hover:bg-white/[0.08] transition-all duration-500 shadow-inner">
                    <div className="space-y-2">
                      <h4 className="text-xl font-black group-hover/item:text-brand-gold transition-colors duration-300 tracking-tight">Two-Factor Authentication</h4>
                      <p className="text-sm text-white/30 font-medium">Add an extra layer of security to your account.</p>
                    </div>
                    <div className="w-16 h-8 bg-white/10 rounded-full relative cursor-pointer overflow-hidden group/toggle">
                      <div className="absolute left-1.5 top-1.5 w-5 h-5 bg-white/30 rounded-full transition-all duration-500 group-hover/toggle:bg-white/50" />
                    </div>
                  </div>

                  <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-between group/item hover:bg-white/[0.08] transition-all duration-500 shadow-inner">
                    <div className="space-y-2">
                      <h4 className="text-xl font-black group-hover/item:text-brand-gold transition-colors duration-300 tracking-tight">Login Notifications</h4>
                      <p className="text-sm text-white/30 font-medium">Get notified whenever someone logs into your account.</p>
                    </div>
                    <div className="w-16 h-8 bg-brand-purple rounded-full relative cursor-pointer overflow-hidden shadow-lg shadow-brand-purple/20">
                      <div className="absolute right-1.5 top-1.5 w-5 h-5 bg-white rounded-full shadow-md" />
                    </div>
                  </div>

                  <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 shadow-inner">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-10 flex items-center gap-3">
                      <Clock className="w-4 h-4 text-brand-gold" /> Recent Security Activity
                    </h4>
                    <div className="space-y-8">
                      <div className="flex items-center gap-6 group/log">
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/40 animate-pulse" />
                        <span className="text-white/50 font-medium group-hover/log:text-white transition-colors duration-300">Profile synchronized successfully</span>
                        <span className="text-white/20 ml-auto font-black uppercase tracking-widest text-[10px]">Just now</span>
                      </div>
                      <div className="flex items-center gap-6 group/log">
                        <div className="w-3 h-3 rounded-full bg-brand-gold shadow-lg shadow-brand-gold/40" />
                        <span className="text-white/50 font-medium group-hover/log:text-white transition-colors duration-300">New login from Chrome on Windows</span>
                        <span className="text-white/20 ml-auto font-black uppercase tracking-widest text-[10px]">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Notifications' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bento-card !p-12 md:!p-16 space-y-12 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[80px] -mr-32 -mt-32 rounded-full group-hover:bg-brand-gold/10 transition-all duration-1000" />
                
                <div className="flex items-center gap-8 mb-12 relative z-10">
                  <div className="w-20 h-20 rounded-3xl bg-brand-purple/20 flex items-center justify-center border border-brand-purple/30 shadow-xl">
                    <Bell className="w-10 h-10 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-gradient-gold tracking-tighter">Communication</h3>
                    <p className="text-lg text-white/30 font-medium">Choose how you want to receive strategic updates.</p>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  {['Email Notifications', 'Push Notifications', 'Meeting Reminders', 'Marketing Updates'].map((label, i) => (
                    <div key={label} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-between group/item hover:bg-white/[0.08] transition-all duration-500 shadow-inner">
                      <div>
                        <h4 className="text-xl font-black group-hover/item:text-brand-gold transition-colors duration-300 tracking-tight">{label}</h4>
                      </div>
                      <div className={`w-16 h-8 rounded-full relative cursor-pointer transition-all duration-500 shadow-lg ${i < 3 ? 'bg-brand-purple shadow-brand-purple/20' : 'bg-white/10'}`}>
                        <div className={`absolute top-1.5 w-5 h-5 rounded-full transition-all duration-500 shadow-md ${i < 3 ? 'right-1.5 bg-white' : 'left-1.5 bg-white/30'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'Admin' && profile?.role === 'admin' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bento-card !p-12 md:!p-16 space-y-12 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-64 h-64 bg-brand-gold/5 blur-[80px] -ml-32 -mt-32 rounded-full group-hover:bg-brand-gold/10 transition-all duration-1000" />
                
                <div className="flex items-center gap-8 mb-12 relative z-10">
                  <div className="w-20 h-20 rounded-3xl bg-brand-purple/20 flex items-center justify-center border border-brand-purple/30 shadow-xl">
                    <Clock className="w-10 h-10 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-gradient-gold tracking-tighter">Scheduling Config</h3>
                    <p className="text-lg text-white/30 font-medium">Manage available time slots for executive consultations.</p>
                  </div>
                </div>

                <div className="space-y-10 relative z-10">
                  <div className="flex gap-6">
                    <input
                      type="text"
                      value={newSlot}
                      onChange={(e) => setNewSlot(e.target.value)}
                      placeholder="e.g., 05:00 PM"
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white focus:outline-none focus:border-brand-gold focus:bg-white/[0.08] transition-all duration-500 text-lg shadow-inner"
                    />
                    <button
                      onClick={addSlot}
                      className="bg-brand-gold text-brand-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-gold/90 transition-all duration-500 flex items-center gap-3 shadow-2xl shadow-brand-gold/20"
                    >
                      <Plus className="w-5 h-5" /> Add
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {availableSlots.map((slot) => (
                      <motion.div
                        key={slot}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 group/slot hover:border-brand-gold/50 hover:bg-white/[0.08] transition-all duration-500 shadow-inner"
                      >
                        <span className="text-white font-black text-sm uppercase tracking-widest">{slot}</span>
                        <button
                          onClick={() => removeSlot(slot)}
                          className="text-white/10 hover:text-red-500 transition-all duration-300 p-2 hover:scale-110"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-10 border-t border-white/5">
                    <button
                      onClick={handleSaveAdminConfig}
                      disabled={isAdminSaving}
                      className="w-full bg-white text-brand-black py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-white/90 transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl group/save"
                    >
                      {isAdminSaving ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Save className="w-6 h-6 group-save:scale-110 transition-transform duration-300" />
                      )}
                      Save Configuration
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bento-card !p-12 border-red-500/20 bg-red-500/5 group/danger"
            >
              <h3 className="text-2xl font-black text-red-500 mb-6 flex items-center gap-4 tracking-tight">
                <AlertCircle className="w-8 h-8" /> Danger Zone
              </h3>
              <p className="text-lg text-white/40 mb-10 leading-relaxed font-medium">
                Account termination is permanent. All strategic data, portfolio history, and consultation logs will be purged from our secure servers.
              </p>
              <button className="w-full sm:w-auto px-12 py-5 rounded-2xl border-2 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500 font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-red-500/5">
                Terminate Account
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
