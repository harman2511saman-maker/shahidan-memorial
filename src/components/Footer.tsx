import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-card border-t border-dark-border py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="font-outfit font-bold text-xl tracking-tight text-white">
                یادگاری <span className="text-brand-red">شەهیدان</span>
              </span>
            </Link>
            <p className="text-gray-400 max-w-sm">
              پلاتفۆرمێکی نیشتمانییە بۆ بەدۆکیومێنتکردنی مێژووی پڕ لە سەروەری شەهیدانی کوردستان. ئێمە لێرەین تا ناوی ئەوان بە زیندوویی بهێڵینەوە.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">بەستەرە خێراکان</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-brand-green transition-colors">سەرەتا</Link></li>
              <li><Link href="/martyrs" className="hover:text-brand-green transition-colors">لیستی شەهیدان</Link></li>
              <li><Link href="/stats" className="hover:text-brand-green transition-colors">ئامارەکان</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">پەیوەندی</h4>
            <ul className="space-y-2 text-gray-400">
              <li>هەولێر، هەرێمی کوردستان</li>
              <li className="pt-4 flex gap-4">
                <a 
                  href="https://wa.me/9647508433534" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-600/10 text-green-500 px-4 py-2 rounded-xl border border-green-600/20 hover:bg-green-600 hover:text-white transition-all"
                >
                  <MessageCircle size={20} />
                  <span className="font-bold">وەتسئاپ</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} هەموو مافەکان پارێزراوە بۆ پلاتفۆرمی یادگاری شەهیدان.</p>
          <p className="flex items-center gap-1">
            دروستکراوە بە <Heart size={14} className="text-brand-red fill-brand-red" /> بۆ نیشتمان
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
