import React, { useState } from 'react';
import Sidebar from '../Dashboard/components/Sidebar';
import Navbar from '../Dashboard/components/Navbar';
import { useDashboard } from '../Dashboard/hooks/useDashboard';
import { useFeatures } from './hooks/useFeatures';
import IconSelector from '../../components/IconSelector';
import { ICONS } from '../../utils/iconList';
import { FORM_LIMITS } from '../../utils/formLimits';
import { Edit2, Save, X, LayoutGrid, Type, AlignLeft } from 'lucide-react';

const FeatureManagement = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, toggleMobileMenu } = useDashboard();
  const { features, isLoading, handleUpdate } = useFeatures();
  
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);

  const startEdit = (feature) => {
    setEditingId(feature.id);
    setEditData(feature);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const onSave = async (id) => {
    await handleUpdate(id, editData);
    setEditingId(null);
  };

  const renderIcon = (iconName) => {
    const IconComponent = ICONS[iconName] || ICONS['box'];
    return <IconComponent size={32} />;
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
            <p className="text-[#C5A059] font-bold text-xs uppercase tracking-[3px] mb-2">Ana Sayfa</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">Özellik Yönetimi</h1>
            <p className="text-slate-500 mt-2">Bu bölümde sabit 3 özellik bulunmaktadır. İkonlarını ve metinlerini güncelleyebilirsiniz.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="bg-[#1E293B]/40 border border-white/5 rounded-[40px] p-10 group flex flex-col items-center text-center transition-all duration-300 hover:bg-[#1E293B]/60">
                {editingId === feature.id ? (
                  <div className="w-full space-y-6">
                    {/* Icon Selection Trigger */}
                    <div className="flex flex-col items-center gap-3">
                       <button 
                        onClick={() => setIsIconSelectorOpen(true)}
                        className="w-24 h-24 bg-[#C5A059]/10 rounded-3xl flex items-center justify-center text-[#C5A059] border border-[#C5A059]/20 hover:bg-[#C5A059]/20 transition-all cursor-pointer relative group/icon"
                       >
                          {renderIcon(editData.icon)}
                          <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover/icon:opacity-100 flex items-center justify-center transition-opacity">
                            <LayoutGrid size={24} className="text-white" />
                          </div>
                       </button>
                       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">İkonu Seç</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1 px-1">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">Başlık</label>
                           <span className={`text-[9px] font-bold ${editData.title.length >= FORM_LIMITS.features.title ? 'text-rose-500' : 'text-slate-600'}`}>{editData.title.length}/{FORM_LIMITS.features.title}</span>
                        </div>
                        <div className="relative">
                          <Type size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input 
                            type="text" 
                            maxLength={FORM_LIMITS.features.title}
                            value={editData.title}
                            onChange={(e) => setEditData({...editData, title: e.target.value})}
                            className="w-full bg-[#0F172A] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all text-sm font-bold"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1 px-1">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">Açıklama</label>
                           <span className={`text-[9px] font-bold ${editData.description.length >= FORM_LIMITS.features.description ? 'text-rose-500' : 'text-slate-600'}`}>{editData.description.length}/{FORM_LIMITS.features.description}</span>
                        </div>
                        <div className="relative">
                          <AlignLeft size={14} className="absolute left-4 top-4 text-slate-500" />
                          <textarea 
                            value={editData.description}
                            maxLength={FORM_LIMITS.features.description}
                            onChange={(e) => setEditData({...editData, description: e.target.value})}
                            rows={4}
                            className="w-full bg-[#0F172A] border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all text-sm leading-relaxed resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                      <button 
                        disabled={isLoading}
                        onClick={() => onSave(feature.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl text-sm font-bold transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Save size={18} />
                        Kaydet
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="flex items-center justify-center p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all cursor-pointer"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-[#C5A059]/10 rounded-[32px] flex items-center justify-center text-[#C5A059] mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-[#C5A059]/0 group-hover:shadow-[#C5A059]/10">
                      {renderIcon(feature.icon)}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight italic">{feature.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-10 flex-1">{feature.description}</p>
                    <button 
                      onClick={() => startEdit(feature)}
                      className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl text-sm font-bold transition-all cursor-pointer border border-white/5 group/btn"
                    >
                      <Edit2 size={16} className="text-[#C5A059] group-hover/btn:rotate-12 transition-transform" />
                      İçeriği Düzenle
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Icon Selector Modal */}
      {isIconSelectorOpen && (
        <IconSelector 
          selectedIcon={editData.icon}
          onSelect={(iconName) => setEditData({...editData, icon: iconName})}
          onClose={() => setIsIconSelectorOpen(false)}
        />
      )}
    </div>
  );
};

export default FeatureManagement;
