'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, FileText, Check, X, Edit, 
  Trash2, ShieldCheck, BarChart3, Settings, Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('submissions');
  const [martyrs, setMartyrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    users: 0,
    views: '١,٢٠٠'
  });

  useEffect(() => {
    fetchMartyrs();
  }, []);

  const fetchMartyrs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('martyrs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMartyrs(data || []);
      
      // Calculate stats
      const total = data?.filter(m => m.is_approved).length || 0;
      const pending = data?.filter(m => !m.is_approved).length || 0;
      setStats(prev => ({ ...prev, total, pending }));
      
    } catch (error) {
      console.error('Error fetching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('martyrs')
        .update({ is_approved: true })
        .eq('id', id);

      if (error) throw error;
      fetchMartyrs(); // Refresh
    } catch (error) {
      alert('هەڵەیەک ڕوویدا');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ئایا دڵنیایت لە سڕینەوەی ئەم شەهیدە؟')) return;
    try {
      const { error } = await supabase
        .from('martyrs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchMartyrs(); // Refresh
    } catch (error) {
      alert('هەڵەیەک ڕوویدا');
    }
  };

  const filteredMartyrs = activeTab === 'submissions' 
    ? martyrs.filter(m => !m.is_approved)
    : martyrs.filter(m => m.is_approved);

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">تەختەی کۆنتڕۆڵ</h1>
            <p className="text-foreground/50">بەڕێوەبردنی پلاتفۆرمی یادگاری شەهیدان</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-card border border-border p-3 rounded-xl hover:bg-foreground/5 transition-colors">
              <Settings size={20} />
            </button>
            <div className="flex items-center gap-3 bg-brand-green/10 text-brand-green px-4 py-2 rounded-xl border border-brand-green/20">
              <ShieldCheck size={20} />
              <span className="font-bold">بەڕێوەبەری سەرەکی</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-card border border-border p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-foreground/5 text-brand-green">
                <Users size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-foreground/50 text-sm font-medium">کۆی شەهیدان</div>
          </div>
          <div className="bg-card border border-border p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-foreground/5 text-brand-red">
                <FileText size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.pending}</div>
            <div className="text-foreground/50 text-sm font-medium">نوێترین داواکاری</div>
          </div>
          <div className="bg-card border border-border p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-foreground/5 text-brand-yellow">
                <ShieldCheck size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.users}</div>
            <div className="text-foreground/50 text-sm font-medium">بەکارهێنەران</div>
          </div>
          <div className="bg-card border border-border p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-foreground/5 text-blue-500">
                <BarChart3 size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.views}</div>
            <div className="text-foreground/50 text-sm font-medium">سەردانیکەران</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-card border border-border p-2 rounded-2xl space-y-1">
              <button
                onClick={() => setActiveTab('submissions')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === 'submissions' ? 'bg-brand-red text-white' : 'hover:bg-foreground/5 text-foreground/60'
                }`}
              >
                <FileText size={20} />
                <span>داواکارییەکان ({stats.pending})</span>
              </button>
              <button
                onClick={() => setActiveTab('martyrs')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === 'martyrs' ? 'bg-brand-red text-white' : 'hover:bg-foreground/5 text-foreground/60'
                }`}
              >
                <Users size={20} />
                <span>شەهیدان ({stats.total})</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <div className="bg-card border border-border rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  {activeTab === 'submissions' ? 'داواکارییە نوێیەکان' : 'لیستی شەهیدەکان'}
                </h3>
              </div>

              {loading ? (
                <div className="p-20 flex justify-center">
                  <Loader2 className="animate-spin text-brand-red" size={40} />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-foreground/5 text-foreground/50 text-sm">
                      <tr>
                        <th className="px-6 py-4 font-bold">ناو</th>
                        <th className="px-6 py-4 font-bold">شوێن</th>
                        <th className="px-6 py-4 font-bold">بەروار</th>
                        <th className="px-6 py-4 font-bold">کردارەکان</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredMartyrs.map((item) => (
                        <tr key={item.id} className="hover:bg-foreground/5 transition-colors">
                          <td className="px-6 py-4 font-bold">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img src={item.photo_url} alt="" className="w-full h-full object-cover" />
                              </div>
                              {item.full_name}
                            </div>
                          </td>
                          <td className="px-6 py-4">{item.martyrdom_location}</td>
                          <td className="px-6 py-4 text-sm text-foreground/50">
                            {new Date(item.created_at).toLocaleDateString('ku-IQ')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {!item.is_approved && (
                                <button 
                                  onClick={() => handleApprove(item.id)}
                                  className="p-2 bg-brand-green/10 text-brand-green rounded-lg hover:bg-brand-green/20 transition-colors"
                                  title="قبوڵکردن"
                                >
                                  <Check size={18} />
                                </button>
                              )}
                              <button className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors">
                                <Edit size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(item.id)}
                                className="p-2 bg-brand-red/10 text-brand-red rounded-lg hover:bg-brand-red/20 transition-colors"
                                title="سڕینەوە"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && filteredMartyrs.length === 0 && (
                <div className="p-20 text-center text-foreground/30">
                  <FileText size={64} className="mx-auto mb-4 opacity-10" />
                  <p>هیچ زانیارییەک نییە</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
