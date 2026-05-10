'use client';

import { useState } from 'react';
import { loginAction } from './actions';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await loginAction(email, password);
      
      if (result.error) throw new Error(result.error);
      
      router.push('/portal-manager-yadgari-782');
    } catch (err: any) {
      setError('ئیمەیڵ یان پاسوۆردەکە هەڵەیە!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-card border border-border p-10 rounded-[3rem] shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-brand-red/10 text-brand-red rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock size={40} />
          </div>
          <h1 className="text-3xl font-bold mb-2 font-kurdish">چوونەژوورەوەی بەڕێوەبەر</h1>
          <p className="text-foreground/50">تکایە زانیارییەکانت بنووسە بۆ چوونە ناو تەختەی کۆنتڕۆڵ</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 pr-2">ئیمەیڵ</label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-foreground/[0.03] border border-border px-12 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-all"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 pr-2">پاسوۆرد</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-foreground/[0.03] border border-border px-12 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-brand-red/10 text-brand-red p-4 rounded-xl text-sm font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-foreground text-background py-5 rounded-2xl font-bold text-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'چوونەژوورەوە'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
