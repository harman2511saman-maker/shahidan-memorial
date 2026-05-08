'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, User, Calendar, MapPin, Award, 
  History, Info, CheckCircle2, Loader2 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const AddMartyr = () => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    father_name: '',
    birth_year: '',
    gender: 'نێر',
    organization: 'پێشمەرگە',
    rank: '',
    martyrdom_year: '',
    martyrdom_location: '',
    battles: '',
    biography: ''
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }

    setLoading(true);
    try {
      let photo_url = '';

      // 1. Upload Image to Supabase Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('martyrs')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('martyrs')
          .getPublicUrl(filePath);
          
        photo_url = urlData.publicUrl;
      }

      // 2. Insert into Database
      const { error: insertError } = await supabase
        .from('martyrs')
        .insert([
          {
            full_name: formData.full_name,
            father_name: formData.father_name,
            photo_url: photo_url,
            birth_year: formData.birth_year ? parseInt(formData.birth_year) : null,
            martyrdom_year: formData.martyrdom_year ? parseInt(formData.martyrdom_year) : null,
            organization: formData.organization,
            rank: formData.rank,
            martyrdom_location: formData.martyrdom_location,
            biography: formData.biography,
            is_approved: false
          }
        ]);

      if (insertError) throw insertError;

      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error submitting:', error);
      alert(`هەڵەیەک ڕوویدا: ${error.message || 'نەزانراو'}`);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border p-12 rounded-3xl max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">داواکارییەکە نێردرا</h2>
          <p className="text-foreground/60 mb-8">
            زانیارییەکانی شەهید بە سەرکەوتوویی نێردرا. دوای پێداچوونەوە لەلایەن بەڕێوەبەرەوە، لە پلاتفۆرمەکەدا بڵاودەکرێتەوە.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-brand-green text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-green/20"
          >
            گەڕانەوە بۆ لاپەڕەی سەرەکی
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">زیادکردنی شەهید</h1>
          <p className="text-foreground/50 text-lg">بۆ بەرز ڕاگرتنی یادی قارەمانەکانمان، زانیارییەکانیان تۆمار بکە</p>
        </div>

        {/* Multi-step Indicator */}
        <div className="flex justify-between items-center mb-12 max-w-md mx-auto">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? 'bg-brand-red text-white' : 'bg-foreground/10 text-foreground/40'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 mx-2 rounded-full ${
                  step > s ? 'bg-brand-red' : 'bg-foreground/10'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-card border border-border p-8 md:p-12 rounded-3xl shadow-xl">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <User className="text-brand-red" /> زانیارییە سەرەکییەکان
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/70">ناوی سیانی شەهید</label>
                    <input name="full_name" value={formData.full_name} onChange={handleInputChange} type="text" placeholder="بۆ نموونە: ئازاد بەراکە ئەحمەد" className="w-full bg-background border border-border p-4 rounded-xl focus:ring-2 focus:ring-brand-red/50 outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/70">ناوی باوک</label>
                    <input name="father_name" value={formData.father_name} onChange={handleInputChange} type="text" placeholder="ناوی باوکی شەهید" className="w-full bg-background border border-border p-4 rounded-xl focus:ring-2 focus:ring-brand-red/50 outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/70">ساڵی لەدایکبوون</label>
                    <input name="birth_year" value={formData.birth_year} onChange={handleInputChange} type="number" placeholder="١٩٨٠" className="w-full bg-background border border-border p-4 rounded-xl focus:ring-2 focus:ring-brand-red/50 outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/70">ڕەگەز</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-background border border-border p-4 rounded-xl focus:ring-2 focus:ring-brand-red/50 outline-none appearance-none">
                      <option>نێر</option>
                      <option>مێ</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-foreground/70">وێنەی شەهید</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-brand-red/50 transition-colors cursor-pointer group relative min-h-[200px] flex flex-col items-center justify-center overflow-hidden"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                    ) : null}
                    
                    <div className="relative z-10">
                      <Upload className="mx-auto text-foreground/30 group-hover:text-brand-red mb-4" size={40} />
                      <p className="text-foreground/50">{imageFile ? imageFile.name : 'وێنەکە لێرە دابنێ یان کرتە بکە بۆ هەڵبژاردن'}</p>
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Award className="text-brand-green" /> زانیارییە سەربازییەکان
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/70">ڕێکخراو / هێز</label>
                    <select name="organization" value={formData.organization} onChange={handleInputChange} className="w-full bg-background border border-border p-4 rounded-xl focus:ring-2 focus:ring-brand-green/50 outline-none">
                      <option>پێشمەرگە</option>
                      <option>ئاسایش</option>
                      <option>دژەتیرۆر</option>
                      <option>زێرەڤانی</option>
                      <option>هێزەکانی ناوخۆ</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/70">پلەی سەربازی</label>
                    <input name="rank" value={formData.rank} onChange={handleInputChange} type="text" placeholder="بۆ نموونە: فەرماندە" className="w-full bg-background border border-border p-4 rounded-xl focus:ring-2 focus:ring-brand-green/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/70">ساڵی شەهیدبوون</label>
                    <input name="martyrdom_year" value={formData.martyrdom_year} onChange={handleInputChange} type="number" placeholder="٢٠١٤" className="w-full bg-background border border-border p-4 rounded-xl focus:ring-2 focus:ring-brand-green/50 outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/70">شوێنی شەهیدبوون</label>
                    <input name="martyrdom_location" value={formData.martyrdom_location} onChange={handleInputChange} type="text" placeholder="شار یان ناوچە" className="w-full bg-background border border-border p-4 rounded-xl focus:ring-2 focus:ring-brand-green/50 outline-none" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/70">ئەو داستانانەی تێیدا بەشداربووە</label>
                  <textarea name="battles" value={formData.battles} onChange={handleInputChange} rows={3} placeholder="ناوی ئەو شەڕ و داستانانەی بەشداری تێدا کردووە..." className="w-full bg-background border border-border p-4 rounded-xl focus:ring-2 focus:ring-brand-green/50 outline-none resize-none"></textarea>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Info className="text-brand-yellow" /> کورتەیەک لە ژیاننامە
                </h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/70">ژیاننامەی شەهید</label>
                  <textarea name="biography" value={formData.biography} onChange={handleInputChange} rows={10} placeholder="لێرە دەتوانیت بە درێژی باسی ژیان و خەباتی شەهید بکەیت..." className="w-full bg-background border border-border p-4 rounded-xl focus:ring-2 focus:ring-brand-yellow/50 outline-none resize-none" required></textarea>
                </div>
              </motion.div>
            )}

            <div className="mt-12 flex justify-between gap-4">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="px-8 py-4 bg-foreground/5 hover:bg-foreground/10 text-foreground font-bold rounded-2xl transition-all"
                >
                  گەڕانەوە
                </button>
              )}
              <button 
                type="submit"
                disabled={loading}
                className={`mr-auto px-12 py-4 flex items-center gap-2 font-bold rounded-2xl shadow-lg transition-all hover:scale-105 ${
                  step < 3 
                    ? 'bg-brand-red text-white shadow-brand-red/20' 
                    : 'bg-brand-green text-white shadow-brand-green/20'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                <span>{step < 3 ? 'بەردەوامبە' : 'تۆمارکردنی زانیارییەکان'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMartyr;
