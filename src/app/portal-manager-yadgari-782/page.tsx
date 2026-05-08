'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, FileText, Check, X, Edit, 
  Trash2, ShieldCheck, BarChart3, Settings, Loader2, Save
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('submissions');
  const [martyrs, setMartyrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    users: 2,
    views: '٧٦٨'
  });

  useEffect(() => {
    checkUser();
    fetchMartyrs();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
    }
  };

  const fetchMartyrs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('martyrs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMartyrs(data || []);
      
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
      fetchMartyrs();
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
      fetchMartyrs();
    } catch (error) {
      alert('هەڵەیەک ڕوویدا');
    }
  };

  const startEditing = (martyr: any) => {
    setEditingId(martyr.id);
    setEditForm(martyr);
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('martyrs')
        .update({
          full_name: editForm.full_name,
          martyrdom_location: editForm.martyrdom_location,
          organization: editForm.organization,
          rank: editForm.rank
        })
        .eq('id', editingId);

      if (error) throw error;
      setEditingId(null);
      fetchMartyrs();
    } catch (error) {
      alert('هەڵەیەک ڕوویدا لە کاتی نوێکردنەوە');
    }
  };

  const filteredMartyrs = activeTab === 'submissions' 
    ? martyrs.filter(m => !m.is_approved)
    : martyrs.filter(m => m.is_approved);

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">تەختەی کۆنتڕۆڵ</h1>
            <p className="text-foreground/50">بەڕێوەبردنی پلاتفۆرمی یادگاری شەهیدان</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/login');
              }}
              className="px-4 py-2 bg-brand-red/10 text-brand-red rounded-xl font-bold hover:bg-brand-red hover:text-white transition-all"
            >
              چوونەدەرەوە
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
            <div className="text-foreground/50 text-sm font-medium">داواکاری نوێ</div>
          </div>
          <div className="bg-card border border-border p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-foreground/5 text-brand-yellow">
                <ShieldCheck size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.users}</div>
            <div className="text-foreground/50 text-sm font-medium">بەڕێوەبەران</div>
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
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border flex justify-between items-center bg-foreground/[0.02]">
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
                    <thead className="bg-foreground/5 text-foreground/50 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 font-bold">زانیاری شەهید</th>
                        <th className="px-6 py-4 font-bold">ڕێکخراو / پلە</th>
                        <th className="px-6 py-4 font-bold">شوێن</th>
                        <th className="px-6 py-4 font-bold">کردارەکان</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredMartyrs.map((item) => (
                        <tr key={item.id} className="hover:bg-foreground/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full overflow-hidden border border-border shrink-0">
                                <img src={item.photo_url} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                {editingId === item.id ? (
                                  <input 
                                    value={editForm.full_name || ''} 
                                    onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                                    className="bg-background border border-border px-2 py-1 rounded text-sm w-full"
                                  />
                                ) : (
                                  <div className="font-bold text-foreground">{item.full_name}</div>
                                )}
                                <div className="text-xs text-foreground/40">{new Date(item.created_at).toLocaleDateString('ku-IQ')}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {editingId === item.id ? (
                              <div className="space-y-1">
                                <input 
                                  value={editForm.organization || ''} 
                                  onChange={(e) => setEditForm({...editForm, organization: e.target.value})}
                                  className="bg-background border border-border px-2 py-1 rounded text-xs w-full"
                                />
                                <input 
                                  value={editForm.rank || ''} 
                                  onChange={(e) => setEditForm({...editForm, rank: e.target.value})}
                                  className="bg-background border border-border px-2 py-1 rounded text-xs w-full"
                                />
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="text-sm font-medium">{item.organization}</div>
                                <div className="text-xs text-foreground/50">{item.rank || 'پێشمەرگە'}</div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {editingId === item.id ? (
                              <input 
                                value={editForm.martyrdom_location || ''} 
                                onChange={(e) => setEditForm({...editForm, martyrdom_location: e.target.value})}
                                className="bg-background border border-border px-2 py-1 rounded text-xs w-full"
                              />
                            ) : (
                              item.martyrdom_location
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {editingId === item.id ? (
                                <button 
                                  onClick={handleUpdate}
                                  className="p-2 bg-brand-green text-white rounded-lg hover:opacity-90 transition-opacity"
                                  title="پاشەکەوتکردن"
                                >
                                  <Save size={18} />
                                </button>
                              ) : (
                                <>
                                  {!item.is_approved && (
                                    <button 
                                      onClick={() => handleApprove(item.id)}
                                      className="p-2 bg-brand-green/10 text-brand-green rounded-lg hover:bg-brand-green/20 transition-colors"
                                      title="قبوڵکردن"
                                    >
                                      <Check size={18} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => startEditing(item)}
                                    className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
                                    title="دەستکاریکردن"
                                  >
                                    <Edit size={18} />
                                  </button>
                                </>
                              )}
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
                  <p className="text-lg">هیچ زانیارییەک نەدۆزرایەوە</p>
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
