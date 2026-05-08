'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { Moon, Sun, Menu, X, Search, PlusCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'سەرەتا', href: '/' },
    { name: 'شەهیدان', href: '/martyrs' },
    { name: 'ئامارەکان', href: '/stats' },
    { name: 'دەربارە', href: '/about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-red/20 group-hover:scale-110 transition-transform">
            ش
          </div>
          <span className="font-outfit font-bold text-xl tracking-tight hidden sm:block">
            یادگاری <span className="text-brand-red">شەهیدان</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-foreground/70 hover:text-brand-green font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-foreground/5 transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <Link href="/add" className="hidden sm:flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white px-4 py-2 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-brand-green/20">
            <PlusCircle size={18} />
            <span>زیادکردن</span>
          </Link>

          <Link href="/login" className="p-2 rounded-full hover:bg-foreground/5 transition-colors">
            <User size={20} />
          </Link>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-border p-4 md:hidden shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-lg font-medium px-4 py-2 hover:bg-foreground/5 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                href="/add" 
                className="flex items-center gap-2 bg-brand-green text-white px-4 py-3 rounded-lg font-medium text-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                <PlusCircle size={18} />
                <span>زیادکردنی شەهید</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
