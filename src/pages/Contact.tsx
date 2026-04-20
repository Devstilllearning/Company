import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../components/FirebaseProvider';

export default function Contact() {
  const { user, profile } = useAuth();
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.displayName || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        uid: user?.uid || null,
        createdAt: serverTimestamp(),
      });

      if (user) {
        await addDoc(collection(db, 'notifications'), {
          recipientUid: user.uid,
          title: 'Message Sent',
          message: `Your message regarding "${formData.subject}" has been sent successfully.`,
          isRead: false,
          type: 'contact_message',
          createdAt: serverTimestamp(),
        });
      }

      setIsSent(true);
      setFormData({ ...formData, subject: '', message: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'contacts');
    } finally {
      setIsSending(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      className="py-12 px-4 max-w-7xl mx-auto min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-32"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border-white/10 text-brand-strawberry text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-lg">
            Global Connectivity
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-10 tracking-tighter leading-[0.85] text-brand-deep font-display">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto leading-relaxed font-medium">
            Have a question or want to collaborate? We're here to listen and synergize. 
            Our global team is ready to provide strategic guidance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div className="space-y-12">
            <motion.div 
              variants={itemVariants}
              className="bento-card !p-14 space-y-16 relative overflow-hidden group bg-white/5 border-white/10 shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-deep/5 blur-[100px] -mr-32 -mt-32 rounded-full group-hover:bg-brand-deep/10 transition-all duration-1000" />
              <h2 className="text-4xl font-black tracking-tighter mb-12 group-hover:text-brand-strawberry transition-colors duration-300 text-white font-display">Contact Information</h2>
              
              <div className="flex items-start gap-10 group/item">
                <div className="w-20 h-20 rounded-3xl bg-brand-deep/10 border border-brand-deep/20 flex items-center justify-center shrink-0 group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-500 shadow-xl shadow-brand-deep/5">
                  <Mail className="w-10 h-10 text-brand-strawberry" />
                </div>
                <div>
                  <h3 className="font-black text-2xl mb-2 tracking-tight text-white font-display">Email Us</h3>
                  <p className="text-white/40 font-medium text-lg hover:text-brand-strawberry transition-colors duration-300 cursor-pointer">info@berrionare.com</p>
                  <p className="text-white/40 font-medium text-lg hover:text-brand-strawberry transition-colors duration-300 cursor-pointer">support@berrionare.com</p>
                </div>
              </div>

              <div className="flex items-start gap-10 group/item">
                <div className="w-20 h-20 rounded-3xl bg-brand-deep/10 border border-brand-deep/20 flex items-center justify-center shrink-0 group-hover/item:scale-110 group-hover/item:-rotate-6 transition-all duration-500 shadow-xl shadow-brand-deep/5">
                  <Phone className="w-10 h-10 text-brand-strawberry" />
                </div>
                <div>
                  <h3 className="font-black text-2xl mb-2 tracking-tight text-white font-display">Call Us</h3>
                  <p className="text-white/40 font-medium text-lg">+1 (555) 123-4567</p>
                  <p className="text-white/40 font-medium text-lg">Mon - Fri, 9am - 5pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-10 group/item">
                <div className="w-20 h-20 rounded-3xl bg-brand-deep/10 border border-brand-deep/20 flex items-center justify-center shrink-0 group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-500 shadow-xl shadow-brand-deep/5">
                  <MapPin className="w-10 h-10 text-brand-strawberry" />
                </div>
                <div>
                  <h3 className="font-black text-2xl mb-2 tracking-tight text-white font-display">Visit Us</h3>
                  <p className="text-white/40 font-medium text-lg">123 Innovation Drive</p>
                  <p className="text-white/40 font-medium text-lg">Tech City, TC 94103</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bento-card !p-14 relative overflow-hidden group bg-white/5 border-white/10"
            >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-deep/5 blur-[100px] -ml-32 -mb-32 rounded-full group-hover:bg-brand-deep/10 transition-all duration-1000" />
              <h3 className="text-xs font-black mb-10 tracking-[0.4em] uppercase text-white/20">Follow Our Journey</h3>
              <div className="flex flex-wrap gap-6 relative z-10">
                {['LinkedIn', 'Twitter', 'Instagram', 'YouTube'].map(social => (
                  <button key={social} className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-brand-strawberry hover:text-white transition-all duration-500 text-xs font-black uppercase tracking-[0.2em] border border-white/10 shadow-xl hover:-translate-y-2 text-white">
                    {social}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div 
            variants={itemVariants}
            className="bento-card !p-16 md:!p-20 relative overflow-hidden group bg-white/5 border-white/10 shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-96 h-96 bg-brand-deep/5 blur-[120px] -ml-48 -mt-48 rounded-full group-hover:bg-brand-deep/10 transition-all duration-1000" />
            {isSent ? (
               <div className="h-full flex flex-col items-center justify-center text-center space-y-12 relative z-10">
                <div className="w-32 h-32 bg-brand-deep/10 border border-brand-deep/20 rounded-[3rem] flex items-center justify-center animate-pulse shadow-2xl shadow-brand-deep/10">
                  <Send className="w-16 h-16 text-brand-strawberry" />
                </div>
                <div className="space-y-6">
                  <h2 className="text-5xl font-black tracking-tighter text-white font-display">Message Sent!</h2>
                  <p className="text-white/40 font-medium leading-relaxed max-w-md text-lg">
                    Thank you for reaching out. Our team will get back to you within 24 hours 
                    to discuss your strategic inquiry.
                  </p>
                </div>
                <button
                  onClick={() => setIsSent(false)}
                  className="px-12 py-6 rounded-2xl bg-brand-strawberry text-white font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-brand-strawberry/20 hover:scale-110 active:scale-95 transition-all duration-500"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-2">Your Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand-deep focus:bg-white/10 transition-all duration-500 font-medium text-white placeholder:text-white/10 text-lg shadow-inner"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-2">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand-deep focus:bg-white/10 transition-all duration-500 font-medium text-white placeholder:text-white/10 text-lg shadow-inner"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-2">Subject</label>
                  <input
                    required
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand-deep focus:bg-white/10 transition-all duration-500 font-medium text-white placeholder:text-white/10 text-lg shadow-inner"
                    placeholder="How can we help you today?"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-2 flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-brand-strawberry" /> Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 focus:outline-none focus:border-brand-deep focus:bg-white/10 transition-all duration-500 font-medium text-white placeholder:text-white/10 resize-none text-lg shadow-inner"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-6 rounded-2xl bg-brand-deep text-white font-black uppercase tracking-[0.3em] text-xs hover:opacity-90 transition-all duration-700 flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl shadow-brand-deep/20 group/btn"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Send Message <Send className="w-6 h-6 group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

