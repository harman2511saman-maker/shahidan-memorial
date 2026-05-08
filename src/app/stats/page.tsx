'use client';

import { motion } from 'framer-motion';
import { 
  Users, Image as ImageIcon, History, 
  MapPin, Calendar, Award, TrendingUp 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const StatsPage = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('martyrs')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', true);
      setCount(count || 0);
    };
    fetchCount();
  }, []);

  const stats = [
    { label: 'کۆی شەهیدانی تۆمارکراو', value: `${count}+`, icon: Users, color: 'text-brand-green' },
    { label: 'وێنە و بەڵگەنامەکان', value: `${count}+`, icon: ImageIcon, color: 'text-brand-yellow' },
    { label: 'داستانە قارەمانانەکان', value: '٢٥+', icon: History, color: 'text-brand-red' },
    { label: 'تێکڕای سەردانیکەران', value: '٧٦٨', icon: TrendingUp, color: 'text-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-4">ئامارە گشتییەکان</h1>
          <p className="text-foreground/50 text-xl max-w-2xl mx-auto">
            وردەکاری داتاکانی پلاتفۆرمەکە لەسەر ئاستی کوردستان
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border p-10 rounded-[3rem] text-center shadow-sm"
            >
              <div className={`w-16 h-16 rounded-3xl bg-foreground/5 flex items-center justify-center mx-auto mb-6 ${stat.color}`}>
                <stat.icon size={32} />
              </div>
              <div className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
              <div className="text-foreground/50 font-bold">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* More detailed charts or info could go here */}
      </div>
    </div>
  );
};

export default StatsPage;
