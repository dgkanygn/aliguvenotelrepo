import React, { useState, useEffect } from 'react';
import Sidebar from '../Dashboard/components/Sidebar';
import Navbar from '../Dashboard/components/Navbar';
import { useDashboard } from '../Dashboard/hooks/useDashboard';
import { useOverview } from './hooks/useOverview';
import ImageUploader from '../../components/ImageUploader';
import { FORM_LIMITS } from '../../utils/formLimits';
import { Save, Layout, FileText, Tag, ListPlus, X } from 'lucide-react';
import { uploadService } from '../../services/upload.service';

const OverviewManagement = () => {
    const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu } = useDashboard();
    const { overview, isLoading, isFetching, handleUpdate } = useOverview();
    const [formData, setFormData] = useState({
        image_url: '',
        tagline: '',
        title: '',
        summary: '',
        feature_list: []
    });
    const [newFile, setNewFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadKey, setUploadKey] = useState(Date.now());

    const hasChanges = overview && formData ? JSON.stringify(overview) !== JSON.stringify(formData) || newFile !== null : false;

    useEffect(() => {
        if (overview) {
            setFormData(overview);
        }
    }, [overview]);

    const onSave = async () => {
        let imageUrl = formData.image_url;
        if (newFile) {
            try {
                setIsUploading(true);
                const res = await uploadService.uploadFiles([newFile], 'home_overview');
                if (res && res.success && res.data.length > 0) {
                    imageUrl = res.data[0];
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsUploading(false);
            }
        }

        await handleUpdate({ ...formData, image_url: imageUrl });
        setNewFile(null);
        setUploadKey(Date.now());
    };

    const addFeature = () => {
        if (formData.feature_list.length < FORM_LIMITS.overview.maxFeatures) {
            setFormData({
                ...formData,
                feature_list: [...formData.feature_list, ""]
            });
        }
    };

    const removeFeature = (index) => {
        const newList = formData.feature_list.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            feature_list: newList
        });
    };

    const updateFeature = (index, value) => {
        const newList = [...formData.feature_list];
        newList[index] = value;
        setFormData({
            ...formData,
            feature_list: newList
        });
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
                            <h1 className="text-3xl font-bold text-white tracking-tight">Otel Özet Yönetimi</h1>
                        </div>
                        {hasChanges ? (
                            <button
                                onClick={onSave}
                                disabled={isLoading || isFetching || isUploading}
                                className="flex items-center gap-2 bg-[#C5A059] hover:bg-[#A68045] disabled:opacity-50 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-[#C5A059]/10"
                            >
                                {isUploading ? 'Fotoğraf yükleniyor...' : isLoading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                                {!isLoading && !isUploading && <Save size={18} />}
                            </button>
                        ) : (
                            <div className="px-8 py-3 rounded-xl text-sm font-bold bg-[#1E293B] text-slate-500 border border-white/5 flex items-center gap-2">
                                <Save size={18} />
                                Değişiklik Yok
                            </div>
                        )}
                    </header>

                    {isFetching ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                            <div className="w-10 h-10 border-4 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin mb-4" />
                            <p>İçerik yükleniyor...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            {/* Left Column: Image */}
                            <div className="xl:col-span-1 space-y-6">
                                <div className="bg-[#1E293B]/30 border border-white/5 rounded-3xl p-6">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Görsel</label>
                                    <div className="aspect-video rounded-2xl overflow-hidden border border-white/5 mb-6 bg-white/5">
                                        <img src={formData.image_url || overview?.image_url} alt="Overview" className="w-full h-full object-cover" />
                                    </div>
                                    <ImageUploader
                                        key={uploadKey}
                                        maxFileSize={10}
                                        multiple={false}
                                        idealResolution={{ width: 1200, height: 800 }}
                                        label="Görseli Güncelle"
                                        onChange={(files) => {
                                            if (files && files.length > 0) {
                                                setNewFile(files[0]);
                                                setFormData({ ...formData, image_url: files[0].preview });
                                            } else {
                                                setNewFile(null);
                                                setFormData({ ...formData, image_url: overview?.image_url || '' });
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Right Column: Form */}
                            <div className="xl:col-span-2 space-y-8">
                                <div className="bg-[#1E293B]/30 border border-white/5 rounded-3xl p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Tag size={16} className="text-[#C5A059]" />
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Etiket (Tagline)</label>
                                                </div>
                                                <span className={`text-[10px] font-bold ${formData.tagline.length >= FORM_LIMITS.overview.tagline ? 'text-rose-500' : 'text-slate-600'}`}>{formData.tagline.length}/{FORM_LIMITS.overview.tagline}</span>
                                            </div>
                                            <input
                                                type="text"
                                                maxLength={FORM_LIMITS.overview.tagline}
                                                value={formData.tagline}
                                                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#C5A059] transition-all font-medium"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Layout size={16} className="text-[#C5A059]" />
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Başlık</label>
                                                </div>
                                                <span className={`text-[10px] font-bold ${formData.title.length >= FORM_LIMITS.overview.title ? 'text-rose-500' : 'text-slate-600'}`}>{formData.title.length}/{FORM_LIMITS.overview.title}</span>
                                            </div>
                                            <input
                                                type="text"
                                                maxLength={FORM_LIMITS.overview.title}
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#C5A059] transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2">
                                                <FileText size={16} className="text-[#C5A059]" />
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Özet Metin</label>
                                            </div>
                                            <span className={`text-[10px] font-bold ${formData.summary.length >= FORM_LIMITS.overview.summary ? 'text-rose-500' : 'text-slate-600'}`}>{formData.summary.length}/{FORM_LIMITS.overview.summary}</span>
                                        </div>
                                        <textarea
                                            value={formData.summary}
                                            maxLength={FORM_LIMITS.overview.summary}
                                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                            rows={6}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#C5A059] transition-all resize-none leading-relaxed"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-2">
                                                <ListPlus size={16} className="text-[#C5A059]" />
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Özellik Listesi</label>
                                            </div>
                                            <button
                                                onClick={addFeature}
                                                disabled={formData.feature_list.length >= FORM_LIMITS.overview.maxFeatures}
                                                className="text-[10px] font-bold bg-[#C5A059]/10 text-[#C5A059] px-3 py-1 rounded-full hover:bg-[#C5A059]/20 transition-all disabled:opacity-50 cursor-pointer"
                                            >
                                                + Özellik Ekle ({formData.feature_list.length}/{FORM_LIMITS.overview.maxFeatures})
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {formData.feature_list.map((feature, index) => (
                                                <div key={index} className="flex gap-3">
                                                    <input
                                                        type="text"
                                                        value={feature}
                                                        onChange={(e) => updateFeature(index, e.target.value)}
                                                        placeholder={`Özellik ${index + 1}`}
                                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all text-sm"
                                                    />
                                                    <button
                                                        onClick={() => removeFeature(index)}
                                                        className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500/20 transition-all cursor-pointer"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                            {formData.feature_list.length === 0 && (
                                                <div className="text-center py-8 bg-white/2 rounded-2xl border border-dashed border-white/10">
                                                    <p className="text-slate-500 text-sm">Henüz özellik eklenmemiş.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default OverviewManagement;
