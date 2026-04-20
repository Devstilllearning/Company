import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, LayoutDashboard, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from './FirebaseProvider';
import { logout } from '../firebase';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Team', path: '/team' },
  { name: 'Intelligence', path: '/intelligence' },
  { name: 'Schedule Meeting', path: '/schedule' },
  { name: 'Contact', path: '/contact' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = 'BERRIONARE';
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-deep/30 selection:text-brand-deep">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/5 backdrop-blur-2xl">
        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 h-[1px] bg-brand-deep transition-all duration-300" style={{ width: `${scrollProgress}%` }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-deep to-brand-strawberry flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-brand-deep/20">
                <span className="text-white font-black text-xs">B</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-gradient group-hover:tracking-normal transition-all duration-500">BERRIONARE</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-brand-strawberry relative group",
                    location.pathname === link.path ? "text-brand-strawberry" : "text-white/40"
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-[1px] bg-brand-strawberry transition-all duration-300",
                    location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              ))}
              {user ? (
                <div className="flex items-center space-x-6 pl-6 border-l border-white/10">
                  <Link to="/dashboard" className="p-2.5 hover:bg-brand-deep/10 rounded-2xl transition-all duration-300 group">
                    <LayoutDashboard className="w-5 h-5 text-brand-deep group-hover:scale-110 transition-transform" />
                  </Link>
                  <Link to="/settings" className="p-2.5 hover:bg-white/5 rounded-2xl transition-all duration-300 group">
                    <SettingsIcon className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                  </Link>
                  <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/10 p-0.5 glass group cursor-pointer shadow-xl">
                    <img 
                      src={profile?.photoURL || 'https://picsum.photos/seed/user/100/100'} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-[0.6rem]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <button onClick={handleLogout} className="p-2.5 hover:bg-red-500/10 rounded-2xl transition-all duration-300 group">
                    <LogOut className="w-5 h-5 text-red-400/50 group-hover:text-red-400 transition-colors" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-brand-deep transition-all duration-500 border border-white/10 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-deep/10"
                >
                  <LogIn className="w-4 h-4 text-brand-strawberry" />
                  <span>Access Portal</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-dark border-t border-white/5 overflow-hidden"
            >
              <div className="px-4 pt-4 pb-8 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
                      location.pathname === link.path ? "bg-brand-deep text-white shadow-lg shadow-brand-deep/20" : "text-white/60 hover:bg-white/5"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                {user ? (
                  <div className="space-y-2 pt-4 border-t border-white/5 mt-4">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-brand-deep hover:bg-brand-deep/10"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-white/60 hover:bg-white/5"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-red-400 hover:bg-red-400/10"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-brand-strawberry bg-brand-strawberry/10 mt-4"
                  >
                    Login / Register
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.22, 1, 0.36, 1] 
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark border-t border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="col-span-1 md:col-span-2">
              <span className="text-3xl font-black tracking-tighter text-gradient">BERRIONARE</span>
              <p className="mt-6 text-white/40 max-w-sm leading-relaxed font-medium">
                Combining the power of diversity with unique innovation to produce quality work. 
                Leading the future of corporate excellence with strategic foresight.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-deep mb-8">Quick Links</h3>
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm text-white/40 hover:text-brand-strawberry transition-colors font-bold">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-deep mb-8">Contact</h3>
              <p className="text-sm text-white/40 font-bold">info@berrionaire.com</p>
              <p className="text-sm text-white/40 mt-2 font-bold">+1 (555) 123-4567</p>
              <div className="flex space-x-6 mt-10">
                {[
                  { name: 'In', color: 'brand-deep' },
                  { name: 'Tw', color: 'brand-strawberry' },
                  { name: 'Ig', color: 'brand-deep' }
                ].map((social, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border border-white/10 hover:-translate-y-1 hover:scale-110",
                      social.color === 'brand-deep' ? "hover:bg-brand-deep hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]" : "hover:bg-brand-strawberry hover:shadow-[0_0_20px_rgba(251,113,133,0.4)]"
                    )}
                  >
                    <span className="text-[10px] font-black text-white">{social.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
            &copy; {new Date().getFullYear()} BERRIONARE. All rights reserved. Strategic Intelligence Ecosystem.
          </div>
        </div>
      </footer>
    </div>
  );
}
