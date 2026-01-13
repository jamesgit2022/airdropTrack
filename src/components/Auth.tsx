import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus, Mail, Lock, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Background } from './Background';

export const Auth: React.FC = () => {
  const { signInWithEmail, signUpWithEmail, loading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUpWithEmail(email, password);
        if (error) throw error;
        setMessage({ type: 'success', text: 'Check your email for the confirmation link!' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-[#00E272]" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      <Background />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#1A1B1E] rounded-3xl p-8 border border-gray-800 shadow-2xl relative z-10 mx-4"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-16 h-16 bg-[#00E272]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#00E272]/20"
          >
            <Sparkles className="w-8 h-8 text-[#00E272]" />
          </motion.div>
          <motion.h1 
            key={isLogin ? 'login-title' : 'signup-title'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-2"
          >
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </motion.h1>
          <motion.p 
            key={isLogin ? 'login-desc' : 'signup-desc'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400"
          >
            {isLogin ? 'Sign in to access your tasks' : 'Sign up to sync your tasks online'}
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {message && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className={`p-4 rounded-xl text-sm font-medium ${
                message.type === 'error' 
                  ? 'bg-red-900/20 text-red-400 border border-red-900/50' 
                  : 'bg-green-900/20 text-green-400 border border-green-900/50'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#00E272] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-1 focus:ring-[#00E272] focus:border-[#00E272] text-white placeholder-gray-600 transition-all outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#00E272] transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-1 focus:ring-[#00E272] focus:border-[#00E272] text-white placeholder-gray-600 transition-all outline-none"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#00E272] hover:bg-[#00c965] text-black font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-[#00E272]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Sign Up
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-400 hover:text-white font-medium transition-colors"
          >
            {isLogin ? (
              <>
                Don't have an account? <span className="text-[#00E272] underline decoration-2 decoration-transparent hover:decoration-current transition-all">Sign up</span>
              </>
            ) : (
              <>
                Already have an account? <span className="text-[#00E272] underline decoration-2 decoration-transparent hover:decoration-current transition-all">Sign in</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
