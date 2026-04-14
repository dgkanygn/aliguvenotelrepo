import React, { useState, useEffect } from 'react';
import Sidebar from '../Dashboard/components/Sidebar';
import Navbar from '../Dashboard/components/Navbar';
import { useDashboard } from '../Dashboard/hooks/useDashboard';
import { useRestaurant } from './hooks/useRestaurant';
import ImageUploader from '../../components/ImageUploader';
import FileUploader from '../../components/FileUploader';
import { FORM_LIMITS } from '../../utils/formLimits';
import { uploadService } from '../../services/upload.service';
import { Save, Utensils, FileText, AlertTriangle, FileDown, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

const RestaurantManagement = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu } = useDashboard();
  const { info, images, setImages, isLoading, isFetching, updateInfo } = useRestaurant();
  const [formData, setFormData] = useState(null);

  const [pdfFile, setPdfFile] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [hasDeletedImages, setHasDeletedImages] = useState(false);

  const hasChanges = (() => {
    if (!info || !formData) return false;
    if (JSON.stringify(info) !== JSON.stringify(formData)) return true;
    if (newImages.length > 0) return true;
    if (pdfFile !== null) return true;
    if (hasDeletedImages) return true;
    return false;
  })();

  useEffect(() => {
    if (info) {
      setFormData(info);
    }
  }, [info]);

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
    setHasDeletedImages(true);
  };

  const onSave = async () => {
    let finalPdfUrl = formData.menu_pdf_url;
    let finalImages = [...images];

    try {
      if (pdfFile) {
        const pdfToast = toast.loading('PDF yükleniyor...');
        const pdfUrl = await uploadService.uploadFile(pdfFile);
        toast.dismiss(pdfToast);
        if (pdfUrl) {
          finalPdfUrl = pdfUrl;
        } else {
          toast.error("PDF yüklenemedi");
          return; // Stop if PDF upload fails
        }
      }

      if (newImages.length > 0) {
        const imgToast = toast.loading('Resimler yükleniyor...');
        const uploadedImgUrls = await Promise.all(
          newImages.map(file => uploadService.uploadFile(file))
        );
        toast.dismiss(imgToast);

        const validUrls = uploadedImgUrls.filter(url => url);
        if (validUrls.length !== newImages.length) {
          toast.error("Bazı resimler yüklenemedi");
        }

        finalImages = [
          ...finalImages,
          ...validUrls.map((url, i) => ({ id: `new_${Date.now()}_${i}`, image_url: url }))
        ];
      }

      await updateInfo({
        ...formData,
        menu_pdf_url: finalPdfUrl,
        restaurant_images: finalImages
      });

      setPdfFile(null);
      setNewImages([]);
      setHasDeletedImages(false);
    } catch (err) {
      toast.error('Kayıt işlemi başarısız oldu');
    }
  };

  if (isFetching || !formData) {
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
          <main className="flex-1 flex items-center justify-center">
            <div className="text-[#C5A059] flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin"></div>
              <span className="font-medium">Restoran bilgileri yükleniyor...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
                    onChange={(e) => setFormData({ ...formData, intro_text: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, warning_text: e.target.value })}
                      rows={3}
                      className="w-full bg-rose-500/5 border border-rose-500/20 rounded-2xl pl-12 pr-5 py-4 text-rose-200 focus:outline-none focus:border-rose-500/50 transition-all resize-none text-sm"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Menü PDF Dosyası</label>
                    {info?.menu_pdf_url && (
                        <a 
                            href={info.menu_pdf_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[#C5A059] hover:text-[#A68045] text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                        >
                            <ExternalLink size={12} />
                            Mevcut Menüyü Gör
                        </a>
                    )}
                  </div>
                  <FileUploader
                    label={info?.menu_pdf_url ? "Dosyayı Değiştir" : "Dosya Yükle"}
                    accept=".pdf"
                    maxFileSize={10}
                    onFileSelect={(file) => {
                      setPdfFile(file);
                      setFormData({ ...formData, menu_pdf_url: file.name });
                    }}
                  />
                  {pdfFile && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-xl">
                        <FileDown size={14} className="text-[#C5A059]" />
                        <span className="text-[11px] text-[#C5A059] font-medium truncate">Yeni dosya: {pdfFile.name}</span>
                    </div>
                  )}
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
                  <span className={`text-[9px] font-bold ${(images.length + newImages.length) >= FORM_LIMITS.restaurant.maxPhotos ? 'text-rose-500' : 'text-slate-600'}`}>{(images.length + newImages.length)}/{FORM_LIMITS.restaurant.maxPhotos}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                      <img src={img.image_url || img.url} alt="restaurant" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute top-2 right-2 p-2 bg-rose-500/90 text-white rounded-xl hover:bg-rose-500 hover:scale-105 transition-all shadow-lg cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5">
                  {(images.length + newImages.length) < FORM_LIMITS.restaurant.maxPhotos && (
                    <ImageUploader
                      multiple={true}
                      maxFileSize={2}
                      label="Yeni Görsel Yükle"
                      onChange={(files) => setNewImages(files)}
                    />
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
