'use client';

import { useState, useEffect } from 'react';
import MartyrCard from '@/components/MartyrCard';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const MartyrsGallery = () => {
  const [martyrs, setMartyrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const normalizeKurdish = (text: string) => {
    return text
      .replace(/[ىي]/g, 'ی')
      .replace(/[كك]/g, 'ک')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  };

  const filteredMartyrs = martyrs.filter(m => {
    const name = normalizeKurdish(m.full_name);
    const search = normalizeKurdish(searchTerm);
    return name.includes(search);
  });

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">کاروانی نەمری</h1>
          <p className="text-foreground/50 text-xl max-w-2xl mx-auto">
            گەلەری وێنەی ئەو قارەمانانەی گیانی خۆیان بەخشی لەپێناو خاکی کوردستان
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-16 relative">
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground/30" size={24} />
          <input 
            type="text" 
            placeholder="گەڕان بەدوای ناوی شەهید..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border px-16 py-6 rounded-[2rem] text-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-all shadow-xl"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-red" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredMartyrs.map((martyr, index) => (
              <motion.div
                key={martyr.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <MartyrCard martyr={martyr} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MartyrsGallery;
