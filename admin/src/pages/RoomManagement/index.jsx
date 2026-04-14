import React, { useState } from 'react';
import Sidebar from '../Dashboard/components/Sidebar';
import Navbar from '../Dashboard/components/Navbar';
import { useDashboard } from '../Dashboard/hooks/useDashboard';
import { useRooms } from './hooks/useRooms';
import ImageUploader from '../../components/ImageUploader';
import ConfirmModal from '../../components/ConfirmModal';
import { FORM_LIMITS } from '../../utils/formLimits';
import { Edit2, Trash2, Plus, Save, X, Bed, Check, LayoutGrid, Star } from 'lucide-react';
import { uploadService } from '../../services/upload.service';

const RoomManagement = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu } = useDashboard();
  const { rooms, isLoading, isFetching, handleUpdate, createRoom, deleteRoom } = useRooms();
  
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newAmenity, setNewAmenity] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [newFiles, setNewFiles] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const startAdd = () => {
    setEditData({ title: '', description: '', amenities: [], images: [] });
    setNewFiles([]);
    setNewAmenity('');
    setIsAddModalOpen(true);
  };

  const cancelAdd = () => {
    setIsAddModalOpen(false);
    setEditData({});
    setNewAmenity('');
    setNewFiles([]);
  };

  const onSaveNew = async () => {
    let uploadedUrls = [];
    if(newFiles && newFiles.length > 0) {
      try {
        const res = await uploadService.uploadFiles(newFiles, 'rooms');
        if(res && res.success) {
          uploadedUrls = res.data;
        }
      } catch (err) {
         console.error(err);
      }
    }

    const payloadImages = uploadedUrls.map((url, i) => ({ image_url: url, is_main: i === 0 ? 1 : 0 }));
    
    const success = await createRoom({ ...editData, images: payloadImages });
    if (success) {
      setIsAddModalOpen(false);
      setEditData({});
      setNewFiles([]);
      setNewAmenity('');
    }
  };

  const startEdit = (room) => {
    setEditingId(room.id);
    setEditData({ ...room, images: room.images || [] });
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
        const res = await uploadService.uploadFiles(newFiles, 'rooms');
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
      await deleteRoom(deleteId);
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
              <p className="text-[#C5A059] font-bold text-xs uppercase tracking-[3px] mb-2">Konaklama</p>
              <h1 className="text-3xl font-bold text-white tracking-tight">Oda Yönetimi</h1>
              <p className="text-slate-500 mt-2">Maksimum {FORM_LIMITS.rooms.maxItems} oda tipi eklenebilir. ({rooms.length}/{FORM_LIMITS.rooms.maxItems})</p>
            </div>
            {rooms.length < FORM_LIMITS.rooms.maxItems && (
              <button 
                onClick={startAdd}
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#C5A059] hover:bg-[#A68045] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-[#C5A059]/10 disabled:opacity-50"
              >
                <Plus size={18} />
                Yeni Oda Ekle
              </button>
            )}
          </header>

          <div className="space-y-8">
            {isFetching ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <div className="w-10 h-10 border-4 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin mb-4" />
                <p>Odalar yükleniyor...</p>
              </div>
            ) : rooms.map((room) => (
              <div key={room.id} className="bg-[#1E293B]/30 border border-white/5 rounded-[32px] overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Images Section */}
                  <div className="lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-white/5 space-y-4">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Oda Fotoğrafları</label>
                       <span className={`text-[9px] font-bold ${((editingId === room.id ? editData.images?.length : room.images?.length) || 0) + newFiles.length >= FORM_LIMITS.rooms.maxPhotos ? 'text-rose-500' : 'text-slate-600'}`}>{((editingId === room.id ? editData.images?.length : room.images?.length) || 0) + newFiles.length}/{FORM_LIMITS.rooms.maxPhotos}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {(editingId === room.id ? editData.images : room.images)?.map((img, idx) => (
                        <div key={img.id || idx} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                          <img src={img.image_url} className="w-full h-full object-cover" alt="room" />
                          <div className={`absolute inset-0 bg-black/50 opacity-0 ${editingId === room.id ? 'group-hover:opacity-100' : ''} transition-opacity flex flex-col items-center justify-center gap-2`}>
                            {editingId === room.id && (
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
                      {editingId === room.id && ((editData.images?.length || 0) + newFiles.length) < FORM_LIMITS.rooms.maxPhotos && (
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
                    {editingId === room.id ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="col-span-2">
                            <div className="flex justify-between items-center mb-2 px-1">
                               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Oda Başlığı</label>
                               <span className={`text-[9px] font-bold ${editData.title.length >= FORM_LIMITS.rooms.title ? 'text-rose-500' : 'text-slate-600'}`}>{editData.title.length}/{FORM_LIMITS.rooms.title}</span>
                            </div>
                            <input 
                              type="text" 
                              maxLength={FORM_LIMITS.rooms.title}
                              value={editData.title}
                              onChange={(e) => setEditData({...editData, title: e.target.value})}
                              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all"
                            />
                          </div>
                          
                          <div className="col-span-2">
                             <div className="flex justify-between items-center mb-2 px-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Açıklama</label>
                                <span className={`text-[9px] font-bold ${editData.description.length >= FORM_LIMITS.rooms.description ? 'text-rose-500' : 'text-slate-600'}`}>{editData.description.length}/{FORM_LIMITS.rooms.description}</span>
                             </div>
                            <textarea 
                              value={editData.description}
                              maxLength={FORM_LIMITS.rooms.description}
                              onChange={(e) => setEditData({...editData, description: e.target.value})}
                              rows={3}
                              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all resize-none leading-relaxed text-sm"
                            />
                          </div>

                          <div className="col-span-2">
                            <div className="flex justify-between items-center mb-2 px-1">
                               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Oda Özellikleri (Max {FORM_LIMITS.rooms.maxAmenities})</label>
                               <span className={`text-[9px] font-bold ${editData.amenities.length >= FORM_LIMITS.rooms.maxAmenities ? 'text-rose-500' : 'text-slate-600'}`}>{editData.amenities.length}/{FORM_LIMITS.rooms.maxAmenities}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                               {editData.amenities.map((amenity, idx) => (
                                 <div key={idx} className="flex items-center gap-2 bg-[#C5A059]/10 text-[#C5A059] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#C5A059]/20">
                                   {amenity}
                                   <button onClick={() => removeAmenity(idx)} className="hover:text-white"><X size={14} /></button>
                                 </div>
                               ))}
                            </div>
                            {editData.amenities.length < FORM_LIMITS.rooms.maxAmenities && (
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={newAmenity}
                                  onChange={(e) => setNewAmenity(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
                                  placeholder="Örn: Klima"
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
                            onClick={() => onSave(room.id)}
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
                              <h2 className="text-2xl font-bold text-white mb-2">{room.title}</h2>
                              <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">{room.description}</p>
                           </div>
                           <div className="flex gap-2">
                              <button 
                                onClick={() => startEdit(room)}
                                className="p-3 bg-white/5 hover:bg-white/10 text-[#C5A059] rounded-2xl transition-all border border-white/5 cursor-pointer"
                              >
                                <Edit2 size={20} />
                              </button>
                              <button 
                                onClick={() => setDeleteId(room.id)}
                                className="p-3 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 rounded-2xl transition-all border border-rose-500/5 cursor-pointer"
                              >
                                <Trash2 size={20} />
                              </button>
                           </div>
                        </div>

                        <div className="mt-6">
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Oda Donanımları</p>
                           <div className="flex flex-wrap gap-2">
                              {room.amenities.map((item, idx) => (
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

          {isAddModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!isLoading ? cancelAdd : undefined} />
              <div className="relative w-full max-w-4xl bg-[#0F172A] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-white/5">
                  <h3 className="text-xl font-bold text-white">Yeni Oda Ekle</h3>
                  <button onClick={cancelAdd} className="text-slate-500 hover:text-white transition-colors cursor-pointer"><X size={24} /></button>
                </div>
                
                <div className="flex flex-col lg:flex-row max-h-[80vh] overflow-y-auto">
                  <div className="lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-white/5 space-y-4">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Oda Fotoğrafları</label>
                       <span className={`text-[9px] font-bold ${newFiles.length >= FORM_LIMITS.rooms.maxPhotos ? 'text-rose-500' : 'text-slate-600'}`}>{newFiles.length}/{FORM_LIMITS.rooms.maxPhotos}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {newFiles.map((file, idx) => (
                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                          <img src={file.preview} className="w-full h-full object-cover" alt="preview" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                             <button onClick={() => {
                                const newF = [...newFiles];
                                newF.splice(idx, 1);
                                setNewFiles(newF);
                             }} className="p-1.5 bg-rose-500 text-white rounded-lg hover:scale-110 transition-transform">
                               <X size={14} />
                             </button>
                          </div>
                          {idx === 0 && (
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#C5A059] text-white text-[8px] font-bold rounded uppercase">Kapak</div>
                          )}
                        </div>
                      ))}
                      {newFiles.length < FORM_LIMITS.rooms.maxPhotos && (
                        <div className="col-span-2 mt-2">
                           <ImageUploader 
                              multiple={true} 
                              maxFileSize={2} 
                              label="Fotoğraf Ekle" 
                              onChange={(files) => setNewFiles([...newFiles, ...files].slice(0, FORM_LIMITS.rooms.maxPhotos))}
                           />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 p-8">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="col-span-2">
                             <div className="flex justify-between items-center mb-2 px-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Oda Başlığı</label>
                                <span className={`text-[9px] font-bold ${(editData.title?.length || 0) >= FORM_LIMITS.rooms.title ? 'text-rose-500' : 'text-slate-600'}`}>{(editData.title?.length || 0)}/{FORM_LIMITS.rooms.title}</span>
                             </div>
                             <input 
                               type="text" 
                               maxLength={FORM_LIMITS.rooms.title}
                               value={editData.title || ''}
                               onChange={(e) => setEditData({...editData, title: e.target.value})}
                               className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all"
                             />
                           </div>
                           
                           <div className="col-span-2">
                              <div className="flex justify-between items-center mb-2 px-1">
                                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Açıklama</label>
                                 <span className={`text-[9px] font-bold ${(editData.description?.length || 0) >= FORM_LIMITS.rooms.description ? 'text-rose-500' : 'text-slate-600'}`}>{(editData.description?.length || 0)}/{FORM_LIMITS.rooms.description}</span>
                              </div>
                             <textarea 
                               value={editData.description || ''}
                               maxLength={FORM_LIMITS.rooms.description}
                               onChange={(e) => setEditData({...editData, description: e.target.value})}
                               rows={3}
                               className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all resize-none leading-relaxed text-sm"
                             />
                           </div>

                           <div className="col-span-2">
                             <div className="flex justify-between items-center mb-2 px-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Oda Özellikleri (Max {FORM_LIMITS.rooms.maxAmenities})</label>
                                <span className={`text-[9px] font-bold ${(editData.amenities?.length || 0) >= FORM_LIMITS.rooms.maxAmenities ? 'text-rose-500' : 'text-slate-600'}`}>{(editData.amenities?.length || 0)}/{FORM_LIMITS.rooms.maxAmenities}</span>
                             </div>
                             <div className="flex flex-wrap gap-2 mb-3">
                                {editData.amenities?.map((amenity, idx) => (
                                  <div key={idx} className="flex items-center gap-2 bg-[#C5A059]/10 text-[#C5A059] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#C5A059]/20">
                                    {amenity}
                                    <button onClick={() => {
                                        const newA = [...editData.amenities];
                                        newA.splice(idx, 1);
                                        setEditData({...editData, amenities: newA})
                                    }} className="hover:text-white"><X size={14} /></button>
                                  </div>
                                ))}
                             </div>
                             {(editData.amenities?.length || 0) < FORM_LIMITS.rooms.maxAmenities && (
                               <div className="flex gap-2">
                                 <input 
                                   type="text" 
                                   value={newAmenity}
                                   onChange={(e) => setNewAmenity(e.target.value)}
                                   onKeyPress={(e) => {
                                      if (e.key === 'Enter' && newAmenity.trim()) {
                                         setEditData({...editData, amenities: [...(editData.amenities || []), newAmenity.trim()]});
                                         setNewAmenity('');
                                      }
                                   }}
                                   placeholder="Örn: Klima"
                                   className="flex-1 bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                                 />
                                 <button 
                                   onClick={() => {
                                      if (newAmenity.trim()) {
                                         setEditData({...editData, amenities: [...(editData.amenities || []), newAmenity.trim()]});
                                         setNewAmenity('');
                                      }
                                   }}
                                   className="bg-white/5 hover:bg-white/10 text-white px-4 rounded-xl transition-all"
                                 >
                                   <Plus size={18} />
                                 </button>
                               </div>
                             )}
                           </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                          <button 
                            disabled={isLoading}
                            onClick={onSaveNew}
                            className="w-full flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-[#A68045] text-white px-8 py-3 rounded-2xl text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#C5A059]/10"
                          >
                            <Save size={18} />
                            {isLoading ? 'Ekleniyor...' : 'Odayı Ekle'}
                          </button>
                        </div>
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
            title="Odayı Sil"
            message="Bu oda tipini silmek istediğinize emin misiniz?"
          />
        </main>
      </div>
    </div>
  );
};

export default RoomManagement;
