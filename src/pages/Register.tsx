import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Update user profile with display name
      await updateProfile(user, {
        displayName: formData.name,
      });

      // 3. Create user profile in Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        displayName: formData.name,
        email: formData.email,
        photoURL: user.photoURL || `https://picsum.photos/seed/${user.uid}/200/200`,
        role: 'client',
        createdAt: serverTimestamp(),
      });

      // 4. Create welcome notification
      await setDoc(doc(db, 'notifications', `${user.uid}_welcome`), {
        recipientUid: user.uid,
        title: 'Welcome to BERRIONARE!',
        message: `Hello ${formData.name}, we're excited to have you on board. Explore your dashboard to get started.`,
        isRead: false,
        type: 'welcome',
        createdAt: serverTimestamp(),
      });

      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-brand-soft">
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-brand-strawberry/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-brand-strawberry/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 md:p-12 rounded-[3.5rem] relative z-10 shadow-2xl border border-brand-strawberry/10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-strawberry/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-strawberry/5">
            <UserPlus className="w-8 h-8 text-brand-strawberry" />
          </div>
          <h1 className="text-3xl font-black mb-2 tracking-tight text-brand-deep">Join BERRIONARE</h1>
          <p className="text-brand-dark/50 font-medium">Start your journey with our innovative team</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-strawberry/60 flex items-center gap-2 ml-1">
              <User className="w-3 h-3" /> Full Name
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className="w-full bg-brand-soft border border-brand-strawberry/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-strawberry focus:bg-white transition-all duration-300 font-medium text-brand-dark shadow-inner text-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-strawberry/60 flex items-center gap-2 ml-1">
              <Mail className="w-3 h-3" /> Email Address
            </label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@company.com"
              className="w-full bg-brand-soft border border-brand-strawberry/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-strawberry focus:bg-white transition-all duration-300 font-medium text-brand-dark shadow-inner text-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-strawberry/60 flex items-center gap-2 ml-1">
              <Lock className="w-3 h-3" /> Password
            </label>
            <input
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-brand-soft border border-brand-strawberry/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-strawberry focus:bg-white transition-all duration-300 font-medium text-brand-dark shadow-inner text-lg"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 rounded-2xl bg-brand-strawberry text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-brand-strawberry/30 hover:opacity-90 transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account <ArrowRight className="w-6 h-6 translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-brand-dark/40 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-strawberry font-black uppercase text-xs tracking-widest hover:underline ml-1">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
