'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Calendar, MapPin, Award, History, Heart, Share2, 
  Info, Image as ImageIcon, Loader2, ChevronRight, User
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
    if (isLiked) return; 
    
    setIsLiked(true);
    try {
      // Calling the secure function we just created in SQL
      const { error } = await supabase.rpc('increment_candles', { target_id: martyr.id });

      if (error) throw error;
      
      // Update local state to show the new count immediately
      setMartyr({ ...martyr, candles_count: (martyr.candles_count || 0) + 1 });
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-3xl font-bold mb-4">ببوورە، ئەم زانیارییە نەدۆزرایەوە</h2>
        <button onClick={() => window.location.href = '/'} className="bg-brand-red text-white px-8 py-3 rounded-2xl font-bold">گەڕانەوە بۆ لاپەڕەی سەرەکی</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Banner Section */}
      <div className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        <img 
          src={martyr.photo_url} 
          alt="" 
          className="w-full h-full object-cover scale-110 blur-2xl opacity-20"
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pt-20 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-56 h-72 md:w-72 md:h-96 rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl"
          >
            <img src={martyr.photo_url} alt={martyr.full_name} className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 md:-mt-24 relative z-30">
        <div className="max-w-5xl mx-auto">
          {/* Main Info Header */}
          <div className="text-center mb-12 md:mb-16 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <span className="bg-brand-red text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-brand-red/20">
                  {martyr.organization}
                </span>
                <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-5 py-1.5 rounded-full text-sm font-bold">
                  {martyr.rank || 'پێشمەرگە'}
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-bold mb-4 leading-tight">{martyr.full_name}</h1>
              {martyr.father_name && (
                <div className="inline-flex items-center gap-2 bg-foreground/5 px-6 py-2 rounded-2xl text-foreground/60">
                  <User size={18} className="text-brand-red" />
                  <span className="text-lg md:text-xl font-bold">نازناو: {martyr.father_name}</span>
                </div>
              )}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-8 md:space-y-12">
              {/* Biography Section */}
              <section className="bg-card border border-border p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-brand-red">
                  <div className="w-10 h-10 rounded-2xl bg-brand-red/10 flex items-center justify-center">
                    <Info size={20} />
                  </div>
                  کورتەی ژیان و خەبات
                </h2>
                <div className="text-foreground/80 text-lg md:text-xl leading-[2] md:leading-[2.2] whitespace-pre-line text-justify">
                  {martyr.biography || 'زانیاری دەربارەی ژیاننامەی ئەم شەهیدە هێشتا زیاد نەکراوە.'}
                </div>
              </section>

              {/* Battles/History Section */}
              {martyr.battles && (
                <section className="bg-card border border-border p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm">
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-brand-green">
                    <div className="w-10 h-10 rounded-2xl bg-brand-green/10 flex items-center justify-center">
                      <History size={20} />
                    </div>
                    داستانەکان و بەشدارییەکان
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {martyr.battles.split('،').map((battle: string, i: number) => (
                      <div key={i} className="flex items-center gap-4 bg-foreground/[0.02] p-5 rounded-2xl border border-border/50">
                        <div className="w-2 h-2 rounded-full bg-brand-red shrink-0" />
                        <span className="font-bold text-base md:text-lg">{battle.trim()}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Sidebar Column */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-card border border-border p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl sticky top-28">
                <div className="space-y-8 mb-10">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-brand-red/10 flex items-center justify-center text-brand-red shrink-0">
                      <Calendar size={28} />
                    </div>
                    <div>
                      <div className="text-xs text-foreground/40 font-bold uppercase tracking-widest mb-1">ساڵی لەدایکبوون</div>
                      <div className="text-2xl font-bold">{martyr.birth_year || 'نەزانراو'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                      <Award size={28} />
                    </div>
                    <div>
                      <div className="text-xs text-foreground/40 font-bold uppercase tracking-widest mb-1">ساڵی شەهیدبوون</div>
                      <div className="text-2xl font-bold">{martyr.martyrdom_year || 'نەزانراو'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow shrink-0">
                      <MapPin size={28} />
                    </div>
                    <div>
                      <div className="text-xs text-foreground/40 font-bold uppercase tracking-widest mb-1">شوێنی شەهیدبوون</div>
                      <div className="text-2xl font-bold">{martyr.martyrdom_location || 'نەزانراو'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={toggleLike}
                    className={`group w-full flex flex-col items-center justify-center gap-2 py-6 rounded-[2rem] font-bold transition-all duration-500 ${
                      isLiked 
                        ? 'bg-brand-red text-white shadow-2xl shadow-brand-red/30 scale-[1.02]' 
                        : 'bg-foreground/5 hover:bg-brand-red/10 text-brand-red border border-brand-red/10'
                    }`}
                  >
                    <Heart size={32} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "animate-pulse" : ""} />
                    <span className="text-lg">داگیرساندنی مۆم ({martyr.candles_count || 0})</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('لینکی پڕۆفایل کۆپی کرا');
                    }}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-foreground/40 font-bold hover:bg-foreground/5 transition-all border border-transparent hover:border-border"
                  >
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
