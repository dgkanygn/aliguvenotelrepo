import React, { useState } from 'react';
import { ICON_OPTIONS } from '../../utils/iconList';
import { Search, X } from 'lucide-react';

const IconSelector = ({ selectedIcon, onSelect, onClose }) => {
  const [search, setSearch] = useState('');

  const filteredIcons = ICON_OPTIONS.filter(icon => 
    icon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative bg-[#1E293B] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-bold text-xl">İkon Seç</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 bg-white/5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="İkon ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0F172A] border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {filteredIcons.map(({ name, Icon }) => (
              <button
                key={name}
                onClick={() => {
                  onSelect(name);
                  onClose();
                }}
                className={`
                  flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all cursor-pointer group
                  ${selectedIcon === name 
                    ? 'bg-[#C5A059] text-white shadow-lg shadow-[#C5A059]/20' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}
                `}
              >
                <Icon size={24} className="group-hover:scale-110 transition-transform" />
                <span className="text-[9px] truncate w-full font-medium">{name}</span>
              </button>
            ))}
          </div>
          {filteredIcons.length === 0 && (
            <div className="text-center py-10">
              <p className="text-slate-500 text-sm">Eşleşen ikon bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IconSelector;
