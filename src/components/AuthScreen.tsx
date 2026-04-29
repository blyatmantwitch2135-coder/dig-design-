import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { LogIn, UserPlus } from 'lucide-react';

export function AuthScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[550px]">
      <div className="glass-panel p-10 max-w-sm w-full text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          {isLogin ? <LogIn className="w-8 h-8 text-indigo-600" /> : <UserPlus className="w-8 h-8 text-indigo-600" />}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-slate-500 mb-6 text-sm">
          {isLogin ? 'Please sign in to access your planner' : 'Sign up to start planning'}
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 w-full">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="glass-input w-full text-left"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 chars)"
            minLength={6}
            className="glass-input w-full text-left"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full glass-btn min-h-[48px] flex items-center justify-center mt-2 cursor-pointer"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          className="mt-6 text-sm text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
