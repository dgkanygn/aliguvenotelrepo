import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from '../Dashboard/components/Sidebar';
import Navbar from '../Dashboard/components/Navbar';
import { useDashboard } from '../Dashboard/hooks/useDashboard';
import { useCounters } from './hooks/useCounters';
import IconSelector from '../../components/IconSelector';
import ConfirmModal from '../../components/ConfirmModal';
import { ICONS } from '../../utils/iconList';
import { FORM_LIMITS } from '../../utils/formLimits';
import { Edit2, Save, X, Hash, Type, Plus, Trash2, LayoutGrid } from 'lucide-react';

const CounterManagement = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu } = useDashboard();
  const { counters, isLoading, handleUpdate, createCounter, removeCounter } = useCounters();
  
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const startAdd = () => {
    setEditData({ icon: 'star', count: 0, name: '' });
    setIsAddModalOpen(true);
  };

  const cancelAdd = () => {
    setIsAddModalOpen(false);
    setEditData({});
  };

  const onSaveNew = async () => {
    if (!editData.name || editData.count === '' || editData.count === undefined) {
      toast.error('Lütfen değer ve isim alanlarını doldurun.');
      return;
    }
    const success = await createCounter(editData);
    if (success) {
      setIsAddModalOpen(false);
      setEditData({});
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await removeCounter(deleteId);
      setDeleteId(null);
    }
  };

  const startEdit = (counter) => {
    setEditingId(counter.id);
    setEditData(counter);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const onSave = async (id) => {
    if (!editData.name || editData.count === '' || editData.count === undefined) {
      toast.error('Lütfen değer ve isim alanlarını doldurun.');
      return;
    }
    await handleUpdate(id, editData);
    setEditingId(null);
  };

  const renderIcon = (iconName) => {
    const IconComponent = ICONS[iconName] || ICONS['star'];
    return <IconComponent size={24} />;
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-300 font-inter">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleMobileMenu={toggleMobileMenu} />

        <main className="flex-1 overflow-x-hidden p-6 sm:p-10">
          <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[#C5A059] font-bold text-xs uppercase tracking-[3px] mb-2">Ana Sayfa</p>
              <h1 className="text-3xl font-bold text-white tracking-tight">Sayaç Yönetimi</h1>
              <p className="text-slate-500 mt-2">Maksimum {FORM_LIMITS.counter.maxItems} adet sayaç ekleyebilirsiniz. ({counters.length}/{FORM_LIMITS.counter.maxItems})</p>
            </div>
            
            {counters.length < FORM_LIMITS.counter.maxItems && (
              <button 
                onClick={startAdd}
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#C5A059] hover:bg-[#A68045] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#C5A059]/10"
              >
                <Plus size={18} />
                Yeni Sayaç Ekle
              </button>
            )}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {counters.map((counter) => (
              <div key={counter.id} className="bg-[#1E293B]/40 border border-white/5 rounded-[32px] p-8 group transition-all duration-300 hover:bg-[#1E293B]/60 relative h-full flex flex-col">
                {editingId === counter.id ? (
                  <div className="space-y-6 flex-1 flex flex-col">
                    {/* Icon Selection Trigger */}
                    <div className="flex flex-col items-center gap-3">
                       <button 
                        onClick={() => setIsIconSelectorOpen(true)}
                        className="w-16 h-16 bg-[#C5A059]/10 rounded-2xl flex items-center justify-center text-[#C5A059] border border-[#C5A059]/20 hover:bg-[#C5A059]/20 transition-all cursor-pointer relative group/icon"
                       >
                          {renderIcon(editData.icon)}
                          <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover/icon:opacity-100 flex items-center justify-center transition-opacity">
                            <LayoutGrid size={16} className="text-white" />
                          </div>
                       </button>
                       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">İkonu Değiştir</span>
                    </div>

                    <div className="space-y-4 flex-1">
                      <div>
                        <div className="flex justify-between items-center mb-1 px-1">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Değer (Max XXXX)</label>
                        </div>
                        <div className="relative">
                          <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input 
                            type="number" 
                            onInput={(e) => {
                              if (e.target.value.length > FORM_LIMITS.counter.countMaxDigits) {
                                e.target.value = e.target.value.slice(0, FORM_LIMITS.counter.countMaxDigits);
                              }
                            }}
                            value={editData.count}
                            onChange={(e) => setEditData({...editData, count: e.target.value.slice(0, FORM_LIMITS.counter.countMaxDigits)})}
                            className="w-full bg-[#0F172A] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1 px-1">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">İsim</label>
                           <span className={`text-[9px] font-bold ${editData.name.length >= FORM_LIMITS.counter.name ? 'text-rose-500' : 'text-slate-600'}`}>{editData.name.length}/{FORM_LIMITS.counter.name}</span>
                        </div>
                        <div className="relative">
                          <Type size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input 
                            type="text" 
                            maxLength={FORM_LIMITS.counter.name}
                            value={editData.name}
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                            className="w-full bg-[#0F172A] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/5 mt-auto">
                      <button 
                        disabled={isLoading}
                        onClick={() => onSave(counter.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl text-sm font-bold transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Save size={18} />
                        Kaydet
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="flex items-center justify-center p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all cursor-pointer"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 bg-[#C5A059]/5 rounded-2xl flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-500 shadow-xl shadow-[#C5A059]/0 group-hover:shadow-[#C5A059]/20">
                        {renderIcon(counter.icon)}
                      </div>
                      <div className="flex items-center gap-2">
                         <button 
                          onClick={() => startEdit(counter)}
                          className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer border border-white/5"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => setDeleteId(counter.id)}
                          className="p-3 rounded-xl bg-rose-500/5 text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer border border-rose-500/5"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <p className="text-4xl font-bold text-white tracking-tight mb-1">{counter.count}</p>
                      <p className="text-slate-400 font-medium tracking-wide">{counter.name}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Icon Selector Modal */}
          {isIconSelectorOpen && (
            <IconSelector 
              selectedIcon={editData.icon}
              onSelect={(iconName) => setEditData({...editData, icon: iconName})}
              onClose={() => setIsIconSelectorOpen(false)}
            />
          )}

          {counters.length === 0 && (
            <div className="text-center py-20 bg-[#1E293B]/20 rounded-[32px] border border-dashed border-white/10">
              <p className="text-slate-500">Henüz hiç sayaç eklenmemiş.</p>
              <button 
                onClick={startAdd}
                className="mt-4 text-[#C5A059] font-bold hover:underline cursor-pointer"
              >
                İlk sayacı ekle
              </button>
            </div>
          )}

          {isAddModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!isLoading ? cancelAdd : undefined} />
              <div className="relative w-full max-w-md bg-[#0F172A] border border-white/10 rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Yeni Sayaç Ekle</h3>
                  <button onClick={cancelAdd} className="text-slate-500 hover:text-white transition-colors cursor-pointer"><X size={24} /></button>
                </div>
                
                <div className="space-y-6 flex-1 flex flex-col">
                    <div className="flex flex-col items-center gap-3">
                       <button 
                        onClick={() => setIsIconSelectorOpen(true)}
                        className="w-16 h-16 bg-[#C5A059]/10 rounded-2xl flex items-center justify-center text-[#C5A059] border border-[#C5A059]/20 hover:bg-[#C5A059]/20 transition-all cursor-pointer relative group/icon"
                       >
                          {renderIcon(editData.icon)}
                          <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover/icon:opacity-100 flex items-center justify-center transition-opacity">
                            <LayoutGrid size={16} className="text-white" />
                          </div>
                       </button>
                       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">İkonu Seç</span>
                    </div>

                    <div className="space-y-4 flex-1">
                      <div>
                        <div className="flex justify-between items-center mb-1 px-1">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Değer (Max XXXX)</label>
                        </div>
                        <div className="relative">
                          <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input 
                            type="number" 
                            onInput={(e) => {
                              if (e.target.value.length > FORM_LIMITS.counter.countMaxDigits) {
                                e.target.value = e.target.value.slice(0, FORM_LIMITS.counter.countMaxDigits);
                              }
                            }}
                            value={editData.count || ''}
                            onChange={(e) => setEditData({...editData, count: e.target.value.slice(0, FORM_LIMITS.counter.countMaxDigits)})}
                            className="w-full bg-[#1E293B] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1 px-1">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">İsim</label>
                           <span className={`text-[9px] font-bold ${(editData.name?.length || 0) >= FORM_LIMITS.counter.name ? 'text-rose-500' : 'text-slate-600'}`}>{(editData.name?.length || 0)}/{FORM_LIMITS.counter.name}</span>
                        </div>
                        <div className="relative">
                          <Type size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input 
                            type="text" 
                            maxLength={FORM_LIMITS.counter.name}
                            value={editData.name || ''}
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                            className="w-full bg-[#1E293B] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center pt-4 border-t border-white/5 mt-auto">
                      <button 
                        disabled={isLoading}
                        onClick={onSaveNew}
                        className="w-full flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-[#A68045] text-white py-3 rounded-2xl text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#C5A059]/10"
                      >
                        <Save size={18} />
                        {isLoading ? 'Ekleniyor...' : 'Ekle'}
                      </button>
                    </div>
                </div>
              </div>
            </div>
          )}

          <ConfirmModal 
            isOpen={!!deleteId}
            onClose={() => setDeleteId(null)}
            onConfirm={confirmDelete}
            isLoading={isLoading}
            title="Sayacı Sil"
            message="Bu sayacı silmek istediğinize emin misiniz?"
          />
        </main>
      </div>
    </div>
  );
};

export default CounterManagement;
