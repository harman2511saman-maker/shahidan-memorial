'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Award } from 'lucide-react';

interface MartyrCardProps {
  martyr: {
    id: string;
    full_name: string;
    photo_url: string;
    organization: string;
    martyrdom_year: number;
    martyrdom_location: string;
    rank: string;
  };
}

const MartyrCard = ({ martyr }: MartyrCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-green/10 transition-all"
    >
      <Link href={`/martyr/${martyr.id}`}>
        <div className="relative h-64 overflow-hidden">
          <img 
            src={martyr.photo_url || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500&auto=format&fit=crop"} 
            alt={martyr.full_name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="absolute top-4 right-4 bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {martyr.organization}
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold mb-3 group-hover:text-brand-green transition-colors">
            {martyr.full_name}
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground/60 text-sm">
              <Calendar size={14} className="text-brand-red" />
              <span>ساڵی شەهیدبوون: {martyr.martyrdom_year}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/60 text-sm">
              <MapPin size={14} className="text-brand-green" />
              <span>شوێن: {martyr.martyrdom_location}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/60 text-sm">
              <Award size={14} className="text-brand-yellow" />
              <span>پلە: {martyr.rank}</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
            <span className="text-brand-green font-bold text-sm">بینینی پرۆفایل</span>
            <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition-all">
              ←
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MartyrCard;
