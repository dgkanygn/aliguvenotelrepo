import React, { useState } from 'react';
import Sidebar from '../Dashboard/components/Sidebar';
import Navbar from '../Dashboard/components/Navbar';
import { useDashboard } from '../Dashboard/hooks/useDashboard';
import { useContact } from './hooks/useContact';
import { FORM_LIMITS } from '../../utils/formLimits';
import { Save, MapPin, Phone, Mail, Printer, Smartphone } from 'lucide-react';

const ContactManagement = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu } = useDashboard();
  const { contact, isLoading, handleUpdate } = useContact();
  const [formData, setFormData] = useState(contact);

  const onSave = async () => {
    await handleUpdate(formData);
  };

  const InputField = ({ label, icon: Icon, value, onChange, placeholder, isTextArea = false, maxLength }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
        {maxLength && (
          <span className={`text-[9px] font-bold ${value.length >= maxLength ? 'text-rose-500' : 'text-slate-600'}`}>{value.length}/{maxLength}</span>
        )}
      </div>
      <div className="relative">
        <div className="absolute left-5 top-4 text-[#C5A059]">
          <Icon size={18} />
        </div>
        {isTextArea ? (
           <textarea 
            value={value}
            maxLength={maxLength}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className="w-full bg-[#0F172A] border border-white/10 rounded-[24px] pl-14 pr-6 py-4 text-white focus:outline-none focus:border-[#C5A059] transition-all resize-none leading-relaxed"
          />
        ) : (
          <input 
            type="text" 
            value={value}
            maxLength={maxLength}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#0F172A] border border-white/10 rounded-full pl-14 pr-6 py-4 text-white focus:outline-none focus:border-[#C5A059] transition-all"
          />
        )}
      </div>
    </div>
  );

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
              <p className="text-[#C5A059] font-bold text-xs uppercase tracking-[3px] mb-2">İletişim</p>
              <h1 className="text-3xl font-bold text-white tracking-tight">İletişim Bilgileri</h1>
              <p className="text-slate-500 mt-2">Web sitesinde görüntülenen tüm iletişim kanallarını buradan yönetebilirsiniz.</p>
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

          <div className="max-w-4xl">
             <div className="bg-[#1E293B]/30 border border-white/5 rounded-[40px] p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="md:col-span-2">
                      <InputField 
                        label="Otel Adresi" 
                        icon={MapPin} 
                        value={formData.address} 
                        onChange={(val) => setFormData({...formData, address: val})}
                        maxLength={FORM_LIMITS.contact.address}
                        isTextArea={true}
                      />
                   </div>
                   
                   <InputField 
                    label="Sabit Telefon" 
                    icon={Phone} 
                    value={formData.landline_phone} 
                    onChange={(val) => setFormData({...formData, landline_phone: val})}
                    maxLength={FORM_LIMITS.contact.landline}
                    placeholder="0 (222) ..."
                  />
                  
                  <InputField 
                    label="Cep Telefonu" 
                    icon={Smartphone} 
                    value={formData.mobile_phone} 
                    onChange={(val) => setFormData({...formData, mobile_phone: val})}
                    maxLength={FORM_LIMITS.contact.mobile}
                    placeholder="0 550 ..."
                  />

                  <InputField 
                    label="E-posta Adresi" 
                    icon={Mail} 
                    value={formData.email} 
                    onChange={(val) => setFormData({...formData, email: val})}
                    maxLength={FORM_LIMITS.contact.email}
                    placeholder="bilgi@..."
                  />

                  <InputField 
                    label="Faks" 
                    icon={Printer} 
                    value={formData.fax} 
                    onChange={(val) => setFormData({...formData, fax: val})}
                    maxLength={FORM_LIMITS.contact.fax}
                    placeholder="0 (222) ..."
                  />
                </div>
                
                <div className="pt-8 border-t border-white/5">
                   <div className="bg-[#C5A059]/5 border border-[#C5A059]/10 p-6 rounded-3xl flex items-start gap-4">
                      <div className="p-3 bg-[#C5A059]/10 rounded-2xl text-[#C5A059]">
                         <MapPin size={24} />
                      </div>
                      <div>
                         <h4 className="text-white font-bold mb-1 italic">Harita Görünümü</h4>
                         <p className="text-slate-500 text-sm leading-relaxed">
                            Adres değişikliği web sitesindeki harita (Google Maps) işaretçisini otomatik olarak etkilemez. 
                            Harita koordinatları için lütfen teknik ekiple iletişime geçin.
                         </p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContactManagement;
