import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Bell, Settings, Plus, ChevronRight, Clock, X, CheckCircle, Mail, UserPlus, Check, XCircle, BarChart3, Megaphone, Send, Loader2, TrendingUp, Shield, User as UserIcon, Brain, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/FirebaseProvider';
import { toast } from 'sonner';
import { collection, query, where, onSnapshot, orderBy, limit, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [allMeetings, setAllMeetings] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastData, setBroadcastData] = useState({ title: '', message: '' });
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'client'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [roleChangeConfirm, setRoleChangeConfirm] = useState<{ user: any, newRole: string } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch user's meetings
    const meetingsQuery = query(
      collection(db, 'meetings'),
      where('requesterUid', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubMeetings = onSnapshot(meetingsQuery, (snapshot) => {
      setMeetings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'meetings'));

    // Fetch user's notifications
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('recipientUid', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubNotifications = onSnapshot(notificationsQuery, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'notifications'));

    // Admin specific data
    let unsubAllMeetings: () => void = () => {};
    let unsubAllUsers: () => void = () => {};
    let unsubContacts: () => void = () => {};

    if (profile?.role === 'admin') {
      setAdminLoading(true);
      
      // All meetings for admin
      const allMeetingsQuery = query(
        collection(db, 'meetings'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      unsubAllMeetings = onSnapshot(allMeetingsQuery, (snapshot) => {
        setAllMeetings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setAdminLoading(false);
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'meetings'));

      // All users for admin
      const allUsersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(100)
      );
      unsubAllUsers = onSnapshot(allUsersQuery, (snapshot) => {
        setAllUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));

      // Contact messages for admin
      const contactsQuery = query(
        collection(db, 'contacts'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      unsubContacts = onSnapshot(contactsQuery, (snapshot) => {
        setContactMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'contacts'));
    }

    return () => {
      unsubMeetings();
      unsubNotifications();
      unsubAllMeetings();
      unsubAllUsers();
      unsubContacts();
    };
  }, [user, navigate, profile]);

  const updateMeetingStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'meetings', id), { status });
      
      // Notify the user
      const meeting = allMeetings.find(m => m.id === id);
      if (meeting) {
        await addDoc(collection(db, 'notifications'), {
          recipientUid: meeting.requesterUid,
          title: `Meeting ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          message: `Your meeting request for ${meeting.department} on ${meeting.date} has been ${status}.`,
          isRead: false,
          type: 'meeting_update',
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `meetings/${id}`);
    }
  };

  const deleteContactMessage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contacts', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `contacts/${id}`);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastData.title || !broadcastData.message) return;
    
    setIsBroadcasting(true);
    try {
      // Create notifications for all users (limited to the 100 we fetched)
      const promises = allUsers.map(u => 
        addDoc(collection(db, 'notifications'), {
          recipientUid: u.uid,
          title: `Announcement: ${broadcastData.title}`,
          message: broadcastData.message,
          isRead: false,
          type: 'announcement',
          createdAt: serverTimestamp(),
        })
      );
      
      await Promise.all(promises);
      setShowBroadcastModal(false);
      setBroadcastData({ title: '', message: '' });
      toast.success('Broadcast sent successfully to all users!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'notifications');
      toast.error('Failed to send broadcast');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { isRead: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `notifications/${id}`);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `notifications/${id}`);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    if (userId === user?.uid) {
      toast.error("You cannot change your own role to avoid losing admin access.");
      return;
    }
    
    const loadingToast = toast.loading('Updating user role...');
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      toast.success(`User role updated to ${newRole}`, { id: loadingToast });
      setRoleChangeConfirm(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
      toast.error('Failed to update user role', { id: loadingToast });
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = (u.displayName?.toLowerCase() || '').includes(userSearchTerm.toLowerCase()) || 
                         (u.email?.toLowerCase() || '').includes(userSearchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    
    // Date filtering
    let matchesDate = true;
    if (u.createdAt) {
      const userDate = u.createdAt.toDate ? u.createdAt.toDate() : new Date(u.createdAt);
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (userDate < start) matchesDate = false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (userDate > end) matchesDate = false;
      }
    }

    return matchesSearch && matchesRole && matchesDate;
  });

  return (
    <div className="py-12 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8"
        >
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-[2rem] glass p-1.5 shadow-2xl relative group">
              <div className="absolute inset-0 bg-brand-gold/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img 
                src={profile?.photoURL || 'https://picsum.photos/seed/user/200/200'} 
                alt={profile?.displayName} 
                className="w-full h-full object-cover rounded-[1.75rem] relative z-10" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-5xl font-black tracking-tighter text-gradient-gold">
                  Welcome back, {profile?.displayName?.split(' ')[0] || 'User'}
                </h1>
                <Sparkles className="w-6 h-6 text-brand-gold animate-pulse" />
              </div>
              <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[11px] flex items-center gap-3">
                <span className="w-8 h-px bg-white/20" />
                {profile?.role === 'admin' ? 'Executive Administrator' : 'Premium Client'} • Berrionaire Portal
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-4 rounded-2xl glass hover:bg-white/10 transition-all relative group ${showNotifications ? 'bg-white/10 ring-2 ring-brand-gold/50' : ''}`}
              >
                <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-red rounded-full text-[10px] flex items-center justify-center font-black shadow-lg border-2 border-brand-black">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Panel */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-80 glass-dark rounded-[2rem] shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                      <h3 className="font-bold">Notifications</h3>
                      <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-white/5 rounded-full">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors group relative ${!notif.isRead ? 'bg-brand-purple/10' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="text-sm font-bold pr-6">{notif.title}</h4>
                              <button 
                                onClick={() => deleteNotification(notif.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-opacity"
                              >
                                <X className="w-3 h-3 text-red-500" />
                              </button>
                            </div>
                            <p className="text-xs text-white/50 mb-2">{notif.message}</p>
                            {!notif.isRead && (
                              <button 
                                onClick={() => markAsRead(notif.id)}
                                className="text-[10px] font-bold text-brand-gold hover:underline"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-12 text-center">
                          <Bell className="w-8 h-8 text-white/10 mx-auto mb-4" />
                          <p className="text-sm text-white/30 italic">No notifications yet</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to="/settings" className="p-4 rounded-2xl glass hover:bg-white/10 transition-all group">
              <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
            </Link>
          </div>
        </motion.div>

        {profile?.role === 'admin' ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -8 }}
                className="bento-card border-brand-purple/20 bg-gradient-to-br from-brand-purple/10 via-transparent to-transparent group hover:border-brand-purple/40 transition-all duration-500"
              >
                <div className="flex items-center gap-5 mb-10">
                  <div className="p-5 rounded-2xl bg-brand-purple/20 group-hover:bg-brand-purple/30 group-hover:scale-110 transition-all duration-500 shadow-xl">
                    <Users className="w-7 h-7 text-brand-gold" />
                  </div>
                  <h3 className="font-black text-white/30 text-[11px] uppercase tracking-[0.3em]">Total Users</h3>
                </div>
                <div className="flex items-baseline gap-3">
                  <p className="text-7xl font-black tracking-tighter text-white group-hover:text-brand-gold transition-colors duration-500">{allUsers.length}</p>
                  <TrendingUp className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -8 }}
                className="bento-card border-brand-red/20 bg-gradient-to-br from-brand-red/10 via-transparent to-transparent group hover:border-brand-red/40 transition-all duration-500"
              >
                <div className="flex items-center gap-5 mb-10">
                  <div className="p-5 rounded-2xl bg-brand-red/20 group-hover:bg-brand-red/30 group-hover:scale-110 transition-all duration-500 shadow-xl">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-black text-white/30 text-[11px] uppercase tracking-[0.3em]">Total Meetings</h3>
                </div>
                <p className="text-7xl font-black tracking-tighter text-white group-hover:text-brand-red transition-colors duration-500">{allMeetings.length}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -8 }}
                className="bento-card border-brand-gold/20 bg-gradient-to-br from-brand-gold/10 via-transparent to-transparent group hover:border-brand-gold/40 transition-all duration-500"
              >
                <div className="flex items-center gap-5 mb-10">
                  <div className="p-5 rounded-2xl bg-brand-gold/20 group-hover:bg-brand-gold/30 group-hover:scale-110 transition-all duration-500 shadow-xl">
                    <Clock className="w-7 h-7 text-brand-black" />
                  </div>
                  <h3 className="font-black text-white/30 text-[11px] uppercase tracking-[0.3em]">Pending</h3>
                </div>
                <p className="text-7xl font-black tracking-tighter text-white group-hover:text-brand-gold transition-colors duration-500">{allMeetings.filter(m => m.status === 'pending').length}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -8 }}
                className="bento-card border-white/10 group hover:border-white/20 transition-all duration-500"
              >
                <div className="flex items-center gap-5 mb-10">
                  <div className="p-5 rounded-2xl bg-white/5 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500 shadow-xl">
                    <Mail className="w-7 h-7 text-white/50" />
                  </div>
                  <h3 className="font-black text-white/30 text-[11px] uppercase tracking-[0.3em]">Messages</h3>
                </div>
                <p className="text-7xl font-black tracking-tighter text-white group-hover:text-white/80 transition-colors duration-500">{contactMessages.length}</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Admin Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Pending Meetings Management */}
                <div className="bento-card !p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[100px] -mr-32 -mt-32" />
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-8 relative z-10">
                    <h3 className="text-4xl font-black tracking-tighter flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center shadow-inner">
                        <BarChart3 className="w-7 h-7 text-brand-gold" />
                      </div>
                      Pending Requests
                    </h3>
                    <button 
                      onClick={() => setShowBroadcastModal(true)}
                      className="flex items-center gap-4 px-10 py-5 rounded-2xl bg-brand-purple text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-brand-purple/80 transition-all shadow-2xl hover:scale-105 active:scale-95 group"
                    >
                      <Megaphone className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Broadcast
                    </button>
                  </div>
                  <div className="space-y-10 relative z-10">
                    {allMeetings.filter(m => m.status === 'pending').length > 0 ? (
                      allMeetings.filter(m => m.status === 'pending').map(meeting => (
                        <motion.div 
                          key={meeting.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 flex flex-col xl:flex-row xl:items-center justify-between gap-10 hover:bg-white/[0.06] hover:border-brand-gold/20 transition-all duration-500 group"
                        >
                          <div className="flex items-center gap-10">
                            <div className="w-24 h-24 rounded-[2rem] glass p-1.5 group-hover:scale-110 transition-transform duration-700 shadow-2xl">
                              <img 
                                src={`https://picsum.photos/seed/${meeting.requesterUid}/100/100`} 
                                alt={meeting.requesterName} 
                                className="w-full h-full object-cover rounded-[1.75rem]"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <p className="font-black text-2xl tracking-tight mb-2 group-hover:text-brand-gold transition-colors">{meeting.requesterName || 'Anonymous'}</p>
                              <div className="flex flex-wrap items-center gap-4 mb-4">
                                <span className="text-[11px] font-black text-brand-gold uppercase tracking-[0.3em] px-4 py-1.5 bg-brand-gold/10 rounded-full border border-brand-gold/20">{meeting.department}</span>
                                <span className="text-[11px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                                  <Clock className="w-3 h-3" /> {meeting.date} • {meeting.time}
                                </span>
                              </div>
                              <p className="text-lg text-white/60 italic font-medium leading-relaxed max-w-xl">"{meeting.purpose}"</p>
                            </div>
                          </div>
                          <div className="flex gap-5">
                            <button 
                              onClick={() => updateMeetingStatus(meeting.id, 'confirmed')}
                              className="w-20 h-20 rounded-3xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-500 shadow-xl flex items-center justify-center group/btn"
                              title="Approve"
                            >
                              <Check className="w-8 h-8 group-hover/btn:scale-125 transition-transform duration-500" />
                            </button>
                            <button 
                              onClick={() => updateMeetingStatus(meeting.id, 'cancelled')}
                              className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500 shadow-xl flex items-center justify-center group/btn"
                              title="Reject"
                            >
                              <X className="w-8 h-8 group-hover/btn:scale-125 transition-transform duration-500" />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="py-40 text-center">
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8 shadow-inner">
                          <CheckCircle className="w-12 h-12 text-white/10" />
                        </div>
                        <p className="text-white/20 italic font-medium text-xl">No pending requests in the queue</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Management Table */}
                <div className="bento-card !p-12 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-purple/5 blur-[100px] -ml-32 -mb-32" />
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-16 gap-10 relative z-10">
                    <h3 className="text-4xl font-black tracking-tighter flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center shadow-inner">
                        <Users className="w-7 h-7 text-brand-purple" />
                      </div>
                      User Management
                    </h3>
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="relative group">
                        <input 
                          type="text"
                          placeholder="Search users..."
                          value={userSearchTerm}
                          onChange={(e) => setUserSearchTerm(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 pl-16 text-[12px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-gold transition-all w-full md:w-80 shadow-inner"
                        />
                        <Users className="w-5 h-5 text-white/20 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within:text-brand-gold transition-colors" />
                      </div>
                      <select 
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as any)}
                        className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-[12px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-gold transition-all cursor-pointer hover:bg-white/10 shadow-inner"
                      >
                        <option value="all" className="bg-brand-black">All Roles</option>
                        <option value="admin" className="bg-brand-black">Admins</option>
                        <option value="client" className="bg-brand-black">Clients</option>
                      </select>
                      
                      <div className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 shadow-inner">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em]">From</span>
                          <input 
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-transparent text-[12px] font-black focus:outline-none text-white/70 cursor-pointer"
                          />
                        </div>
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em]">To</span>
                          <input 
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-transparent text-[12px] font-black focus:outline-none text-white/70 cursor-pointer"
                          />
                        </div>
                      </div>

                      {(userSearchTerm || roleFilter !== 'all' || startDate || endDate) && (
                        <button 
                          onClick={() => {
                            setUserSearchTerm('');
                            setRoleFilter('all');
                            setStartDate('');
                            setEndDate('');
                          }}
                          className="text-[11px] font-black text-brand-red uppercase tracking-[0.3em] hover:underline px-6"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="overflow-x-auto custom-scrollbar relative z-10">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="pb-10 text-[12px] font-black uppercase tracking-[0.4em] text-white/20">User Identity</th>
                          <th className="pb-10 text-[12px] font-black uppercase tracking-[0.4em] text-white/20">Contact</th>
                          <th className="pb-10 text-[12px] font-black uppercase tracking-[0.4em] text-white/20">Access Level</th>
                          <th className="pb-10 text-[12px] font-black uppercase tracking-[0.4em] text-white/20 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((u) => (
                            <tr key={u.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                              <td className="py-10 pr-10">
                                <div className="flex items-center gap-8">
                                  <div className="w-16 h-16 rounded-2xl glass p-1.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-700 shadow-xl">
                                    <img 
                                      src={u.photoURL || `https://picsum.photos/seed/${u.uid}/100/100`} 
                                      alt={u.displayName} 
                                      className="w-full h-full object-cover rounded-xl"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-black text-lg tracking-tight mb-1 group-hover:text-brand-gold transition-colors">{u.displayName || 'New User'}</span>
                                    <span className="text-[11px] text-white/20 font-mono tracking-[0.2em] uppercase">{u.uid.slice(0, 16)}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-10 pr-10">
                                <span className="text-base font-medium text-white/40">{u.email}</span>
                              </td>
                              <td className="py-10 pr-10">
                                <div className="flex items-center gap-5">
                                  <div className={`p-3 rounded-xl shadow-inner ${u.role === 'admin' ? 'bg-brand-gold/10 text-brand-gold' : 'bg-white/5 text-white/30'}`}>
                                    {u.role === 'admin' ? <Shield className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                                  </div>
                                  <span className={`text-[12px] font-black uppercase tracking-[0.3em] ${u.role === 'admin' ? 'text-brand-gold' : 'text-white/30'}`}>
                                    {u.role}
                                  </span>
                                </div>
                              </td>
                              <td className="py-10 text-right">
                                <select 
                                  value={u.role}
                                  onChange={(e) => setRoleChangeConfirm({ user: u, newRole: e.target.value })}
                                  className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-[12px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-gold transition-all cursor-pointer hover:bg-white/10 shadow-inner"
                                  disabled={u.uid === user?.uid}
                                >
                                  <option value="client" className="bg-brand-black text-white">Client</option>
                                  <option value="admin" className="bg-brand-black text-white">Admin</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-40 text-center text-white/20 italic text-xl font-medium">
                              No users found matching your criteria
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Sidebar Admin Column */}
              <div className="space-y-8">
                {/* Contact Messages (Moved to Sidebar) */}
                <div className="bento-card !p-12 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-brand-purple/5 blur-3xl -ml-16 -mt-16" />
                  <h3 className="text-3xl font-black mb-12 tracking-tighter flex items-center gap-5 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center shadow-inner">
                      <Mail className="w-6 h-6 text-brand-purple" />
                    </div>
                    Messages
                  </h3>
                  <div className="space-y-8 relative z-10">
                    {contactMessages.map(msg => (
                      <motion.div 
                        key={msg.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-brand-purple/40 hover:bg-white/[0.06] transition-all duration-500 group relative shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-brand-purple/20 text-brand-purple rounded-full border border-brand-purple/20">
                            {msg.subject}
                          </span>
                          <button 
                            onClick={() => deleteContactMessage(msg.id)}
                            className="opacity-0 group-hover:opacity-100 p-3 hover:bg-red-500/20 rounded-2xl transition-all duration-300"
                          >
                            <X className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                        <h4 className="font-black text-xl mb-3 tracking-tight group-hover:text-brand-gold transition-colors">{msg.name}</h4>
                        <p className="text-base text-white/40 leading-relaxed italic font-medium">"{msg.message}"</p>
                      </motion.div>
                    ))}
                    {contactMessages.length === 0 && (
                      <div className="py-24 text-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8 shadow-inner">
                          <Mail className="w-10 h-10 text-white/10" />
                        </div>
                        <p className="text-white/20 italic text-xl font-medium">No messages yet</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bento-card !p-12 bg-gradient-to-br from-brand-purple/20 to-transparent border-brand-purple/30">
                  <h3 className="text-2xl font-black mb-8 tracking-tighter">Executive Insights</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <p className="text-sm text-white/60 font-medium">
                        User growth is up <span className="text-green-400 font-black">12%</span> this week.
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-brand-gold" />
                      <p className="text-sm text-white/60 font-medium">
                        Most meeting requests are targeting the <span className="text-brand-gold font-black">Strategy</span> department.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Quick Actions & Stats */}
          <div className="lg:col-span-2 space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <Link to="/portfolio" className="bento-card !p-12 group overflow-hidden relative border-brand-gold/20 flex flex-col justify-between min-h-[280px] hover:border-brand-gold/40 transition-all duration-700 shadow-2xl">
                <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000">
                  <TrendingUp className="w-72 h-72" />
                </div>
                <div className="w-20 h-20 rounded-3xl bg-brand-gold/10 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-brand-gold/20 transition-all duration-500 shadow-xl">
                  <TrendingUp className="w-10 h-10 text-brand-gold" />
                </div>
                <div>
                  <h3 className="text-4xl font-black mb-3 tracking-tighter group-hover:text-brand-gold transition-colors">Portfolio</h3>
                  <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em]">Global asset tracking.</p>
                </div>
              </Link>
              <Link to="/intelligence" className="bento-card !p-12 group overflow-hidden relative border-brand-purple/20 bg-gradient-to-br from-brand-purple/10 to-transparent flex flex-col justify-between min-h-[280px] hover:border-brand-purple/40 transition-all duration-700 shadow-2xl">
                <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000">
                  <Brain className="w-72 h-72" />
                </div>
                <div className="w-20 h-20 rounded-3xl bg-brand-purple/10 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-brand-purple/20 transition-all duration-500 shadow-xl">
                  <Brain className="w-10 h-10 text-brand-purple" />
                </div>
                <div>
                  <h3 className="text-4xl font-black mb-3 tracking-tighter group-hover:text-brand-purple transition-colors">Intelligence</h3>
                  <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em]">Strategic foresight engine.</p>
                </div>
              </Link>
              <Link to="/schedule" className="bento-card !p-12 group overflow-hidden relative border-brand-red/20 flex flex-col justify-between min-h-[280px] hover:border-brand-red/40 transition-all duration-700 shadow-2xl">
                <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000">
                  <Calendar className="w-72 h-72" />
                </div>
                <div className="w-20 h-20 rounded-3xl bg-brand-red/10 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-brand-red/20 transition-all duration-500 shadow-xl">
                  <Calendar className="w-10 h-10 text-brand-red" />
                </div>
                <div>
                  <h3 className="text-4xl font-black mb-3 tracking-tighter group-hover:text-brand-red transition-colors">Consult</h3>
                  <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em]">Leadership meetings.</p>
                </div>
              </Link>
              <Link to="/team" className="bento-card !p-12 group overflow-hidden relative flex flex-col justify-between min-h-[280px] hover:border-white/20 transition-all duration-700 shadow-2xl">
                <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000">
                  <Users className="w-72 h-72" />
                </div>
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 shadow-xl">
                  <Users className="w-10 h-10 text-white/30" />
                </div>
                <div>
                  <h3 className="text-4xl font-black mb-3 tracking-tighter group-hover:text-white transition-colors">Synergy</h3>
                  <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em]">Organization lineup.</p>
                </div>
              </Link>
            </div>

            <div className="bento-card !p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[100px] -mr-32 -mt-32" />
              <h3 className="text-4xl font-black mb-16 tracking-tighter flex items-center gap-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center shadow-inner">
                  <Clock className="w-7 h-7 text-brand-gold" />
                </div>
                Recent Activity
              </h3>
              <div className="space-y-10 relative z-10">
                {loading ? (
                  <div className="py-40 text-center text-white/20 italic font-medium text-xl">Loading secure activity logs...</div>
                ) : meetings.length > 0 ? (
                  meetings.map(meeting => (
                    <motion.div 
                      key={meeting.id} 
                      whileHover={{ x: 10 }}
                      className="flex items-center justify-between p-10 rounded-[3rem] hover:bg-white/[0.05] transition-all duration-500 cursor-pointer group border border-transparent hover:border-white/5 shadow-lg"
                    >
                      <div className="flex items-center gap-10">
                        <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center group-hover:bg-brand-gold/10 transition-all duration-500 shadow-xl">
                          <Calendar className="w-8 h-8 text-white/20 group-hover:text-brand-gold transition-all duration-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-black tracking-tight mb-2 group-hover:text-brand-gold transition-colors">Meeting request for {meeting.department}</p>
                          <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Clock className="w-3 h-3" /> {meeting.date} at {meeting.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                        <span className={`text-[11px] font-black uppercase tracking-[0.3em] px-6 py-2.5 rounded-full border ${
                          meeting.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                          meeting.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-white/10 text-white/30 border-white/10'
                        }`}>
                          {meeting.status}
                        </span>
                        <ChevronRight className="w-8 h-8 text-white/10 group-hover:text-brand-gold group-hover:translate-x-2 transition-all duration-500" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-40 text-center">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <Clock className="w-12 h-12 text-white/10" />
                    </div>
                    <p className="text-white/20 text-xl italic font-medium">No recent activity found in your records</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Upcoming Schedule */}
          <div className="space-y-8">
            <div className="bento-card !p-12">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-3xl font-black tracking-tighter">Upcoming</h3>
                <Link to="/schedule" className="text-[11px] font-black text-brand-gold uppercase tracking-[0.2em] hover:underline">See All</Link>
              </div>
              <div className="space-y-8">
                {meetings.filter(m => m.status === 'confirmed').slice(0, 3).map(meeting => (
                  <motion.div
                    key={meeting.id}
                    whileHover={{ x: 12 }}
                    className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-brand-gold/40 transition-all duration-500 group"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-brand-purple/30 text-brand-gold rounded-full group-hover:bg-brand-purple/50 transition-colors">
                        {meeting.department}
                      </span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <h4 className="font-black mb-3 text-xl tracking-tight truncate group-hover:text-white transition-colors">{meeting.purpose}</h4>
                    <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em]">{meeting.date} • {meeting.time}</p>
                  </motion.div>
                ))}
                {meetings.filter(m => m.status === 'confirmed').length === 0 && (
                  <div className="text-center py-32">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                      <Calendar className="w-10 h-10 text-white/10" />
                    </div>
                    <p className="text-white/20 text-lg italic font-medium">No confirmed meetings scheduled</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bento-card !p-12 bg-gradient-to-br from-brand-red/20 to-transparent border-brand-red/30">
              <h3 className="text-2xl font-black mb-8 tracking-tighter">Executive Protocol</h3>
              <p className="text-base text-white/50 leading-relaxed font-medium italic">
                "Regularly sync with your department managers to foster a culture of knowledge sharing and synergy."
              </p>
            </div>
          </div>
        </div>
        )}

        {/* Broadcast Modal */}
        <AnimatePresence>
          {showBroadcastModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowBroadcastModal(false)}
                className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg glass-dark p-8 rounded-[2.5rem] shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-brand-purple/20">
                      <Megaphone className="w-6 h-6 text-brand-gold" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Broadcast Announcement</h3>
                      <p className="text-xs text-white/50">Send a notification to all users</p>
                    </div>
                  </div>
                  <button onClick={() => setShowBroadcastModal(false)} className="p-2 hover:bg-white/5 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleBroadcast} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Announcement Title</label>
                    <input 
                      type="text"
                      required
                      value={broadcastData.title}
                      onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
                      placeholder="e.g., System Maintenance"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Message Content</label>
                    <textarea 
                      required
                      rows={4}
                      value={broadcastData.message}
                      onChange={(e) => setBroadcastData({ ...broadcastData, message: e.target.value })}
                      placeholder="Type your announcement here..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isBroadcasting}
                    className="w-full py-4 rounded-xl bg-brand-purple text-white font-bold hover:bg-brand-purple/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isBroadcasting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {isBroadcasting ? 'Broadcasting...' : 'Send Broadcast'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Role Change Confirmation Modal */}
        <AnimatePresence>
          {roleChangeConfirm && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setRoleChangeConfirm(null)}
                className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md glass-dark p-8 rounded-[2.5rem] shadow-2xl text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-brand-gold/20 flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10 text-brand-gold" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Confirm Role Change</h3>
                <p className="text-white/60 mb-8 leading-relaxed">
                  Are you sure you want to change <span className="text-white font-bold">{roleChangeConfirm.user.displayName || 'this user'}</span>'s 
                  role to <span className="text-brand-gold font-bold uppercase tracking-widest">{roleChangeConfirm.newRole}</span>?
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setRoleChangeConfirm(null)}
                    className="flex-1 py-4 rounded-xl glass hover:bg-white/10 transition-all font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => updateUserRole(roleChangeConfirm.user.id, roleChangeConfirm.newRole)}
                    className="flex-1 py-4 rounded-xl bg-brand-gold text-brand-black font-bold hover:bg-brand-gold/80 transition-all"
                  >
                    Confirm Change
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
