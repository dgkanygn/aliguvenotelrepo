import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from '../Dashboard/components/Sidebar';
import Navbar from '../Dashboard/components/Navbar';
import { useDashboard } from '../Dashboard/hooks/useDashboard';
import { useHero } from './hooks/useHero';
import ImageUploader from '../../components/ImageUploader';
import ConfirmModal from '../../components/ConfirmModal';
import { FORM_LIMITS } from '../../utils/formLimits';
import { Edit2, Trash2, Save, X, Plus } from 'lucide-react';
import { uploadService } from '../../services/upload.service';

const HeroManagement = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu } = useDashboard();
  const { heroes, isLoading, isFetching, handleUpdate, createHero, deleteHero } = useHero();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newFile, setNewFile] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const startAdd = () => {
    setEditData({ title: '', description: '', image_url: '' });
    setNewFile(null);
    setIsAddModalOpen(true);
  };

  const cancelAdd = () => {
    setIsAddModalOpen(false);
    setEditData({});
    setNewFile(null);
  };

  const onSaveNew = async () => {
    if (!editData.title || !editData.description || !newFile) {
      toast.error('Lütfen fotoğraf, başlık ve açıklama alanlarını doldurun.');
      return;
    }
    let imageUrl = '';
    if (newFile) {
       try {
         const res = await uploadService.uploadFiles([newFile], 'home_hero');
         if(res && res.success && res.data.length > 0) {
            imageUrl = res.data[0];
         }
       } catch(err) {
         console.error(err);
       }
    }
    
    const success = await createHero({ ...editData, image_url: imageUrl });
    if (success) {
      setIsAddModalOpen(false);
      setEditData({});
      setNewFile(null);
    }
  };

  const startEdit = (hero) => {
    setEditingId(hero.id);
    setEditData({...hero});
    setNewFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setNewFile(null);
  };

  const onSave = async (id) => {
    if (!editData.title || !editData.description || (!editData.image_url && !newFile)) {
      toast.error('Lütfen fotoğraf, başlık ve açıklama alanlarını doldurun.');
      return;
    }
    let imageUrl = editData.image_url;
    if (newFile) {
       try {
         const res = await uploadService.uploadFiles([newFile], 'home_hero');
         if(res && res.success && res.data.length > 0) {
            imageUrl = res.data[0];
         }
       } catch(err) {
         console.error(err);
       }
    }
    
    await handleUpdate(id, { ...editData, image_url: imageUrl });
    setEditingId(null);
    setNewFile(null);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteHero(deleteId);
      setDeleteId(null);
    }
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
              <h1 className="text-3xl font-bold text-white tracking-tight">Hero Yönetimi</h1>
              <p className="text-slate-500 mt-2">Maksimum {FORM_LIMITS.hero.maxItems} slayt eklenebilir. ({heroes.length}/{FORM_LIMITS.hero.maxItems})</p>
            </div>
            {heroes.length < FORM_LIMITS.hero.maxItems && (
              <button 
                onClick={startAdd}
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#C5A059] hover:bg-[#A68045] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-[#C5A059]/10 disabled:opacity-50"
              >
                <Plus size={18} />
                Yeni Slayt Ekle
              </button>
            )}
          </header>

          <div className="grid grid-cols-1 gap-8">
            {isFetching ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <div className="w-10 h-10 border-4 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin mb-4" />
                <p>Slaytlar yükleniyor...</p>
              </div>
            ) : heroes.map((hero) => (
              <div key={hero.id} className="bg-[#1E293B]/30 border border-white/5 rounded-3xl overflow-hidden group">
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="lg:w-1/3 relative overflow-hidden bg-black flex flex-col justify-center">
                    {editingId === hero.id ? (
                      <div className="p-6 h-full border-r border-white/5 space-y-4 overflow-y-auto">
                        <div className="flex justify-between items-center px-1">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Slayt Fotoğrafı</label>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                           {editData.image_url ? (
                              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                                 <img src={editData.image_url} className="w-full h-full object-cover" alt="preview" />
                                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                    <button onClick={() => {
                                       setNewFile(null);
                                       setEditData({...editData, image_url: ''});
                                    }} className="p-1.5 bg-rose-500 text-white rounded-lg hover:scale-110 transition-transform">
                                      <X size={14} />
                                    </button>
                                 </div>
                              </div>
                           ) : (
                              <div className="col-span-1 mt-2">
                                 <ImageUploader 
                                    maxFileSize={2} 
                                    multiple={false}
                                    idealResolution={{ width: 1920, height: 1080 }} 
                                    label="Fotoğraf Seç"
                                    onChange={(files) => {
                                       if(files && files.length > 0) {
                                         setNewFile(files[0]);
                                         setEditData({...editData, image_url: files[0].preview});
                                       }
                                    }}
                                 />
                              </div>
                           )}
                        </div>
                      </div>
                    ) : (
                      hero.image_url ? (
                         <img 
                           src={hero.image_url} 
                           alt={hero.title} 
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                         />
                      ) : (
                         <span className="text-slate-500 text-sm">Resim Bulunamadı</span>
                      )
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-8">
                    {editingId === hero.id ? (
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Başlık</label>
                             <span className={`text-[10px] font-bold ${editData.title.length >= FORM_LIMITS.hero.title ? 'text-rose-500' : 'text-slate-600'}`}>{editData.title.length}/{FORM_LIMITS.hero.title}</span>
                          </div>
                          <input 
                            type="text" 
                            maxLength={FORM_LIMITS.hero.title}
                            value={editData.title}
                            onChange={(e) => setEditData({...editData, title: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Açıklama</label>
                             <span className={`text-[10px] font-bold ${editData.description.length >= FORM_LIMITS.hero.description ? 'text-rose-500' : 'text-slate-600'}`}>{editData.description.length}/{FORM_LIMITS.hero.description}</span>
                          </div>
                          <textarea 
                            value={editData.description}
                            maxLength={FORM_LIMITS.hero.description}
                            onChange={(e) => setEditData({...editData, description: e.target.value})}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all resize-none"
                          />
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                          <button 
                            disabled={isLoading}
                            onClick={() => onSave(hero.id)}
                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                            <Save size={18} />
                          </button>
                          <button 
                            onClick={cancelEdit}
                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
                          >
                            İptal
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-4 italic tracking-tight">{hero.title}</h3>
                          <p className="text-slate-400 leading-relaxed">{hero.description}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-8">
                          <button 
                            onClick={() => startEdit(hero)}
                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border border-white/5"
                          >
                            <Edit2 size={18} className="text-[#C5A059]" />
                            Düzenle
                          </button>
                          <button 
                            onClick={() => setDeleteId(hero.id)}
                            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border border-rose-500/10"
                          >
                            <Trash2 size={18} />
                            Sil
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {isAddModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!isLoading ? cancelAdd : undefined} />
              <div className="relative w-full max-w-2xl bg-[#0F172A] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-white/5">
                  <h3 className="text-xl font-bold text-white">Yeni Slayt Ekle</h3>
                  <button onClick={cancelAdd} className="text-slate-500 hover:text-white transition-colors cursor-pointer"><X size={24} /></button>
                </div>
                
                <div className="flex flex-col sm:flex-row h-full max-h-[80vh] overflow-y-auto">
                  <div className="lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-white/5 space-y-4">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Slayt Fotoğrafı</label>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                       {editData.image_url ? (
                          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                             <img src={editData.image_url} className="w-full h-full object-cover" alt="preview" />
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                <button onClick={() => {
                                   setNewFile(null);
                                   setEditData({...editData, image_url: ''});
                                }} className="p-1.5 bg-rose-500 text-white rounded-lg hover:scale-110 transition-transform">
                                  <X size={14} />
                                </button>
                             </div>
                          </div>
                       ) : (
                          <div className="col-span-1 mt-2">
                             <ImageUploader 
                                maxFileSize={2} 
                                multiple={false}
                                idealResolution={{ width: 1920, height: 1080 }} 
                                label="Fotoğraf Seç"
                                onChange={(files) => {
                                   if(files && files.length > 0) {
                                     setNewFile(files[0]);
                                     setEditData({...editData, image_url: files[0].preview});
                                   }
                                }}
                             />
                          </div>
                       )}
                    </div>
                  </div>

                  <div className="flex-1 p-8 flex flex-col space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <div className="flex justify-between items-center mb-2 px-1">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Başlık</label>
                           <span className={`text-[9px] font-bold ${(editData.title?.length || 0) >= FORM_LIMITS.hero.title ? 'text-rose-500' : 'text-slate-600'}`}>{(editData.title?.length || 0)}/{FORM_LIMITS.hero.title}</span>
                        </div>
                        <input 
                          type="text" 
                          maxLength={FORM_LIMITS.hero.title}
                          value={editData.title || ''}
                          onChange={(e) => setEditData({...editData, title: e.target.value})}
                          className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all"
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="flex justify-between items-center mb-2 px-1">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Açıklama</label>
                           <span className={`text-[9px] font-bold ${(editData.description?.length || 0) >= FORM_LIMITS.hero.description ? 'text-rose-500' : 'text-slate-600'}`}>{(editData.description?.length || 0)}/{FORM_LIMITS.hero.description}</span>
                        </div>
                        <textarea 
                          value={editData.description || ''}
                          maxLength={FORM_LIMITS.hero.description}
                          onChange={(e) => setEditData({...editData, description: e.target.value})}
                          rows={4}
                          className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all resize-none text-sm leading-relaxed"
                        />
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-white/5">
                      <button 
                        disabled={isLoading}
                        onClick={onSaveNew}
                        className="w-full flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-[#A68045] text-white py-3 px-8 rounded-2xl text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#C5A059]/10"
                      >
                        <Save size={18} />
                        {isLoading ? 'Ekleniyor...' : 'Slaytı Ekle'}
                      </button>
                    </div>
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
            title="Slaytı Sil"
            message="Bu slaytı silmek istediğinize emin misiniz?"
          />
        </main>
      </div>
    </div>
  );
};

export default HeroManagement;
