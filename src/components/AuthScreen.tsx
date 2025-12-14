import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button, AvatarSelector } from './GameComponents';
import { avatars } from '../data/gameData';

export const AuthScreen: React.FC = () => {
  const { signIn, signUp, isOnline } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🦁');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        }
      } else {
        if (!name.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, name.trim(), avatar);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Account created! Please check your email to verify.');
          setIsLogin(true);
        }
      }
    } catch {
      setError('An unexpected error occurred');
    }

    setLoading(false);
  };

  if (!isOnline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full glass text-center">
          <div className="text-7xl mb-4">🔌</div>
          <h1 className="text-2xl font-bold text-white mb-4">Offline Mode</h1>
          <p className="text-white/80 mb-6">
            Database connection not configured. The app will work in offline mode with local storage.
          </p>
          <p className="text-white/60 text-sm">
            To enable cloud sync, add your Supabase credentials to .env.local
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full glass">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4 animate-bounce-slow">🎮</div>
          <h1 className="text-3xl font-bold text-white text-shadow mb-2">
            {isLogin ? 'Welcome Back!' : 'Join the Fun!'}
          </h1>
          <p className="text-white/80">
            {isLogin ? 'Sign in to continue your adventure' : 'Create an account to start learning'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-white/80 mb-2 text-sm font-medium">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60 text-lg"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2 text-sm font-medium">
                  Pick Your Avatar
                </label>
                <AvatarSelector
                  avatars={avatars}
                  selected={avatar}
                  onSelect={setAvatar}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-white/80 mb-2 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
              required
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
              minLength={6}
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-3 text-green-200 text-sm">
              ✓ {success}
            </div>
          )}

          <Button
            variant="success"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? '⏳ Please wait...' : (isLogin ? 'Sign In 🚀' : 'Create Account ✨')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
            className="text-white/70 hover:text-white underline text-sm"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
