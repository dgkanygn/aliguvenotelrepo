import React, { useState, useEffect } from 'react';
import Sidebar from '../Dashboard/components/Sidebar';
import Navbar from '../Dashboard/components/Navbar';
import { useDashboard } from '../Dashboard/hooks/useDashboard';
import { useRestaurant } from './hooks/useRestaurant';
import ImageUploader from '../../components/ImageUploader';
import FileUploader from '../../components/FileUploader';
import { FORM_LIMITS } from '../../utils/formLimits';
import { Save, Utensils, FileText, AlertTriangle, FileDown, Trash2, ExternalLink, Plus, ListOrdered, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DraggableImageGrid from '../../components/DraggableImageGrid';

const RestaurantManagement = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu } = useDashboard();
  const { info, images, setImages, isLoading, isUploading, isFetching, updateInfo } = useRestaurant();
  const [formData, setFormData] = useState(null);
  const [uploadKey, setUploadKey] = useState(Date.now());

  const [pdfFile1, setPdfFile1] = useState(null);
  const [pdfFile2, setPdfFile2] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [hasDeletedImages, setHasDeletedImages] = useState(false);

  useEffect(() => {
    if (info) {
      const initialData = { ...info };
      let parsedMenu = { baslik: '', fiyat: '', yemekler: [] };

      if (initialData.sample_menu) {
        if (typeof initialData.sample_menu === 'string') {
          try {
            parsedMenu = JSON.parse(initialData.sample_menu);
          } catch (e) {
            console.error("Parse error", e);
          }
        } else {
          parsedMenu = initialData.sample_menu;
        }
      }

      initialData.sample_menu = {
        title: parsedMenu.title || parsedMenu.baslik || '',
        price: parsedMenu.price || parsedMenu.fiyat || '',
        dishes: parsedMenu.dishes || parsedMenu.yemekler || []
      };

      // menu_pdf_url alanlarından title bilgilerini çıkar
      const menuPdf1 = typeof initialData.menu_pdf_url === 'object' ? initialData.menu_pdf_url : { title: '', url: initialData.menu_pdf_url || '' };
      const menuPdf2 = typeof initialData.menu_pdf_url_2 === 'object' ? initialData.menu_pdf_url_2 : { title: '', url: initialData.menu_pdf_url_2 || '' };
      initialData.menu_pdf_title_1 = menuPdf1.title || '';
      initialData.menu_pdf_url = menuPdf1;
      initialData.menu_pdf_title_2 = menuPdf2.title || '';
      initialData.menu_pdf_url_2 = menuPdf2;

      setFormData(initialData);
    }
  }, [info]);

  const hasChanges = (() => {
    if (!info || !formData) return false;

    if (info.intro_text !== formData.intro_text) return true;
    if (info.warning_text !== formData.warning_text) return true;
    const origUrl1 = typeof info.menu_pdf_url === 'object' ? info.menu_pdf_url?.url : info.menu_pdf_url;
    const origUrl2 = typeof info.menu_pdf_url_2 === 'object' ? info.menu_pdf_url_2?.url : info.menu_pdf_url_2;
    const origTitle1 = typeof info.menu_pdf_url === 'object' ? info.menu_pdf_url?.title : '';
    const origTitle2 = typeof info.menu_pdf_url_2 === 'object' ? info.menu_pdf_url_2?.title : '';
    const formUrl1 = typeof formData.menu_pdf_url === 'object' ? formData.menu_pdf_url?.url : formData.menu_pdf_url;
    const formUrl2 = typeof formData.menu_pdf_url_2 === 'object' ? formData.menu_pdf_url_2?.url : formData.menu_pdf_url_2;
    if (origUrl1 !== formUrl1) return true;
    if (origUrl2 !== formUrl2) return true;
    if ((origTitle1 || '') !== (formData.menu_pdf_title_1 || '')) return true;
    if ((origTitle2 || '') !== (formData.menu_pdf_title_2 || '')) return true;

    let infoMenu = { title: '', price: '', dishes: [] };
    if (info.sample_menu) {
      if (typeof info.sample_menu === 'string') {
        try {
          infoMenu = JSON.parse(info.sample_menu);
        } catch (e) { }
      } else {
        infoMenu = info.sample_menu;
      }
    }

    const formattedInfoMenu = {
      title: infoMenu.title || infoMenu.baslik || '',
      price: infoMenu.price || infoMenu.fiyat || '',
      dishes: infoMenu.dishes || infoMenu.yemekler || []
    };

    if (JSON.stringify(formattedInfoMenu) !== JSON.stringify(formData.sample_menu)) return true;

    if (newImages.length > 0) return true;
    if (pdfFile1 !== null || pdfFile2 !== null) return true;
    if (hasDeletedImages) return true;
    return false;
  })();

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
    setHasDeletedImages(true);
  };

  const removeImageByIndex = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
    setHasDeletedImages(true);
  };

  const reorderImages = (newOrder) => {
    setImages(newOrder);
    setHasDeletedImages(true);
  };

  const onSave = async () => {
    const success = await updateInfo(formData, pdfFile1, pdfFile2, newImages, images.map((img, i) => ({ ...img, sort_order: i })));
    if (success) {
      setPdfFile1(null);
      setPdfFile2(null);
      setNewImages([]);
      setHasDeletedImages(false);
      setUploadKey(Date.now());
    }
  };

  // Menu Handling
  const handleMenuChange = (field, value) => {
    setFormData({
      ...formData,
      sample_menu: {
        ...formData.sample_menu,
        [field]: value
      }
    });
  };

  const handleDishChange = (index, value) => {
    const updatedDishes = [...formData.sample_menu.dishes];
    updatedDishes[index] = value;
    handleMenuChange('dishes', updatedDishes);
  };

  const addDish = () => {
    if (formData.sample_menu.dishes.length >= FORM_LIMITS.restaurant.maxMenuDishes) {
      toast.error(`Maksimum ${FORM_LIMITS.restaurant.maxMenuDishes} yemek ekleyebilirsiniz`);
      return;
    }
    handleMenuChange('dishes', [...formData.sample_menu.dishes, '']);
  };

  const removeDish = (index) => {
    const updatedDishes = formData.sample_menu.dishes.filter((_, i) => i !== index);
    handleMenuChange('dishes', updatedDishes);
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
              <p className="text-[#C5A059] font-bold text-xs uppercase tracking-[3px] mb-2">Yemek</p>
              <h1 className="text-3xl font-bold text-white tracking-tight">Restoran Yönetimi</h1>
            </div>
            {hasChanges ? (
              <button
                onClick={onSave}
                disabled={isLoading || isUploading}
                className="flex items-center gap-2 bg-[#C5A059] hover:bg-[#A68045] disabled:opacity-50 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-[#C5A059]/10"
              >
                {isLoading || isUploading ? (isUploading ? 'Dosyalar yükleniyor...' : 'Kaydediliyor...') : 'Değişiklikleri Kaydet'}
                {!(isLoading || isUploading) && <Save size={18} />}
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
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">1. Menü Dosyası (PDF / DOC)</label>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block px-1">Menü Başlığı</label>
                    <input
                      type="text"
                      value={formData.menu_pdf_title_1 || ''}
                      onChange={(e) => setFormData({ ...formData, menu_pdf_title_1: e.target.value })}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all text-sm"
                      placeholder="Örn: Ana Menü"
                      maxLength={100}
                    />
                  </div>

                  {info?.menu_pdf_url && (typeof info.menu_pdf_url === 'object' ? info.menu_pdf_url?.url : info.menu_pdf_url) && (typeof formData.menu_pdf_url === 'object' ? formData.menu_pdf_url?.url : formData.menu_pdf_url) !== '' && (typeof formData.menu_pdf_url === 'object' ? formData.menu_pdf_url?.url : formData.menu_pdf_url) !== null && !pdfFile1 ? (
                    <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-4 flex items-center justify-between group transition-all hover:border-[#C5A059]/30">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 flex items-center justify-center flex-shrink-0 text-[#C5A059]">
                          <FileText size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 opacity-60">1. Yayındaki Menü</p>
                          <p className="text-sm text-white font-medium truncate italic" title={(typeof info.menu_pdf_url === 'object' ? info.menu_pdf_url?.url : info.menu_pdf_url)?.split('/').pop()}>
                            {(typeof info.menu_pdf_url === 'object' ? info.menu_pdf_url?.url : info.menu_pdf_url)?.split('/').pop()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a
                          href={typeof info.menu_pdf_url === 'object' ? info.menu_pdf_url?.url : info.menu_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
                          title="Görüntüle / İndir"
                        >
                          <ExternalLink size={18} />
                        </a>
                        <button
                          onClick={() => {
                            setFormData({ ...formData, menu_pdf_url: { title: '', url: '' } });
                            setPdfFile1(null);
                          }}
                          className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-all cursor-pointer"
                          title="Menüyü Sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <label className="flex items-center justify-center w-full min-h-[100px] border-2 border-dashed border-white/10 hover:border-[#C5A059]/50 rounded-2xl bg-[#0F172A] hover:bg-[#C5A059]/5 cursor-pointer transition-all group">
                        <div className="flex flex-col items-center justify-center p-4 text-center">
                          <div className="w-10 h-10 mb-2 rounded-xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform">
                            <Upload size={20} />
                          </div>
                          <p className="text-sm text-slate-300 font-medium mb-1">1. Yeni Menü Yükle</p>
                          <p className="text-[10px] text-slate-500 font-medium">PDF, DOC (Max 10MB)</p>
                          {pdfFile1 && (
                            <div className="mt-3 py-1.5 px-3 bg-[#C5A059]/10 text-[#C5A059] rounded-lg text-xs font-semibold flex items-center gap-2">
                              <FileText size={14} />
                              <span className="truncate max-w-[150px]">{pdfFile1.name}</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf, .doc, .docx"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setPdfFile1(e.target.files[0]);
                              setFormData({ ...formData, menu_pdf_url: { ...formData.menu_pdf_url, url: e.target.files[0].name } });
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">2. Menü Dosyası (PDF / DOC)</label>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block px-1">Menü Başlığı</label>
                    <input
                      type="text"
                      value={formData.menu_pdf_title_2 || ''}
                      onChange={(e) => setFormData({ ...formData, menu_pdf_title_2: e.target.value })}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all text-sm"
                      placeholder="Örn: İçecek Menüsü"
                      maxLength={100}
                    />
                  </div>

                  {info?.menu_pdf_url_2 && (typeof info.menu_pdf_url_2 === 'object' ? info.menu_pdf_url_2?.url : info.menu_pdf_url_2) && (typeof formData.menu_pdf_url_2 === 'object' ? formData.menu_pdf_url_2?.url : formData.menu_pdf_url_2) !== '' && (typeof formData.menu_pdf_url_2 === 'object' ? formData.menu_pdf_url_2?.url : formData.menu_pdf_url_2) !== null && !pdfFile2 ? (
                    <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-4 flex items-center justify-between group transition-all hover:border-[#C5A059]/30">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 flex items-center justify-center flex-shrink-0 text-[#C5A059]">
                          <FileText size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 opacity-60">2. Yayındaki Menü</p>
                          <p className="text-sm text-white font-medium truncate italic" title={(typeof info.menu_pdf_url_2 === 'object' ? info.menu_pdf_url_2?.url : info.menu_pdf_url_2)?.split('/').pop()}>
                            {(typeof info.menu_pdf_url_2 === 'object' ? info.menu_pdf_url_2?.url : info.menu_pdf_url_2)?.split('/').pop()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a
                          href={typeof info.menu_pdf_url_2 === 'object' ? info.menu_pdf_url_2?.url : info.menu_pdf_url_2}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
                          title="Görüntüle / İndir"
                        >
                          <ExternalLink size={18} />
                        </a>
                        <button
                          onClick={() => {
                            setFormData({ ...formData, menu_pdf_url_2: { title: '', url: '' } });
                            setPdfFile2(null);
                          }}
                          className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-all cursor-pointer"
                          title="Menüyü Sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <label className="flex items-center justify-center w-full min-h-[100px] border-2 border-dashed border-white/10 hover:border-[#C5A059]/50 rounded-2xl bg-[#0F172A] hover:bg-[#C5A059]/5 cursor-pointer transition-all group">
                        <div className="flex flex-col items-center justify-center p-4 text-center">
                          <div className="w-10 h-10 mb-2 rounded-xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform">
                            <Upload size={20} />
                          </div>
                          <p className="text-sm text-slate-300 font-medium mb-1">2. Yeni Menü Yükle</p>
                          <p className="text-[10px] text-slate-500 font-medium">PDF, DOC (Max 10MB)</p>
                          {pdfFile2 && (
                            <div className="mt-3 py-1.5 px-3 bg-[#C5A059]/10 text-[#C5A059] rounded-lg text-xs font-semibold flex items-center gap-2">
                              <FileText size={14} />
                              <span className="truncate max-w-[150px]">{pdfFile2.name}</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf, .doc, .docx"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setPdfFile2(e.target.files[0]);
                              setFormData({ ...formData, menu_pdf_url_2: { ...formData.menu_pdf_url_2, url: e.target.files[0].name } });
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Sample Menu Section */}
              <div className="bg-[#1E293B]/30 border border-white/5 rounded-3xl p-8 space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <ListOrdered size={20} className="text-[#C5A059]" />
                    Örnek Menü Yönetimi
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block px-1">Liste Başlığı</label>
                    <input
                      type="text"
                      value={formData.sample_menu.title}
                      maxLength={FORM_LIMITS.restaurant.menu_title}
                      onChange={(e) => handleMenuChange('title', e.target.value)}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all text-sm"
                      placeholder="Örn: Günün Menüsü"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block px-1">Menü Fiyatı</label>
                    <input
                      type="text"
                      value={formData.sample_menu.price}
                      maxLength={FORM_LIMITS.restaurant.menu_price}
                      onChange={(e) => handleMenuChange('price', e.target.value)}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all text-sm"
                      placeholder="Örn: 275 TL"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Yemek Listesi</label>
                    <button
                      onClick={addDish}
                      className="text-[10px] font-bold text-[#C5A059] hover:text-[#A68045] uppercase tracking-widest flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                      Yemek Ekle
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.sample_menu.dishes.map((dish, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          value={dish}
                          onChange={(e) => handleDishChange(index, e.target.value)}
                          className="flex-1 bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all text-sm"
                          placeholder={`${index + 1}. Yemek`}
                        />
                        <button
                          onClick={() => removeDish(index)}
                          className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500/20 transition-all cursor-pointer"
                          title="Yemeği Sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    {formData.sample_menu.dishes.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-2xl text-slate-500 text-sm">
                        Henüz yemek eklenmemiş. "Yemek Ekle" butonuna basarak başlayın.
                      </div>
                    )}
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
                  <span className={`text-[9px] font-bold ${(images.length + newImages.length) >= FORM_LIMITS.restaurant.maxPhotos ? 'text-rose-500' : 'text-slate-600'}`}>{(images.length + newImages.length)}/{FORM_LIMITS.restaurant.maxPhotos}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <DraggableImageGrid
                    images={images}
                    isEditing={true}
                    onReorder={reorderImages}
                    onRemove={removeImageByIndex}
                    altText="restaurant"
                  />
                </div>

                <div className="pt-4 border-t border-white/5">
                  {(images.length + newImages.length) < FORM_LIMITS.restaurant.maxPhotos && (
                    <ImageUploader
                      key={`image-${uploadKey}`}
                      multiple={true}
                      maxFileSize={10}
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
