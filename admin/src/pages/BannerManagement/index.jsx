import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from '../Dashboard/components/Sidebar';
import Navbar from '../Dashboard/components/Navbar';
import { useDashboard } from '../Dashboard/hooks/useDashboard';
import { useBanners } from './hooks/useBanners';
import ImageUploader from '../../components/ImageUploader';
import { FORM_LIMITS } from '../../utils/formLimits';
import { Save, Edit2, X, Type, Layout, Image } from 'lucide-react';
import { uploadService } from '../../services/upload.service';

const BannerManagement = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu } = useDashboard();
  const { banners, isLoading, isFetching, handleUpdate } = useBanners();
  
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newFile, setNewFile] = useState(null);

  const startEdit = (banner) => {
    setEditingId(banner.id);
    setEditData({ ...banner });
    setNewFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setNewFile(null);
  };

  const onSave = async (id) => {
    if (!editData.page_title || (!editData.image_url && !newFile)) {
      toast.error('Lütfen fotoğraf ve sayfa başlığı alanlarını doldurun.');
      return;
    }
    let imageUrl = editData.image_url;
    if(newFile) {
       try {
         const res = await uploadService.uploadFiles([newFile], 'page_banners');
         if(res && res.success && res.data.length > 0) {
            imageUrl = res.data[0];
         }
       } catch(err) {
         console.error(err);
       }
    }
    
    await handleUpdate(id, { ...editData, image_url: imageUrl });
    setEditingId(null);
    setNewFile(null);
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
          <header className="mb-10">
            <p className="text-[#C5A059] font-bold text-xs uppercase tracking-[3px] mb-2">Sistem</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">Sayfa Banner'ları</h1>
            <p className="text-slate-500 mt-2">Alt sayfalarda yer alan üst (banner) alanlarını buradan yönetebilirsiniz.</p>
          </header>

          {isFetching ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-500">
               <div className="w-10 h-10 border-4 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin mb-4" />
               <p>Bannerlar yükleniyor...</p>
             </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-[#1E293B]/30 border border-white/5 rounded-[32px] overflow-hidden flex flex-col">
                {/* Banner Preview */}
                <div className="relative aspect-[21/9] overflow-hidden group">
                   <img src={editingId === banner.id && editData.image_url ? editData.image_url : banner.image_url} alt="banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
                      <span className="text-[#C5A059] text-[10px] font-bold uppercase tracking-[4px] mb-1">{editingId === banner.id ? editData.top_title : banner.top_title}</span>
                      <h2 className="text-white text-3xl font-bold italic tracking-tight">{editingId === banner.id ? editData.page_title : banner.page_title}</h2>
                   </div>
                   {/* Omitted the image uploader overlay from the preview */}
                   <div className="absolute top-4 right-4 bg-[#C5A059] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      {banner.page_key}
                   </div>
                </div>

                {/* Edit Controls */}
                <div className="p-8 flex-1">
                   {editingId === banner.id ? (
                     <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-3">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Banner Fotoğrafı</label>
                           {editData.image_url ? (
                              <div className="relative aspect-[21/9] rounded-xl overflow-hidden border border-white/10 group">
                                 <img src={editData.image_url} className="w-full h-full object-cover" alt="preview" />
                                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                    <button onClick={() => {
                                       setNewFile(null);
                                       setEditData({...editData, image_url: ''});
                                    }} className="p-2 bg-rose-500 text-white rounded-lg hover:scale-110 transition-transform cursor-pointer">
                                      <X size={16} />
                                    </button>
                                 </div>
                              </div>
                           ) : (
                              <div className="col-span-1 border border-white/5 bg-black/20 rounded-xl">
                                 <ImageUploader 
                                    maxFileSize={2} 
                                    multiple={false}
                                    idealResolution={{ width: 1920, height: 600 }} 
                                    label="Fotoğraf Seç"
                                    onChange={(files) => {
                                       if(files && files.length > 0) {
                                         setNewFile(files[0]);
                                         setEditData({...editData, image_url: files[0].preview});
                                       }
                                    }}
                                 />
                              </div>
                           )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <div className="flex justify-between items-center mb-1 px-1">
                                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Üst Başlık</label>
                                 <span className={`text-[9px] font-bold ${editData.top_title.length >= FORM_LIMITS.banners.top_title ? 'text-rose-500' : 'text-slate-600'}`}>{editData.top_title.length}/{FORM_LIMITS.banners.top_title}</span>
                              </div>
                              <div className="relative">
                                <Layout size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input 
                                  type="text" 
                                  maxLength={FORM_LIMITS.banners.top_title}
                                  value={editData.top_title}
                                  onChange={(e) => setEditData({...editData, top_title: e.target.value})}
                                  className="w-full bg-[#0F172A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                                />
                              </div>
                           </div>
                           <div>
                              <div className="flex justify-between items-center mb-1 px-1">
                                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sayfa Başlığı</label>
                                 <span className={`text-[9px] font-bold ${editData.page_title.length >= FORM_LIMITS.banners.page_title ? 'text-rose-500' : 'text-slate-600'}`}>{editData.page_title.length}/{FORM_LIMITS.banners.page_title}</span>
                              </div>
                              <div className="relative">
                                <Type size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input 
                                  type="text" 
                                  maxLength={FORM_LIMITS.banners.page_title}
                                  value={editData.page_title}
                                  onChange={(e) => setEditData({...editData, page_title: e.target.value})}
                                  className="w-full bg-[#0F172A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                                />
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                          <button 
                            disabled={isLoading}
                            onClick={() => onSave(banner.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                          >
                            <Save size={16} />
                            Kaydet
                          </button>
                          <button 
                            onClick={cancelEdit}
                            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            <X size={16} />
                            İptal
                          </button>
                        </div>
                     </div>
                   ) : (
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-slate-500 text-xs font-medium">
                           <div className="flex items-center gap-1.5">
                              <Image size={14} />
                              <span>1920x600</span>
                           </div>
                        </div>
                        <button 
                          onClick={() => startEdit(banner)}
                          className="flex items-center gap-2 text-[#C5A059] hover:text-white bg-[#C5A059]/10 hover:bg-[#C5A059] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-[#C5A059]/20"
                        >
                          <Edit2 size={14} />
                          Banner ve Başlıkları Düzenle
                        </button>
                     </div>
                   )}
                </div>
              </div>
            ))}
          </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BannerManagement;
