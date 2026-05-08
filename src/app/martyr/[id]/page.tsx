'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Calendar, MapPin, Award, History, Heart, Share2, 
  Info, Image as ImageIcon, Loader2, ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const MartyrProfile = () => {
  const params = useParams();
  const [martyr, setMartyr] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchMartyr();
    }
  }, [params.id]);

  const fetchMartyr = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('martyrs')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setMartyr(data);
    } catch (error: any) {
      console.error('Error fetching martyr:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    if (isLiked) return; // Prevent multiple likes in one session easily
    
    setIsLiked(true);
    try {
      const { data, error } = await supabase
        .from('martyrs')
        .update({ candles_count: (martyr.candles_count || 0) + 1 })
        .eq('id', martyr.id)
        .select()
        .single();

      if (error) throw error;
      setMartyr(data);
    } catch (error) {
      console.error('Error updating likes:', error);
      setIsLiked(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-red" size={48} />
      </div>
    );
  }

  if (!martyr) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-bold mb-4">ببوورە، ئەم زانیارییە نەدۆزرایەوە</h2>
        <button onClick={() => window.location.href = '/'} className="bg-brand-red text-white px-8 py-3 rounded-2xl font-bold">گەڕانەوە</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Dynamic Background Banner */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
        <img 
          src={martyr.photo_url} 
          alt="" 
          className="w-full h-full object-cover scale-110 blur-xl opacity-30"
        />
        
        <div className="absolute inset-0 flex items-center justify-center z-20 pt-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-64 h-80 md:w-80 md:h-96 rounded-[2.5rem] overflow-hidden border-8 border-card shadow-2xl rotate-3"
          >
            <img src={martyr.photo_url} alt={martyr.full_name} className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-30">
        <div className="max-w-5xl mx-auto">
          {/* Header Info */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="bg-brand-red text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-brand-red/20">
                  {martyr.organization}
                </span>
                <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-6 py-1.5 rounded-full text-sm font-bold">
                  {martyr.rank || 'پێشمەرگە'}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-4">{martyr.full_name}</h1>
              <p className="text-foreground/40 text-2xl font-medium">کوری {martyr.father_name}</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Details */}
            <div className="lg:col-span-8 space-y-10">
              <section className="bg-card border border-border p-10 rounded-[3rem] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                    <Info size={20} />
                  </div>
                  کورەی ژیان و خەبات
                </h2>
                <div className="text-foreground/70 text-xl leading-[2.2] whitespace-pre-line text-justify">
                  {martyr.biography || 'زانیاری دەربارەی ژیاننامەی ئەم شەهیدە هێشتا زیاد نەکراوە.'}
                </div>
              </section>

              {/* Battles / History */}
              <section className="bg-card border border-border p-10 rounded-[3rem] shadow-sm">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-red/10 flex items-center justify-center text-brand-red">
                    <History size={20} />
                  </div>
                  داستانەکان و بەشدارییەکان
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(martyr.battles || 'بەشداری لە چەندین شەڕ و داستانی نەتەوەییدا کردووە').split('،').map((battle: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 bg-foreground/[0.03] p-5 rounded-2xl border border-border/50">
                      <ChevronRight className="text-brand-red" size={20} />
                      <span className="font-bold">{battle.trim()}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Stats & Actions */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-card border border-border p-8 rounded-[3rem] shadow-xl sticky top-28">
                <div className="space-y-8 mb-10">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-brand-red/10 flex items-center justify-center text-brand-red shrink-0">
                      <Calendar size={28} />
                    </div>
                    <div>
                      <div className="text-sm text-foreground/40 font-bold uppercase tracking-wider">ساڵی لەدایکبوون</div>
                      <div className="text-2xl font-bold">{martyr.birth_year}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                      <Award size={28} />
                    </div>
                    <div>
                      <div className="text-sm text-foreground/40 font-bold uppercase tracking-wider">ساڵی شەهیدبوون</div>
                      <div className="text-2xl font-bold">{martyr.martyrdom_year}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow shrink-0">
                      <MapPin size={28} />
                    </div>
                    <div>
                      <div className="text-sm text-foreground/40 font-bold uppercase tracking-wider">شوێنی شەهیدبوون</div>
                      <div className="text-2xl font-bold">{martyr.martyrdom_location}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={toggleLike}
                    className={`group w-full flex items-center justify-center gap-4 py-6 rounded-[2rem] font-bold text-xl transition-all duration-500 ${
                      isLiked 
                        ? 'bg-brand-red text-white shadow-2xl shadow-brand-red/30 scale-[1.02]' 
                        : 'bg-foreground/5 hover:bg-brand-red/10 text-brand-red'
                    }`}
                  >
                    <Heart size={28} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "animate-pulse" : ""} />
                    <span>داگیرساندنی مۆم ({martyr.candles_count || 0})</span>
                  </button>
                  
                  <button className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-foreground/40 font-bold hover:bg-foreground/5 transition-all">
                    <Share2 size={20} />
                    <span>بڵاوکردنەوەی پرۆفایل</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MartyrProfile;
