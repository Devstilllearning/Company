import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowRight, Chrome } from 'lucide-react';
import { signInWithGoogle } from '../firebase';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, we'll just navigate to home
    // In a real app, you'd use signInWithEmailAndPassword
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-red/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-purple/20 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-10 md:p-12 rounded-[3rem] relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-brand-gold" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-white/50">Access your Berrionaire dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 rounded-xl glass hover:bg-white/10 transition-colors flex items-center justify-center gap-3 font-bold"
          >
            <Chrome className="w-5 h-5 text-brand-gold" />
            <span>Sign in with Google</span>
          </button>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-xs font-bold text-white/30 uppercase tracking-widest">Or email</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
                <Mail className="w-3 h-3" /> Email Address
              </label>
              <input
                required
                type="email"
                placeholder="name@company.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Password
                </label>
                <button type="button" className="text-[10px] font-bold text-brand-gold hover:underline">Forgot?</button>
              </div>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-brand-purple text-white font-bold text-lg hover:bg-brand-purple/80 transition-colors flex items-center justify-center gap-2"
            >
              Sign In <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-white/50">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-gold font-bold hover:underline">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
