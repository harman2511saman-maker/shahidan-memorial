'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background with Overlay using CSS for better stability */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          background: `linear-gradient(135deg, #1a0a0a 0%, #0d1f12 30%, #111111 60%, #1a0505 100%)`,
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />
      </div>

      <div className="container mx-auto px-4 relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1 rounded-full bg-brand-red/20 text-brand-red font-bold text-sm mb-6 border border-brand-red/30 backdrop-blur-sm">
            بۆ یادی شەهیدانمان
          </span>
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight font-kurdish">
            نەمرن ئەوانەی <br />
            <span className="text-brand-green">لە پێناو خاکدا</span> گیان دەسپێرن
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            گەورەترین پلاتفۆرم بۆ یادکردنەوە و دۆکیومێنتکردنی ژیان و قوربانیدانی شەهیدانی کوردستان. مێژووی ئێمە لێرەوە دەستپێدەکات.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-400 group-focus-within:text-brand-green transition-colors">
              <Search size={22} />
            </div>
            <input 
              type="text" 
              placeholder="بۆ ناوی شەهیدێک بگەڕێ..." 
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 py-5 pr-14 pl-6 rounded-2xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:bg-white/15 transition-all placeholder:text-gray-400"
            />
            <button className="absolute left-3 top-3 bottom-3 bg-brand-green hover:bg-brand-green/90 text-white px-6 rounded-xl font-bold transition-all shadow-lg shadow-brand-green/20">
              بگەڕێ
            </button>
          </div>
        </motion.div>
      </div>

      {/* Flag Line Decor */}
      <div className="absolute bottom-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-brand-red" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-brand-green" />
      </div>
    </section>
  );
};

export default Hero;
