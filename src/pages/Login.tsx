import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowRight, Chrome, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, signInWithGoogle } from '../firebase';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-brand-soft">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-strawberry/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-strawberry/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 md:p-12 rounded-[3.5rem] relative z-10 shadow-2xl border border-brand-strawberry/10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-strawberry/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-strawberry/5">
            <LogIn className="w-8 h-8 text-brand-strawberry" />
          </div>
          <h1 className="text-3xl font-black mb-2 tracking-tight text-brand-deep">Welcome Back</h1>
          <p className="text-brand-dark/50 font-medium">Access your Berrionaire dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-brand-soft border border-brand-strawberry/10 hover:bg-brand-strawberry/10 transition-all duration-300 flex items-center justify-center gap-3 font-black text-brand-deep disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Chrome className="w-5 h-5 text-brand-strawberry" />}
            <span className="uppercase text-xs tracking-widest">Sign in with Google</span>
          </button>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-brand-strawberry/10"></div>
            <span className="flex-shrink mx-4 text-[10px] font-black text-brand-dark/20 uppercase tracking-[0.2em]">Or email</span>
            <div className="flex-grow border-t border-brand-strawberry/10"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-strawberry/60 flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Password
                </label>
                <button type="button" className="text-[10px] font-black text-brand-strawberry uppercase tracking-widest hover:underline">Forgot?</button>
              </div>
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
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-6 h-6 translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-brand-dark/40 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-strawberry font-black uppercase text-xs tracking-widest hover:underline ml-1">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
