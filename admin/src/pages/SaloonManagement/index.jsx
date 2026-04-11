import React, { useState } from 'react';
import Sidebar from '../Dashboard/components/Sidebar';
import Navbar from '../Dashboard/components/Navbar';
import { useDashboard } from '../Dashboard/hooks/useDashboard';
import { useSaloons } from './hooks/useSaloons';
import ImageUploader from '../../components/ImageUploader';
import ConfirmModal from '../../components/ConfirmModal';
import { FORM_LIMITS } from '../../utils/formLimits';
import { Edit2, Trash2, Plus, Save, X, Check, LayoutGrid, Star } from 'lucide-react';
import { uploadService } from '../../services/upload.service';

const SaloonManagement = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu } = useDashboard();
  const { saloons, isLoading, isFetching, handleUpdate, addSaloon, deleteSaloon } = useSaloons();
  
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newAmenity, setNewAmenity] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [newFiles, setNewFiles] = useState([]);

  const startEdit = (saloon) => {
    setEditingId(saloon.id);
    setEditData({ ...saloon, images: saloon.images || [] });
    setNewFiles([]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setNewAmenity('');
    setNewFiles([]);
  };

  const removeExistingImage = (index) => {
    const updatedImages = [...editData.images];
    updatedImages.splice(index, 1);
    setEditData({ ...editData, images: updatedImages });
  };

  const setMainImage = (index) => {
    const updatedImages = editData.images.map((img, i) => ({
      ...img,
      is_main: i === index ? 1 : 0
    }));
    setEditData({ ...editData, images: updatedImages });
  };

  const onSave = async (id) => {
    let uploadedUrls = [];
    if(newFiles && newFiles.length > 0) {
      try {
        const res = await uploadService.uploadFiles(newFiles, 'saloons');
        if(res && res.success) {
          uploadedUrls = res.data;
        }
      } catch (err) {
         console.error(err);
      }
    }

    const payloadImages = [
      ...(editData.images || []).map(img => ({ image_url: img.image_url, is_main: img.is_main })),
      ...uploadedUrls.map((url, i) => ({ image_url: url, is_main: (editData.images.length === 0 && i === 0) ? 1 : 0 }))
    ];

    if (payloadImages.length > 0 && !payloadImages.find(img => img.is_main == 1)) {
        payloadImages[0].is_main = 1;
    }

    await handleUpdate(id, { ...editData, images: payloadImages });
    setEditingId(null);
    setNewFiles([]);
  };

  const addAmenity = () => {
    if (!newAmenity.trim()) return;
    setEditData({
      ...editData,
      amenities: [...editData.amenities, newAmenity.trim()]
    });
    setNewAmenity('');
  };

  const removeAmenity = (index) => {
    const updated = [...editData.amenities];
    updated.splice(index, 1);
    setEditData({ ...editData, amenities: updated });
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteSaloon(deleteId);
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
              <p className="text-[#C5A059] font-bold text-xs uppercase tracking-[3px] mb-2">Organizasyon</p>
              <h1 className="text-3xl font-bold text-white tracking-tight">Salon Yönetimi</h1>
              <p className="text-slate-500 mt-2">Maksimum {FORM_LIMITS.saloons.maxItems} salon eklenebilir. ({saloons.length}/{FORM_LIMITS.saloons.maxItems})</p>
            </div>
            {saloons.length < FORM_LIMITS.saloons.maxItems && (
              <button 
                onClick={addSaloon}
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#C5A059] hover:bg-[#A68045] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-[#C5A059]/10 disabled:opacity-50"
              >
                <Plus size={18} />
                Yeni Salon Ekle
              </button>
            )}
          </header>

          <div className="space-y-8">
            {isFetching ? (
               <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                  <div className="w-10 h-10 border-4 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin mb-4" />
                  <p>Salonlar yükleniyor...</p>
               </div>
            ) : saloons.map((saloon) => (
              <div key={saloon.id} className="bg-[#1E293B]/30 border border-white/5 rounded-[32px] overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Images Section */}
                  <div className="lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-white/5 space-y-4">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Salon Fotoğrafları</label>
                       <span className={`text-[9px] font-bold ${((editingId === saloon.id ? editData.images?.length : saloon.images?.length) || 0) + newFiles.length >= FORM_LIMITS.saloons.maxPhotos ? 'text-rose-500' : 'text-slate-600'}`}>{((editingId === saloon.id ? editData.images?.length : saloon.images?.length) || 0) + newFiles.length}/{FORM_LIMITS.saloons.maxPhotos}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {(editingId === saloon.id ? editData.images : saloon.images)?.map((img, idx) => (
                        <div key={img.id || idx} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                          <img src={img.image_url} className="w-full h-full object-cover" alt="saloon" />
                          <div className={`absolute inset-0 bg-black/50 opacity-0 ${editingId === saloon.id ? 'group-hover:opacity-100' : ''} transition-opacity flex flex-col items-center justify-center gap-2`}>
                            {editingId === saloon.id && (
                              <>
                                <button onClick={() => setMainImage(idx)} className="p-1.5 bg-[#C5A059] text-white rounded-lg hover:scale-110 transition-transform">
                                  <Star size={14} fill={img.is_main == 1 ? "currentColor" : "none"} />
                                </button>
                                <button onClick={() => removeExistingImage(idx)} className="p-1.5 bg-rose-500 text-white rounded-lg hover:scale-110 transition-transform">
                                  <X size={14} />
                                </button>
                              </>
                            )}
                          </div>
                          {img.is_main == 1 && (
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#C5A059] text-white text-[8px] font-bold rounded uppercase">Kapak</div>
                          )}
                        </div>
                      ))}
                      {editingId === saloon.id && ((editData.images?.length || 0) + newFiles.length) < FORM_LIMITS.saloons.maxPhotos && (
                        <div className="col-span-2 mt-2">
                           <ImageUploader 
                              multiple={true} 
                              maxFileSize={2} 
                              label="Fotoğraf Ekle" 
                              onChange={(files) => setNewFiles(files)}
                           />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-8">
                    {editingId === saloon.id ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="col-span-2">
                            <div className="flex justify-between items-center mb-2 px-1">
                               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Salon Başlığı</label>
                               <span className={`text-[9px] font-bold ${editData.title.length >= FORM_LIMITS.saloons.title ? 'text-rose-500' : 'text-slate-600'}`}>{editData.title.length}/{FORM_LIMITS.saloons.title}</span>
                            </div>
                            <input 
                              type="text" 
                              maxLength={FORM_LIMITS.saloons.title}
                              value={editData.title}
                              onChange={(e) => setEditData({...editData, title: e.target.value})}
                              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all"
                            />
                          </div>
                          
                          <div className="col-span-2">
                             <div className="flex justify-between items-center mb-2 px-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Açıklama</label>
                                <span className={`text-[9px] font-bold ${editData.description.length >= FORM_LIMITS.saloons.description ? 'text-rose-500' : 'text-slate-600'}`}>{editData.description.length}/{FORM_LIMITS.saloons.description}</span>
                             </div>
                            <textarea 
                              value={editData.description}
                              maxLength={FORM_LIMITS.saloons.description}
                              onChange={(e) => setEditData({...editData, description: e.target.value})}
                              rows={3}
                              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all resize-none leading-relaxed text-sm"
                            />
                          </div>

                          <div className="col-span-2">
                            <div className="flex justify-between items-center mb-2 px-1">
                               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Salon Özellikleri (Max {FORM_LIMITS.saloons.maxAmenities})</label>
                               <span className={`text-[9px] font-bold ${editData.amenities.length >= FORM_LIMITS.saloons.maxAmenities ? 'text-rose-500' : 'text-slate-600'}`}>{editData.amenities.length}/{FORM_LIMITS.saloons.maxAmenities}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                               {editData.amenities.map((amenity, idx) => (
                                 <div key={idx} className="flex items-center gap-2 bg-[#C5A059]/10 text-[#C5A059] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#C5A059]/20">
                                   {amenity}
                                   <button onClick={() => removeAmenity(idx)} className="hover:text-white"><X size={14} /></button>
                                 </div>
                               ))}
                            </div>
                            {editData.amenities.length < FORM_LIMITS.saloons.maxAmenities && (
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={newAmenity}
                                  onChange={(e) => setNewAmenity(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
                                  placeholder="Örn: Profesyonel Ses Sistemi"
                                  className="flex-1 bg-[#0F172A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                                />
                                <button 
                                  onClick={addAmenity}
                                  className="bg-white/5 hover:bg-white/10 text-white px-4 rounded-xl transition-all"
                                >
                                  <Plus size={18} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                          <button 
                            disabled={isLoading}
                            onClick={() => onSave(saloon.id)}
                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-2xl text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-500/10"
                          >
                            <Save size={18} />
                            {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                          </button>
                          <button 
                            onClick={cancelEdit}
                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer"
                          >
                            İptal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <h2 className="text-2xl font-bold text-white mb-2">{saloon.title}</h2>
                              <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">{saloon.description}</p>
                           </div>
                           <div className="flex gap-2">
                              <button 
                                onClick={() => startEdit(saloon)}
                                className="p-3 bg-white/5 hover:bg-white/10 text-[#C5A059] rounded-2xl transition-all border border-white/5 cursor-pointer"
                              >
                                <Edit2 size={20} />
                              </button>
                              <button 
                                onClick={() => setDeleteId(saloon.id)}
                                className="p-3 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 rounded-2xl transition-all border border-rose-500/5 cursor-pointer"
                              >
                                <Trash2 size={20} />
                              </button>
                           </div>
                        </div>

                        <div className="mt-6">
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Salon Olanakları</p>
                           <div className="flex flex-wrap gap-2">
                              {saloon.amenities.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-white/5 text-slate-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/5">
                                  <Check size={12} className="text-[#C5A059]" />
                                  {item}
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <ConfirmModal 
            isOpen={!!deleteId}
            onClose={() => setDeleteId(null)}
            onConfirm={confirmDelete}
            isLoading={isLoading}
            title="Salonu Sil"
            message="Bu salonu silmek istediğinize emin misiniz?"
          />
        </main>
      </div>
    </div>
  );
};

export default SaloonManagement;
