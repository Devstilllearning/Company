import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, User, Mail, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';
import { useAuth } from '../components/FirebaseProvider';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useNavigate } from 'react-router-dom';

const departments = [
  'CEO Office',
  'Marketing',
  'Operations',
  'Finance',
  'F&B Management',
  'Souvenir Design'
];

const defaultTimeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

export default function Schedule() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedTime, setSelectedTime] = useState('');
  const [department, setDepartment] = useState(departments[0]);
  const [purpose, setPurpose] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>(defaultTimeSlots);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const configRef = doc(db, 'config', 'scheduling');
        const configSnap = await getDoc(configRef);
        if (configSnap.exists()) {
          const data = configSnap.data();
          if (data.availableTimeSlots && Array.isArray(data.availableTimeSlots)) {
            setAvailableSlots(data.availableTimeSlots);
          }
        }
      } catch (err) {
        console.error('Error fetching time slots:', err);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Save meeting request
      const meetingData = {
        requesterUid: user.uid,
        requesterName: profile?.displayName || user.displayName || 'Anonymous',
        requesterEmail: user.email,
        department,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        purpose,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'meetings'), meetingData);

      // 2. Create notification for the user
      await addDoc(collection(db, 'notifications'), {
        recipientUid: user.uid,
        title: 'Meeting Requested',
        message: `Your meeting request for ${department} on ${format(selectedDate, 'MMM d')} at ${selectedTime} has been received.`,
        isRead: false,
        type: 'meeting_request',
        createdAt: serverTimestamp(),
      });

      setIsSubmitted(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'meetings');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bento-card p-16 text-center max-w-xl shadow-2xl shadow-brand-gold/10"
        >
          <div className="w-24 h-24 bg-brand-gold/10 border border-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-10 animate-pulse">
            <CheckCircle className="w-12 h-12 text-brand-gold" />
          </div>
          <h2 className="text-4xl font-black mb-6 tracking-tighter">Meeting Requested!</h2>
          <p className="text-white/40 font-medium mb-10 leading-relaxed">
            Your strategic consultation request has been received. Our executive team will review the agenda and confirm via your secure portal shortly.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-12 py-5 rounded-2xl bg-brand-gold text-brand-black font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-gold/20 hover:scale-105 transition-transform duration-500"
          >
            Schedule Another
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-32"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border-brand-gold/30 text-brand-gold text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-lg shadow-brand-gold/5">
            Executive Scheduling
          </div>
          <h1 className="text-6xl md:text-9xl font-black mb-10 tracking-tighter leading-[0.85]">
            Schedule a <span className="text-gradient-gold">Meeting</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto leading-relaxed font-medium">
            Connect with our leadership team. Select a department and find a time that works for your strategic objectives.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Calendar/Date Selection */}
          <div className="lg:col-span-1 space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bento-card !p-12 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-[60px] -mr-16 -mt-16 rounded-full group-hover:bg-brand-gold/10 transition-all duration-1000" />
              <h3 className="text-xs font-black mb-10 flex items-center gap-4 tracking-[0.4em] uppercase text-white/20">
                <CalendarIcon className="w-6 h-6 text-brand-gold" /> Select Date
              </h3>
              <div className="grid grid-cols-1 gap-4 relative z-10">
                {[0, 1, 2, 3, 4, 5, 6].map((days) => {
                  const date = addDays(startOfToday(), days);
                  const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                  return (
                    <button
                      key={days}
                      onClick={() => setSelectedDate(date)}
                      className={`p-8 rounded-3xl text-left transition-all duration-500 border ${
                        isSelected 
                          ? 'bg-brand-purple text-white shadow-2xl shadow-brand-purple/30 border-brand-purple/50 scale-[1.05]' 
                          : 'bg-white/5 hover:bg-white/10 text-white/40 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${isSelected ? 'text-white/70' : 'text-white/20'}`}>
                        {format(date, 'EEEE')}
                      </div>
                      <div className="text-xl font-black tracking-tight">
                        {format(date, 'MMM d, yyyy')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Form and Time Selection */}
          <div className="lg:col-span-2">
            <motion.form 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit} 
              className="bento-card !p-16 md:!p-20 space-y-12 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-96 h-96 bg-brand-purple/5 blur-[120px] -ml-48 -mt-48 rounded-full group-hover:bg-brand-purple/10 transition-all duration-1000" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-2 flex items-center gap-3">
                    <User className="w-4 h-4" /> Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={profile?.displayName || ''}
                    readOnly
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 opacity-40 cursor-not-allowed font-medium text-white text-lg shadow-inner"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-2 flex items-center gap-3">
                    <Mail className="w-4 h-4" /> Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 opacity-40 cursor-not-allowed font-medium text-white text-lg shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-2">Department</label>
                <div className="relative group/select">
                  <select 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand-gold focus:bg-white/[0.08] transition-all duration-500 appearance-none font-medium text-white cursor-pointer text-lg shadow-inner"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept} className="bg-brand-black text-white">{dept}</option>
                    ))}
                  </select>
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover/select:text-brand-gold transition-colors duration-300">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="space-y-8 relative z-10">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-2 flex items-center gap-3">
                  <Clock className="w-4 h-4" /> Available Slots
                </label>
                {isLoadingSlots ? (
                  <div className="flex items-center gap-4 text-white/20 text-xs font-black uppercase tracking-[0.3em] p-8 bg-white/5 rounded-3xl border border-white/5">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-gold" /> Loading slots...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {availableSlots.map(time => (
                      <button
                        type="button"
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-6 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 border ${
                          selectedTime === time 
                            ? 'bg-brand-gold text-brand-black border-brand-gold shadow-2xl shadow-brand-gold/20 scale-110 z-10' 
                            : 'bg-white/5 hover:bg-white/10 text-white/40 border-white/5 hover:border-white/10'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4 relative z-10">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-2 flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" /> Purpose of Meeting
                </label>
                <textarea
                  required
                  rows={4}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Tell us what you'd like to discuss..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 focus:outline-none focus:border-brand-gold focus:bg-white/[0.08] transition-all duration-500 font-medium text-white placeholder:text-white/10 resize-none text-lg shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedTime || isSubmitting}
                className="w-full py-6 rounded-2xl bg-brand-purple text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-brand-purple/80 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 shadow-2xl shadow-brand-purple/20 group/btn relative z-10"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Meeting Request <CheckCircle className="w-6 h-6 group-hover/btn:scale-110 transition-transform duration-300" />
                  </>
                )}
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </div>
  );
}