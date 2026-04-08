import React, { useState } from 'react';
import Sidebar from '../Dashboard/components/Sidebar';
import Navbar from '../Dashboard/components/Navbar';
import { useDashboard } from '../Dashboard/hooks/useDashboard';
import { useRestaurant } from './hooks/useRestaurant';
import ImageUploader from '../../components/ImageUploader';
import { FORM_LIMITS } from '../../utils/formLimits';
import { Save, Utensils, FileText, AlertTriangle, FileDown, Trash2 } from 'lucide-react';

const RestaurantManagement = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu } = useDashboard();
  const { info, images, isLoading, updateInfo, removeImage } = useRestaurant();
  const [formData, setFormData] = useState(info);

  const onSave = async () => {
    await updateInfo(formData);
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
              <p className="text-[#C5A059] font-bold text-xs uppercase tracking-[3px] mb-2">Gastronomi</p>
              <h1 className="text-3xl font-bold text-white tracking-tight">Restoran Yönetimi</h1>
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
            {/* General Info */}
            <div className="space-y-8">
               <div className="bg-[#1E293B]/30 border border-white/5 rounded-3xl p-8 space-y-6">
                 <h3 className="text-white font-bold flex items-center gap-2 mb-2">
                   <FileText size={20} className="text-[#C5A059]" />
                   Genel Bilgiler
                 </h3>
                 
                 <div>
                    <div className="flex justify-between items-center mb-2 px-1">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Giriş Metni</label>
                       <span className={`text-[9px] font-bold ${formData.intro_text.length >= FORM_LIMITS.restaurant.intro_text ? 'text-rose-500' : 'text-slate-600'}`}>{formData.intro_text.length}/{FORM_LIMITS.restaurant.intro_text}</span>
                    </div>
                    <textarea 
                      value={formData.intro_text}
                      maxLength={FORM_LIMITS.restaurant.intro_text}
                      onChange={(e) => setFormData({...formData, intro_text: e.target.value})}
                      rows={6}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#C5A059] transition-all resize-none leading-relaxed"
                    />
                 </div>

                 <div>
                    <div className="flex justify-between items-center mb-2 px-1">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-rose-400">Uyarı / Önemli Not</label>
                       <span className={`text-[9px] font-bold ${formData.warning_text.length >= FORM_LIMITS.restaurant.warning_text ? 'text-rose-500' : 'text-rose-400/60'}`}>{formData.warning_text.length}/{FORM_LIMITS.restaurant.warning_text}</span>
                    </div>
                    <div className="relative">
                       <AlertTriangle size={16} className="absolute left-4 top-4 text-rose-500" />
                       <textarea 
                        value={formData.warning_text}
                        maxLength={FORM_LIMITS.restaurant.warning_text}
                        onChange={(e) => setFormData({...formData, warning_text: e.target.value})}
                        rows={3}
                        className="w-full bg-rose-500/5 border border-rose-500/20 rounded-2xl pl-12 pr-5 py-4 text-rose-200 focus:outline-none focus:border-rose-500/50 transition-all resize-none text-sm"
                      />
                    </div>
                 </div>

                 <div className="pt-4 border-t border-white/5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">Menü PDF Dosyası (URL)</label>
                    <div className="flex gap-3">
                       <div className="flex-1 relative">
                          <FileDown size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input 
                            type="text" 
                            value={formData.menu_pdf_url}
                            onChange={(e) => setFormData({...formData, menu_pdf_url: e.target.value})}
                            className="w-full bg-[#0F172A] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-sm focus:outline-none border-dashed"
                          />
                       </div>
                    </div>
                 </div>
               </div>
            </div>

            {/* Images */}
            <div className="space-y-8">
               <div className="bg-[#1E293B]/30 border border-white/5 rounded-3xl p-8 space-y-6">
                 <div className="flex justify-between items-center mb-2">
                   <h3 className="text-white font-bold flex items-center gap-2">
                     <Utensils size={20} className="text-[#C5A059]" />
                     Restoran Görselleri
                   </h3>
                   <span className={`text-[9px] font-bold ${images.length >= FORM_LIMITS.restaurant.maxPhotos ? 'text-rose-500' : 'text-slate-600'}`}>{images.length}/{FORM_LIMITS.restaurant.maxPhotos}</span>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    {images.map((img) => (
                      <div key={img.id} className="relative aspect-video rounded-2xl overflow-hidden group border border-white/10">
                        <img src={img.url} alt="restaurant" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button 
                            onClick={() => removeImage(img.id)}
                            className="p-2.5 bg-rose-500 text-white rounded-xl hover:scale-110 transition-transform cursor-pointer"
                           >
                             <Trash2 size={18} />
                           </button>
                        </div>
                      </div>
                    ))}
                 </div>

                 <div className="pt-4 border-t border-white/5">
                    {images.length < FORM_LIMITS.restaurant.maxPhotos && (
                      <ImageUploader multiple={true} maxFileSize={2} label="Yeni Görsel Yükle" />
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

export default RestaurantManagement;
