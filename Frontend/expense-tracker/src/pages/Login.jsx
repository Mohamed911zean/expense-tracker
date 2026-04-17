import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back to Verdant');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Panel — Editorial Hero */}
      <div 
        className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-malachite-800 to-malachite-950"
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex flex-col justify-between p-12 lg:p-16 w-full">
          {/* Top badge */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/20 bg-white/10 flex items-center justify-center text-white font-bold text-xl">
                V
              </div>
              <span className="text-white/80 text-sm font-medium">Verdant Protocol</span>
            </div>
          </div>

          {/* Main headline */}
          <div className="max-w-lg">
            <h1 className="text-white text-4xl lg:text-5xl font-bold text-tracking-tight leading-tight mb-6">
              Financial Curating for the Discerning.
            </h1>
            <p className="text-white/90 text-base leading-relaxed">
              Experience a new standard of personal wealth management where every transaction
              is treated as a piece of your broader financial architecture.
            </p>
          </div>

          {/* Bottom badges */}
          <div className="flex items-center gap-4 mt-8">
            <div className="px-4 py-2 rounded-full bg-white/10 text-white text-xs font-medium">
              Carbon Neutral Finance
            </div>
            <div className="px-4 py-2 rounded-full bg-white/10 text-white text-xs font-medium">
              Certified Verdant Protocol
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 lg:max-w-xl flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-outline-variant/20 flex items-center justify-center bg-gradient-to-br from-primary to-primary-container text-white font-bold text-xl">
            V
          </div>
          <div>
            <h1 className="text-on-surface font-bold text-lg">Verdant</h1>
            <p className="text-on-surface-variant text-xs">The Curator</p>
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto lg:mx-0">
          <h2 className="text-on-surface text-2xl font-bold text-tracking-tight mb-2">
            Welcome Back
          </h2>
          <p className="text-on-surface-variant text-sm mb-8">
            Enter your credentials to access your vault.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-on-surface text-sm font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="curator@verdant.com"
                className="w-full px-4 py-3.5 rounded-xl bg-surface-container-lowest text-on-surface text-sm placeholder:text-outline border border-outline-variant/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-on-surface text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3.5 rounded-xl bg-surface-container-lowest text-on-surface text-sm placeholder:text-outline border border-outline-variant/20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth"
              />
            </div>

            <div className="flex items-center justify-end">
              <button type="button" className="text-primary text-xs font-semibold hover:underline cursor-pointer">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl gradient-primary text-on-primary font-semibold text-sm transition-smooth hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-on-surface-variant text-sm">
            New to the collection?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Request Access
            </Link>
          </p>
        </div>

        {/* Bottom footer */}
        <div className="mt-auto pt-12">
          <p className="text-on-surface-variant text-xs text-center lg:text-left">
            Editorial Fintech Series Vol. I
          </p>
        </div>
      </div>
    </div>
  );
}
