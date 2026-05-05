import React, { useState } from 'react';
import Sidebar from '../Dashboard/components/Sidebar';
import Navbar from '../Dashboard/components/Navbar';
import { useDashboard } from '../Dashboard/hooks/useDashboard';
import { useEvents } from './hooks/useEvents';
import ImageUploader from '../../components/ImageUploader';
import { FORM_LIMITS } from '../../utils/formLimits';
import { Save, Heart, Video, Type, Check, Plus, X, Trash2 } from 'lucide-react';

const EventManagement = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu } = useDashboard();
  const { data, images, isLoading, handleUpdate } = useEvents();
  const [formData, setFormData] = useState(data);
  const [newAmenity, setNewAmenity] = useState('');

  const onSave = async () => {
    await handleUpdate(formData);
  };

  const addAmenity = () => {
    if (!newAmenity.trim()) return;
    setFormData({ ...formData, amenities: [...formData.amenities, newAmenity.trim()] });
    setNewAmenity('');
  };

  const removeAmenity = (index) => {
    const updated = [...formData.amenities];
    updated.splice(index, 1);
    setFormData({ ...formData, amenities: updated });
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
              <h1 className="text-3xl font-bold text-white tracking-tight">Düğün & Etkinlik Geliştirme</h1>
            </div>
            <button
              onClick={onSave}
              disabled={isLoading}
              className="flex items-center gap-2 bg-[#C5A059] hover:bg-[#A68045] disabled:opacity-50 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-[#C5A059]/10"
            >
              {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              {!isLoading && <Save size={18} />}
            </button>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {/* Detailed Content */}
            <div className="space-y-8">
              <div className="bg-[#1E293B]/30 border border-white/5 rounded-[32px] p-8 space-y-6">
                <h3 className="text-white font-bold flex items-center gap-2 mb-2 italic">
                  <Heart size={20} className="text-[#C5A059]" />
                  Mekan & Hizmet Bilgileri
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1 px-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Giriş Paragrafı</label>
                      <span className={`text-[9px] font-bold ${formData.intro_text.length >= FORM_LIMITS.events.intro_text ? 'text-rose-500' : 'text-slate-600'}`}>{formData.intro_text.length}/{FORM_LIMITS.events.intro_text}</span>
                    </div>
                    <textarea
                      value={formData.intro_text}
                      maxLength={FORM_LIMITS.events.intro_text}
                      onChange={(e) => setFormData({ ...formData, intro_text: e.target.value })}
                      rows={3}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#C5A059] transition-all resize-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-1 px-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hizmet Başlığı</label>
                        <span className={`text-[9px] font-bold ${formData.title.length >= FORM_LIMITS.events.title ? 'text-rose-500' : 'text-slate-600'}`}>{formData.title.length}/{FORM_LIMITS.events.title}</span>
                      </div>
                      <div className="relative">
                        <Type size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          maxLength={FORM_LIMITS.events.title}
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full bg-[#0F172A] border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white text-sm focus:outline-none border-dashed"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1 px-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tanıtım Videosu (URL)</label>
                        <span className={`text-[9px] font-bold ${formData.video_url.length >= FORM_LIMITS.events.video_url ? 'text-rose-500' : 'text-slate-600'}`}>{formData.video_url.length}/{FORM_LIMITS.events.video_url}</span>
                      </div>
                      <div className="relative">
                        <Video size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          maxLength={FORM_LIMITS.events.video_url}
                          value={formData.video_url}
                          onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                          className="w-full bg-[#0F172A] border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white text-sm focus:outline-none border-dashed placeholder:text-slate-700"
                          placeholder="Youtube linki..."
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1 px-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Detaylı Açıklama</label>
                      <span className={`text-[9px] font-bold ${formData.description.length >= FORM_LIMITS.events.description ? 'text-rose-500' : 'text-slate-600'}`}>{formData.description.length}/{FORM_LIMITS.events.description}</span>
                    </div>
                    <textarea
                      value={formData.description}
                      maxLength={FORM_LIMITS.events.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={6}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#C5A059] transition-all resize-none leading-relaxed text-sm"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3 px-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hizmet Detayları / Olanaklar</label>
                      <span className={`text-[9px] font-bold ${formData.amenities.length >= FORM_LIMITS.events.maxAmenities ? 'text-rose-500' : 'text-slate-600'}`}>{formData.amenities.length}/{FORM_LIMITS.events.maxAmenities}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.amenities.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold border border-emerald-500/10">
                          <Check size={12} />
                          {item}
                          <button onClick={() => removeAmenity(idx)} className="ml-1 hover:text-white"><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                    {formData.amenities.length < FORM_LIMITS.events.maxAmenities && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newAmenity}
                          onChange={(e) => setNewAmenity(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
                          placeholder="Yeni özellik ekle (Örn: Catering hizmeti)"
                          className="flex-1 bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                        />
                        <button onClick={addAmenity} className="bg-white/5 hover:bg-white/10 text-white px-5 rounded-xl transition-all border border-white/5">
                          <Plus size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="space-y-8">
              <div className="bg-[#1E293B]/30 border border-white/5 rounded-[32px] p-8 space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-bold flex items-center gap-2 mb-2 italic">
                    Görsel Galerisi
                  </h3>
                  <span className={`text-[9px] font-bold ${images.length >= FORM_LIMITS.events.maxPhotos ? 'text-rose-500' : 'text-slate-600'}`}>{images.length}/{FORM_LIMITS.events.maxPhotos}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 group">
                      <img src={img.url} className="w-full h-full object-cover" alt="event" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="p-3 bg-rose-500 text-white rounded-2xl hover:scale-110 transition-transform cursor-pointer">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5">
                  {images.length < FORM_LIMITS.events.maxPhotos && (
                    <ImageUploader multiple={true} maxFileSize={10} label="Galeriye Fotoğraf Ekle" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventManagement;
