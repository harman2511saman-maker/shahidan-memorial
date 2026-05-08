'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Calendar, MapPin, Award, History, Heart, Share2, 
  Info, Image as ImageIcon, Loader2 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const MartyrProfile = () => {
  const params = useParams();
  const [martyr, setMartyr] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(124);
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
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
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
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">ببوورە، ئەم زانیارییە نەدۆزرایەوە</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Header / Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-10" />
        <img 
          src={martyr.photo_url} 
          alt={martyr.full_name}
          className="w-full h-full object-cover grayscale-[30%] blur-[2px]"
        />
        
        <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-end pb-12">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row items-end gap-8"
          >
            <div className="w-48 h-64 md:w-64 md:h-80 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl shrink-0">
              <img src={martyr.photo_url} alt={martyr.full_name} className="w-full h-full object-cover" />
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-brand-red text-white px-4 py-1 rounded-full text-sm font-bold">
                  {martyr.organization || 'پێشمەرگە'}
                </span>
                <span className="bg-white/10 backdrop-blur-md text-white px-4 py-1 rounded-full text-sm">
                  {martyr.rank || 'پێشمەرگە'}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{martyr.full_name}</h1>
              <p className="text-white/70 text-xl font-medium">کوری {martyr.father_name}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            {/* Biography */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border p-8 rounded-3xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-green/10 rounded-lg text-brand-green">
                  <Info size={24} />
                </div>
                <h2 className="text-2xl font-bold">کورەی ژیان و خەبات</h2>
              </div>
              <p className="text-foreground/80 text-lg leading-loose whitespace-pre-line">
                {martyr.biography}
              </p>
            </motion.section>

            {/* Gallery (Placeholder if no real gallery table implementation yet) */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border p-8 rounded-3xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-yellow/10 rounded-lg text-brand-yellow">
                    <ImageIcon size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">ئەلبومی وێنەکان</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                  <img src={martyr.photo_url} alt="Gallery" className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.section>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-card border border-border p-8 rounded-3xl sticky top-28">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-foreground/50 flex items-center gap-2">
                    <Calendar size={18} /> ساڵی لەدایکبوون
                  </span>
                  <span className="font-bold text-lg">{martyr.birth_year}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-foreground/50 flex items-center gap-2">
                    <Calendar size={18} className="text-brand-red" /> ساڵی شەهیدبوون
                  </span>
                  <span className="font-bold text-lg text-brand-red">{martyr.martyrdom_year}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-foreground/50 flex items-center gap-2">
                    <Award size={18} className="text-brand-yellow" /> تەمەنی شەهیدبوون
                  </span>
                  <span className="font-bold text-lg">{martyr.martyrdom_year - martyr.birth_year} ساڵ</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-foreground/50 flex items-center gap-2">
                    <MapPin size={18} className="text-brand-green" /> شوێنی شەهیدبوون
                  </span>
                  <span className="font-bold text-lg text-left">{martyr.martyrdom_location}</span>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button 
                  onClick={toggleLike}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all ${
                    isLiked 
                      ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' 
                      : 'bg-foreground/5 hover:bg-brand-red/10 text-brand-red'
                  }`}
                >
                  <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                  <span>داگیرساندنی مۆم ({likes})</span>
                </button>
                <button className="p-4 bg-foreground/5 rounded-2xl hover:bg-foreground/10 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MartyrProfile;
