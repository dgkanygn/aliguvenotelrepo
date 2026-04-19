import React, { useState } from 'react';
import Sidebar from '../Dashboard/components/Sidebar';
import Navbar from '../Dashboard/components/Navbar';
import { useDashboard } from '../Dashboard/hooks/useDashboard';
import { useContact } from './hooks/useContact';
import { FORM_LIMITS } from '../../utils/formLimits';
import { Save, MapPin, Phone, Mail, Printer, Smartphone, MessageCircle, Link as LinkIcon, Camera, Video, Share2, Globe } from 'lucide-react';

const InputField = ({ label, icon: Icon, value = "", onChange, placeholder, isTextArea = false, maxLength }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center px-1">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      {maxLength && (
        <span className={`text-[9px] font-bold ${(value?.length || 0) >= maxLength ? 'text-rose-500' : 'text-slate-600'}`}>{(value?.length || 0)}/{maxLength}</span>
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

const ContactManagement = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu } = useDashboard();
  const { contact, isLoading, handleUpdate } = useContact();
  const [formData, setFormData] = useState(contact);
  const hasChanges = contact && formData ? JSON.stringify(contact) !== JSON.stringify(formData) : false;

  // Sync formData with contact when contact changes (e.g. after fetch)
  React.useEffect(() => {
    setFormData(contact);
  }, [contact]);

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
              <p className="text-[#C5A059] font-bold text-xs uppercase tracking-[3px] mb-2">İletişim</p>
              <h1 className="text-3xl font-bold text-white tracking-tight">İletişim Bilgileri</h1>
              <p className="text-slate-500 mt-2">Web sitesinde görüntülenen tüm iletişim kanallarını buradan yönetebilirsiniz.</p>
            </div>
            {hasChanges ? (
              <button
                onClick={onSave}
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#C5A059] hover:bg-[#A68045] disabled:opacity-50 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-[#C5A059]/10"
              >
                {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                {!isLoading && <Save size={18} />}
              </button>
            ) : (
              <div className="px-8 py-3 rounded-xl text-sm font-bold bg-[#1E293B] text-slate-500 border border-white/5 flex items-center gap-2">
                <Save size={18} />
                Değişiklik Yok
              </div>
            )}
          </header>

          <div className="max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="bg-[#1E293B]/30 border border-white/5 rounded-[40px] p-8 sm:p-10 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#C5A059]/10 rounded-lg text-[#C5A059]">
                    <Phone size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Genel İletişim</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                  <InputField
                    label="Site Açıklaması (Footer)"
                    icon={Share2}
                    value={formData.site_description || ''}
                    onChange={(val) => setFormData({ ...formData, site_description: val })}
                    maxLength={FORM_LIMITS.contact.site_description}
                    isTextArea={true}
                  />

                  <InputField
                    label="Otel Adresi"
                    icon={MapPin}
                    value={formData.address}
                    onChange={(val) => setFormData({ ...formData, address: val })}
                    maxLength={FORM_LIMITS.contact.address}
                    isTextArea={true}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Sabit Telefon"
                      icon={Phone}
                      value={formData.landline_phone}
                      onChange={(val) => setFormData({ ...formData, landline_phone: val })}
                      maxLength={FORM_LIMITS.contact.landline}
                      placeholder="05XX..."
                    />

                    <InputField
                      label="Cep Telefonu"
                      icon={Smartphone}
                      value={formData.mobile_phone}
                      onChange={(val) => setFormData({ ...formData, mobile_phone: val })}
                      maxLength={FORM_LIMITS.contact.mobile}
                      placeholder="05XX..."
                    />

                    <InputField
                      label="WhatsApp Hattı"
                      icon={MessageCircle}
                      value={formData.whatsapp_number}
                      onChange={(val) => setFormData({ ...formData, whatsapp_number: val })}
                      maxLength={FORM_LIMITS.contact.whatsapp}
                      placeholder="05XX..."
                    />

                    <InputField
                      label="Faks"
                      icon={Printer}
                      value={formData.fax}
                      onChange={(val) => setFormData({ ...formData, fax: val })}
                      maxLength={FORM_LIMITS.contact.fax}
                      placeholder="05XX..."
                    />
                  </div>

                  <InputField
                    label="E-posta Adresi"
                    icon={Mail}
                    value={formData.email}
                    onChange={(val) => setFormData({ ...formData, email: val })}
                    maxLength={FORM_LIMITS.contact.email}
                    placeholder="bilgi@..."
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Konaklama Numarası"
                      icon={Phone}
                      value={formData.accommodation_phone}
                      onChange={(val) => setFormData({ ...formData, accommodation_phone: val })}
                      maxLength={FORM_LIMITS.contact.landline}
                      placeholder="05XX..."
                    />

                    <InputField
                      label="Organizasyon Numarası"
                      icon={Phone}
                      value={formData.organization_phone}
                      onChange={(val) => setFormData({ ...formData, organization_phone: val })}
                      maxLength={FORM_LIMITS.contact.landline}
                      placeholder="05XX..."
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-[#1E293B]/30 border border-white/5 rounded-[40px] p-8 sm:p-10 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#C5A059]/10 rounded-lg text-[#C5A059]">
                    <Share2 size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Sosyal Medya</h2>
                </div>

                <div className="space-y-6">
                  <InputField
                    label="Instagram"
                    icon={Camera}
                    value={formData.instagram || ''}
                    onChange={(val) => setFormData({ ...formData, instagram: val })}
                    maxLength={FORM_LIMITS.contact.social}
                    placeholder="https://instagram.com/..."
                  />

                  <InputField
                    label="Facebook"
                    icon={Globe}
                    value={formData.facebook || ''}
                    onChange={(val) => setFormData({ ...formData, facebook: val })}
                    maxLength={FORM_LIMITS.contact.social}
                    placeholder="https://facebook.com/..."
                  />

                  <InputField
                    label="Twitter (X)"
                    icon={Share2}
                    value={formData.twitter || ''}
                    onChange={(val) => setFormData({ ...formData, twitter: val })}
                    maxLength={FORM_LIMITS.contact.social}
                    placeholder="https://twitter.com/..."
                  />

                  <InputField
                    label="LinkedIn"
                    icon={LinkIcon}
                    value={formData.linkedin || ''}
                    onChange={(val) => setFormData({ ...formData, linkedin: val })}
                    maxLength={FORM_LIMITS.contact.social}
                    placeholder="https://linkedin.com/in/..."
                  />

                  <InputField
                    label="YouTube"
                    icon={Video}
                    value={formData.youtube || ''}
                    onChange={(val) => setFormData({ ...formData, youtube: val })}
                    maxLength={FORM_LIMITS.contact.social}
                    placeholder="https://youtube.com/..."
                  />

                  <InputField
                    label="Pinterest"
                    icon={Share2}
                    value={formData.pinterest || ''}
                    onChange={(val) => setFormData({ ...formData, pinterest: val })}
                    maxLength={FORM_LIMITS.contact.social}
                    placeholder="https://pinterest.com/..."
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

export default ContactManagement;
