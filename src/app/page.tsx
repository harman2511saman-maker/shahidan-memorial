'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import MartyrCard from '@/components/MartyrCard';
import { motion } from 'framer-motion';
import { Filter, Users, Shield, Sword, Target, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ORGANIZATIONS = [
  { id: 'all', name: 'هەمووی', icon: Users, color: 'bg-gray-500' },
  { id: 'پێشمەرگە', name: 'پێشمەرگە', icon: Sword, color: 'bg-brand-green' },
  { id: 'ئاسایش', name: 'ئاسایش', icon: Shield, color: 'bg-brand-red' },
  { id: 'دژەتیرۆر', name: 'دژەتیرۆر', icon: Target, color: 'bg-dark-surface' },
  { id: 'زێرەڤانی', name: 'زێرەڤانی', icon: Shield, color: 'bg-brand-yellow' },
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [martyrs, setMartyrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMartyrs();
  }, []);

  const fetchMartyrs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('martyrs')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMartyrs(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMartyrs = activeFilter === 'all' 
    ? martyrs 
    : martyrs.filter(m => m.organization === activeFilter);

  return (
    <div className="pb-20">
      <Hero />
      
      {/* Filters Section */}
      <section className="container mx-auto px-4 -mt-12 relative z-30">
        <div className="bg-card border border-border p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 ml-4 text-foreground/50">
            <Filter size={20} />
            <span className="font-bold">پاڵاوتن:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {ORGANIZATIONS.map((org) => {
              const Icon = org.icon;
              const isActive = activeFilter === org.id;
              
              return (
                <button
                  key={org.id}
                  onClick={() => setActiveFilter(org.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    isActive 
                      ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20 scale-105' 
                      : 'bg-foreground/5 hover:bg-foreground/10 text-foreground/70'
                  }`}
                >
                  <Icon size={18} />
                  <span>{org.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Martyrs Grid */}
      <section className="container mx-auto px-4 mt-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">دوایین شەهیدەکان</h2>
            <p className="text-foreground/50">لیستی ئەو قارەمانانەی دوایین جار ناویان تۆمارکراوە</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-red" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredMartyrs.map((martyr, index) => (
              <motion.div
                key={martyr.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <MartyrCard martyr={martyr} />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredMartyrs.length === 0 && (
          <div className="text-center py-20 bg-foreground/5 rounded-3xl border border-dashed border-border">
            <p className="text-foreground/40 text-lg">هیچ شەهیدێک لەم بەشەدا نییە</p>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 mt-32">
        <div className="bg-brand-green/5 border border-brand-green/20 rounded-3xl p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-red/10 rounded-full blur-3xl -ml-32 -mb-32" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold text-brand-green mb-2">+{martyrs.length}</div>
              <div className="text-lg text-foreground/60">شەهیدی تۆمارکراو</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-brand-red mb-2">+٤٥٠</div>
              <div className="text-lg text-foreground/60">داستانی قارەمانانە</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-brand-yellow mb-2">+٥٠,٠٠٠</div>
              <div className="text-lg text-foreground/60">وێنە و بەڵگەنامە</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
