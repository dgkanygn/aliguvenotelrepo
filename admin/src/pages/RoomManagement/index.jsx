import React, { useState } from 'react';
import Sidebar from '../Dashboard/components/Sidebar';
import Navbar from '../Dashboard/components/Navbar';
import { useDashboard } from '../Dashboard/hooks/useDashboard';
import { useRooms } from './hooks/useRooms';
import ImageUploader from '../../components/ImageUploader';
import { FORM_LIMITS } from '../../utils/formLimits';
import { Edit2, Trash2, Plus, Save, X, Bed, Check, Info, LayoutGrid } from 'lucide-react';

const RoomManagement = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu } = useDashboard();
  const { rooms, isLoading, handleUpdate, addRoom, deleteRoom } = useRooms();
  
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newAmenity, setNewAmenity] = useState('');

  const startEdit = (room) => {
    setEditingId(room.id);
    setEditData({ ...room });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setNewAmenity('');
  };

  const onSave = async (id) => {
    await handleUpdate(id, editData);
    setEditingId(null);
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
                onClick={addRoom}
                className="flex items-center gap-2 bg-[#C5A059] hover:bg-[#A68045] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-[#C5A059]/10"
              >
                <Plus size={18} />
                Yeni Oda Ekle
              </button>
            )}
          </header>

          <div className="space-y-8">
            {rooms.map((room) => (
              <div key={room.id} className="bg-[#1E293B]/30 border border-white/5 rounded-[32px] overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Images Section */}
                  <div className="lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-white/5 space-y-4">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Oda Fotoğrafları</label>
                       <span className={`text-[9px] font-bold ${room.images.length >= FORM_LIMITS.rooms.maxPhotos ? 'text-rose-500' : 'text-slate-600'}`}>{room.images.length}/{FORM_LIMITS.rooms.maxPhotos}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {room.images.map((img) => (
                        <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                          <img src={img.url} className="w-full h-full object-cover" alt="room" />
                          {img.is_main && (
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#C5A059] text-white text-[8px] font-bold rounded uppercase">Kapak</div>
                          )}
                        </div>
                      ))}
                      {editingId === room.id && room.images.length < FORM_LIMITS.rooms.maxPhotos && (
                        <div className="col-span-2 mt-2">
                           <ImageUploader multiple={true} maxFileSize={2} label="Fotoğraf Ekle" />
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
                              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all resize-none leading-relaxed"
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
                                onClick={() => deleteRoom(room.id)}
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
        </main>
      </div>
    </div>
  );
};

export default RoomManagement;
