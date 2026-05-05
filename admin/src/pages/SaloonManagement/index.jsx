import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from '../Dashboard/components/Sidebar';
import Navbar from '../Dashboard/components/Navbar';
import { useDashboard } from '../Dashboard/hooks/useDashboard';
import { useSaloons } from './hooks/useSaloons';
import ImageUploader from '../../components/ImageUploader';
import ConfirmModal from '../../components/ConfirmModal';
import { FORM_LIMITS } from '../../utils/formLimits';
import { Edit2, Trash2, Plus, Save, X, Check, LayoutGrid, Star, ArrowUpDown } from 'lucide-react';
import { uploadService } from '../../services/upload.service';
import CategorySelector from './components/CategorySelector';
import DraggableImageGrid from '../../components/DraggableImageGrid';

const translateCategory = (key) => {
  if (key === 'meetings') return 'Toplantı & Etkinlik';
  if (key === 'events') return 'Organizasyon & Düğün';
  return key;
};

const getCategories = (saloon) => {
  if (!saloon.category_keys) return [];
  if (Array.isArray(saloon.category_keys)) return saloon.category_keys;
  try { return JSON.parse(saloon.category_keys); } catch (e) { return []; }
};

const SaloonManagement = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu } = useDashboard();
  const { saloons, isLoading, isFetching, handleUpdate, createSaloon, deleteSaloon } = useSaloons();

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [newAmenity, setNewAmenity] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [newFiles, setNewFiles] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const startAdd = () => {
    setEditData({ title: '', description: '', category_keys: [], amenities: [], images: [], sort_order: 0 });
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
    if (!editData.title || !editData.description || !editData.amenities?.length || newFiles.length === 0) {
      toast.error('Lütfen fotoğraf, başlık, açıklama ve en az 1 özellik ekleyin.');
      return;
    }
    let uploadedUrls = [];
    if (newFiles && newFiles.length > 0) {
      try {
        setIsUploading(true);
        const res = await uploadService.uploadFiles(newFiles, 'saloons');
        if (res && res.success) {
          uploadedUrls = res.data;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    }

    const payloadImages = uploadedUrls.map((url, i) => ({ image_url: url, is_main: i === 0 ? 1 : 0, sort_order: i }));

    const success = await createSaloon({ ...editData, sort_order: Number(editData.sort_order) || 0, images: payloadImages });
    if (success) {
      setIsAddModalOpen(false);
      setEditData({});
      setNewFiles([]);
      setNewAmenity('');
    }
  };

  const startEdit = (saloon) => {
    setEditingId(saloon.id);
    setEditData({ ...saloon, images: saloon.images || [], category_keys: getCategories(saloon), sort_order: saloon.sort_order ?? 0 });
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

  const reorderImages = (newImages) => {
    setEditData({ ...editData, images: newImages });
  };


  const onSave = async (id) => {
    if (!editData.title || !editData.description || !editData.amenities?.length || (editData.images?.length === 0 && newFiles.length === 0)) {
      toast.error('Lütfen fotoğraf, başlık, açıklama ve en az 1 özellik ekleyin.');
      return;
    }
    let uploadedUrls = [];
    if (newFiles && newFiles.length > 0) {
      try {
        setIsUploading(true);
        const res = await uploadService.uploadFiles(newFiles, 'saloons');
        if (res && res.success) {
          uploadedUrls = res.data;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    }

    const payloadImages = [
      ...(editData.images || []).map(img => ({ image_url: img.image_url })),
      ...uploadedUrls.map((url) => ({ image_url: url }))
    ].map((img, i) => ({ ...img, is_main: i === 0 ? 1 : 0, sort_order: i }));

    await handleUpdate(id, { ...editData, sort_order: Number(editData.sort_order) || 0, images: payloadImages });
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
      await deleteSaloon(deleteId);
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
              <p className="text-[#C5A059] font-bold text-xs uppercase tracking-[3px] mb-2">Organizasyon</p>
              <h1 className="text-3xl font-bold text-white tracking-tight">Salon Yönetimi</h1>
              <p className="text-slate-500 mt-2">Maksimum {FORM_LIMITS.saloons.maxItems} salon eklenebilir. ({saloons.length}/{FORM_LIMITS.saloons.maxItems})</p>
            </div>
            {saloons.length < FORM_LIMITS.saloons.maxItems && (
              <button
                onClick={startAdd}
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#C5A059] hover:bg-[#A68045] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-[#C5A059]/10 disabled:opacity-50"
              >
                <Plus size={18} />
                Yeni Salon Ekle
              </button>
            )}
          </header>

          <div className="space-y-8">
            {isFetching ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <div className="w-10 h-10 border-4 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin mb-4" />
                <p>Salonlar yükleniyor...</p>
              </div>
            ) : saloons.map((saloon) => (
              <div key={saloon.id} className="bg-[#1E293B]/30 border border-white/5 rounded-[32px] overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Images Section */}
                  <div className="lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-white/5 space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Salon Fotoğrafları</label>
                      <span className={`text-[9px] font-bold ${((editingId === saloon.id ? editData.images?.length : saloon.images?.length) || 0) + newFiles.length >= FORM_LIMITS.saloons.maxPhotos ? 'text-rose-500' : 'text-slate-600'}`}>{((editingId === saloon.id ? editData.images?.length : saloon.images?.length) || 0) + newFiles.length}/{FORM_LIMITS.saloons.maxPhotos}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <DraggableImageGrid
                        images={editingId === saloon.id ? editData.images : saloon.images}
                        isEditing={editingId === saloon.id}
                        onReorder={reorderImages}
                        onRemove={removeExistingImage}
                        altText="saloon"
                      />
                      {editingId === saloon.id && ((editData.images?.length || 0) + newFiles.length) < FORM_LIMITS.saloons.maxPhotos && (
                        <div className="col-span-2 mt-2">
                          <ImageUploader
                            multiple={true}
                            maxFileSize={10}
                            label="Fotoğraf Ekle"
                            onChange={(files) => setNewFiles(files)}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-8">
                    {editingId === saloon.id ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="col-span-2 md:col-span-1">
                            <div className="flex justify-between items-center mb-2 px-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Salon Başlığı</label>
                              <span className={`text-[9px] font-bold ${editData.title.length >= FORM_LIMITS.saloons.title ? 'text-rose-500' : 'text-slate-600'}`}>{editData.title.length}/{FORM_LIMITS.saloons.title}</span>
                            </div>
                            <input
                              type="text"
                              maxLength={FORM_LIMITS.saloons.title}
                              value={editData.title}
                              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all"
                            />
                          </div>

                          <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-1.5 mb-2 px-1">
                              <ArrowUpDown size={12} className="text-slate-500" />
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sıralama</label>
                            </div>
                            <input
                              type="number"
                              min={0}
                              value={editData.sort_order ?? 0}
                              onChange={(e) => setEditData({ ...editData, sort_order: e.target.value })}
                              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all"
                              placeholder="0"
                            />
                            <p className="text-[10px] text-slate-500 mt-1.5 px-1">{saloons.length} adet salon içinden <span className="text-[#C5A059] font-semibold">{editData.sort_order ?? 0}.</span> sıradadır</p>
                          </div>

                          <div className="col-span-2">
                            <div className="flex justify-between items-center mb-2 px-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Açıklama</label>
                              <span className={`text-[9px] font-bold ${editData.description.length >= FORM_LIMITS.saloons.description ? 'text-rose-500' : 'text-slate-600'}`}>{editData.description.length}/{FORM_LIMITS.saloons.description}</span>
                            </div>
                            <textarea
                              value={editData.description}
                              maxLength={FORM_LIMITS.saloons.description}
                              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                              rows={3}
                              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all resize-none leading-relaxed text-sm"
                            />
                          </div>

                          <div className="col-span-2">
                            <div className="flex justify-between items-center mb-2 px-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kategoriler</label>
                            </div>
                            <CategorySelector
                              selectedKeys={editData.category_keys || []}
                              onChange={(keys) => setEditData({ ...editData, category_keys: keys })}
                            />
                          </div>

                          <div className="col-span-2">
                            <div className="flex justify-between items-center mb-2 px-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Salon Özellikleri (Max {FORM_LIMITS.saloons.maxAmenities})</label>
                              <span className={`text-[9px] font-bold ${editData.amenities.length >= FORM_LIMITS.saloons.maxAmenities ? 'text-rose-500' : 'text-slate-600'}`}>{editData.amenities.length}/{FORM_LIMITS.saloons.maxAmenities}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {editData.amenities.map((amenity, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-[#C5A059]/10 text-[#C5A059] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#C5A059]/20">
                                  {amenity}
                                  <button onClick={() => removeAmenity(idx)} className="hover:text-white"><X size={14} /></button>
                                </div>
                              ))}
                            </div>
                            {editData.amenities.length < FORM_LIMITS.saloons.maxAmenities && (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={newAmenity}
                                  onChange={(e) => setNewAmenity(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
                                  placeholder="Örn: Profesyonel Ses Sistemi"
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
                            disabled={isLoading || isUploading}
                            onClick={() => onSave(saloon.id)}
                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-2xl text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-500/10"
                          >
                            <Save size={18} />
                            {isUploading ? 'Fotoğraf yükleniyor...' : isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
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
                            <div className="flex items-center gap-3 mb-2">
                              <h2 className="text-2xl font-bold text-white">{saloon.title}</h2>
                              <span className="flex items-center gap-1 bg-white/5 text-slate-400 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-white/5">
                                <ArrowUpDown size={11} className="text-[#C5A059]" />
                                {saloons.length} salon içinden {saloon.sort_order ?? 0}. sırada
                              </span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">{saloon.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(saloon)}
                              className="p-3 bg-white/5 hover:bg-white/10 text-[#C5A059] rounded-2xl transition-all border border-white/5 cursor-pointer"
                            >
                              <Edit2 size={20} />
                            </button>
                            <button
                              onClick={() => setDeleteId(saloon.id)}
                              className="p-3 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 rounded-2xl transition-all border border-rose-500/5 cursor-pointer"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>

                        <div className="mt-6">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Kategoriler</p>
                          <div className="flex flex-wrap gap-2">
                            {getCategories(saloon).map((cat, idx) => (
                              <div key={`cat-${idx}`} className="flex items-center gap-2 bg-[#C5A059]/10 text-[#C5A059] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#C5A059]/30">
                                {translateCategory(cat)}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Salon Olanakları</p>
                          <div className="flex flex-wrap gap-2">
                            {saloon.amenities.map((item, idx) => (
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
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!isLoading && !isUploading ? cancelAdd : undefined} />
              <div className="relative w-full max-w-4xl bg-[#0F172A] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-white/5">
                  <h3 className="text-xl font-bold text-white">Yeni Salon Ekle</h3>
                  <button onClick={cancelAdd} className="text-slate-500 hover:text-white transition-colors cursor-pointer"><X size={24} /></button>
                </div>

                <div className="flex flex-col lg:flex-row max-h-[80vh] overflow-y-auto">
                  <div className="lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-white/5 space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Salon Fotoğrafları</label>
                      <span className={`text-[9px] font-bold ${newFiles.length >= FORM_LIMITS.saloons.maxPhotos ? 'text-rose-500' : 'text-slate-600'}`}>{newFiles.length}/{FORM_LIMITS.saloons.maxPhotos}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {newFiles.map((file, idx) => (
                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                          <img src={file.preview} className="w-full h-full object-cover" alt="preview" />
                          <button onClick={() => {
                            const newF = [...newFiles];
                            newF.splice(idx, 1);
                            setNewFiles(newF);
                          }} className="absolute top-2 right-2 p-1.5 bg-rose-500/90 text-white rounded-lg hover:bg-rose-500 hover:scale-110 transition-all shadow-md cursor-pointer">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {newFiles.length < FORM_LIMITS.saloons.maxPhotos && (
                        <div className="col-span-2 mt-2">
                          <ImageUploader
                            multiple={true}
                            maxFileSize={10}
                            label="Fotoğraf Ekle"
                            onChange={(files) => setNewFiles([...newFiles, ...files].slice(0, FORM_LIMITS.saloons.maxPhotos))}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 p-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-1">
                          <div className="flex justify-between items-center mb-2 px-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Salon Başlığı</label>
                            <span className={`text-[9px] font-bold ${(editData.title?.length || 0) >= FORM_LIMITS.saloons.title ? 'text-rose-500' : 'text-slate-600'}`}>{(editData.title?.length || 0)}/{FORM_LIMITS.saloons.title}</span>
                          </div>
                          <input
                            type="text"
                            maxLength={FORM_LIMITS.saloons.title}
                            value={editData.title || ''}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all"
                          />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                          <div className="flex items-center gap-1.5 mb-2 px-1">
                            <ArrowUpDown size={12} className="text-slate-500" />
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sıralama</label>
                          </div>
                          <input
                            type="number"
                            min={0}
                            value={editData.sort_order ?? 0}
                            onChange={(e) => setEditData({ ...editData, sort_order: e.target.value })}
                            className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all"
                            placeholder="0"
                          />
                          <p className="text-[10px] text-slate-500 mt-1.5 px-1">{saloons.length} adet salon içinden <span className="text-[#C5A059] font-semibold">{editData.sort_order ?? 0}.</span> sıradadır</p>
                        </div>

                        <div className="col-span-2">
                          <div className="flex justify-between items-center mb-2 px-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Açıklama</label>
                            <span className={`text-[9px] font-bold ${(editData.description?.length || 0) >= FORM_LIMITS.saloons.description ? 'text-rose-500' : 'text-slate-600'}`}>{(editData.description?.length || 0)}/{FORM_LIMITS.saloons.description}</span>
                          </div>
                          <textarea
                            value={editData.description || ''}
                            maxLength={FORM_LIMITS.saloons.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            rows={3}
                            className="w-full bg-[#1E293B] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all resize-none leading-relaxed text-sm"
                          />
                        </div>

                        <div className="col-span-2">
                          <div className="flex justify-between items-center mb-2 px-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kategoriler</label>
                          </div>
                          <CategorySelector
                            selectedKeys={editData.category_keys || []}
                            onChange={(keys) => setEditData({ ...editData, category_keys: keys })}
                          />
                        </div>

                        <div className="col-span-2">
                          <div className="flex justify-between items-center mb-2 px-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Salon Özellikleri (Max {FORM_LIMITS.saloons.maxAmenities})</label>
                            <span className={`text-[9px] font-bold ${(editData.amenities?.length || 0) >= FORM_LIMITS.saloons.maxAmenities ? 'text-rose-500' : 'text-slate-600'}`}>{(editData.amenities?.length || 0)}/{FORM_LIMITS.saloons.maxAmenities}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {editData.amenities?.map((amenity, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-[#C5A059]/10 text-[#C5A059] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#C5A059]/20">
                                {amenity}
                                <button onClick={() => {
                                  const newA = [...editData.amenities];
                                  newA.splice(idx, 1);
                                  setEditData({ ...editData, amenities: newA })
                                }} className="hover:text-white"><X size={14} /></button>
                              </div>
                            ))}
                          </div>
                          {(editData.amenities?.length || 0) < FORM_LIMITS.saloons.maxAmenities && (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newAmenity}
                                onChange={(e) => setNewAmenity(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && newAmenity.trim()) {
                                    setEditData({ ...editData, amenities: [...(editData.amenities || []), newAmenity.trim()] });
                                    setNewAmenity('');
                                  }
                                }}
                                placeholder="Örn: Profesyonel Ses Sistemi"
                                className="flex-1 bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                              />
                              <button
                                onClick={() => {
                                  if (newAmenity.trim()) {
                                    setEditData({ ...editData, amenities: [...(editData.amenities || []), newAmenity.trim()] });
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
                          disabled={isLoading || isUploading}
                          onClick={onSaveNew}
                          className="w-full flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-[#A68045] text-white px-8 py-3 rounded-2xl text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#C5A059]/10"
                        >
                          <Save size={18} />
                          {isUploading ? 'Fotoğraf yükleniyor...' : isLoading ? 'Ekleniyor...' : 'Salonu Ekle'}
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
            title="Salonu Sil"
            message="Bu salonu silmek istediğinize emin misiniz?"
          />
        </main>
      </div>
    </div>
  );
};

export default SaloonManagement;
