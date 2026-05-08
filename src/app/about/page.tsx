'use client';

import { motion } from 'framer-motion';
import { Heart, Shield, History, Users, Globe, Mail } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-brand-red rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-brand-red/30"
          >
            <Heart size={48} fill="currentColor" />
          </motion.div>
          <h1 className="text-6xl font-bold mb-8">دەربارەی پلاتفۆرم</h1>
          <p className="text-2xl text-foreground/70 leading-relaxed text-justify md:text-center">
            یادگاری شەهیدان پڕۆژەیەکی نەتەوەیی و مرۆییە، ئامانجمان کۆکردنەوە و پاراستنی یادگاری و مێژووی ئەو قارەمانانەیە کە لەپێناو ئازادی و سەربەخۆیی کوردستاندا خوێنی خۆیان بەخشی.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Shield size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">پاراستنی مێژوو</h3>
            <p className="text-foreground/50 leading-loose">پاراستنی ناوی شەهیدان و ڕێگریکردن لە ونبوونی چیرۆکە قارەمانانەکان بۆ نەوەکانی داهاتوو.</p>
          </div>
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-brand-yellow/10 text-brand-yellow rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">بەشداری گشتی</h3>
            <p className="text-foreground/50 leading-loose">هەموو هاوڵاتییەک دەتوانێت زانیاری و وێنەی شەهیدانی خێزانەکەی بۆ ئەم پلاتفۆرمە بنێرێت.</p>
          </div>
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-brand-red/10 text-brand-red rounded-3xl flex items-center justify-center mx-auto mb-6">
              <History size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">متمانەیی</h3>
            <p className="text-foreground/50 leading-loose">هەموو زانیارییەکان پێش بڵاوکردنەوە لەلایەن تیمی ئەدمینەوە پێداچوونەوەیان بۆ دەکرێت.</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-card border border-border rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-brand-green/5 opacity-50 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-8">پەیوەندی لەگەڵ ئێمە</h2>
            <p className="text-xl text-foreground/50 mb-12 max-w-xl mx-auto leading-loose">
              بۆ هەر پێشنیارێک یان هەبوونی کێشە لە زانیارییەکان، دەتوانن لە ڕێگەی ئیمەیڵەوە پەیوەندیمان پێوە بکەن.
            </p>
            <a href="mailto:info@shahidan.krd" className="inline-flex items-center gap-3 bg-foreground text-background px-10 py-5 rounded-full font-bold text-xl hover:scale-105 transition-transform">
              <Mail size={24} />
              info@shahidan.krd
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
