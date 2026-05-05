import React, { useState } from 'react';
import Sidebar from '../Dashboard/components/Sidebar';
import Navbar from '../Dashboard/components/Navbar';
import { useDashboard } from '../Dashboard/hooks/useDashboard';
import { useFounder } from './hooks/useFounder';
import ImageUploader from '../../components/ImageUploader';
import { FORM_LIMITS } from '../../utils/formLimits';
import { Save, User, FileText, Quote } from 'lucide-react';

const FounderManagement = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu } = useDashboard();
  const { founder, isLoading, handleUpdate } = useFounder();
  const [formData, setFormData] = useState(founder);

  const onSave = async () => {
    await handleUpdate(formData);
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
              <h1 className="text-3xl font-bold text-white tracking-tight">Kurucu Bilgisi</h1>
            </div>
            <button
              onClick={onSave}
              disabled={isLoading}
              className="flex items-center gap-2 bg-[#C5A059] hover:bg-[#A68045] disabled:opacity-50 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-[#C5A059]/10"
            >
              {isLoading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
              {!isLoading && <Save size={18} />}
            </button>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column: Image */}
            <div className="xl:col-span-1 space-y-6">
              <div className="bg-[#1E293B]/30 border border-white/5 rounded-3xl p-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Mevcut Fotoğraf</label>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 mb-6">
                  <img src={founder.image_url} alt="Founder" className="w-full h-full object-cover" />
                </div>
                <ImageUploader
                  maxFileSize={10}
                  idealResolution={{ width: 600, height: 800 }}
                  label="Fotoğrafı Güncelle"
                />
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="xl:col-span-2 space-y-8">
              <div className="bg-[#1E293B]/30 border border-white/5 rounded-3xl p-8 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-[#C5A059]" />
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Başlık / İsim</label>
                    </div>
                    <span className={`text-[10px] font-bold ${formData.title.length >= FORM_LIMITS.founder.title ? 'text-rose-500' : 'text-slate-600'}`}>{formData.title.length}/{FORM_LIMITS.founder.title}</span>
                  </div>
                  <input
                    type="text"
                    maxLength={FORM_LIMITS.founder.title}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#C5A059] transition-all font-medium text-lg"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={16} className="text-[#C5A059]" />
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hakkında (İçerik)</label>
                  </div>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#C5A059] transition-all resize-none leading-relaxed"
                  />
                  <p className="text-[10px] text-slate-500 mt-2">* HTML etiketleri (örn: &lt;br&gt;) kullanılabilir.</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Quote size={16} className="text-[#C5A059]" />
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Özel Metin / Not</label>
                    </div>
                    <span className={`text-[10px] font-bold ${formData.special_text.length >= FORM_LIMITS.founder.special_text ? 'text-rose-500' : 'text-slate-600'}`}>{formData.special_text.length}/{FORM_LIMITS.founder.special_text}</span>
                  </div>
                  <textarea
                    value={formData.special_text}
                    maxLength={FORM_LIMITS.founder.special_text}
                    onChange={(e) => setFormData({ ...formData, special_text: e.target.value })}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#C5A059] transition-all resize-none italic"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FounderManagement;
