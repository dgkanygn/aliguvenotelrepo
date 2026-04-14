import React from 'react';
import { Check } from 'lucide-react';

const CATEGORIES = [
  { key: 'events', label: 'Organizasyon & Düğün' },
  { key: 'meetings', label: 'Toplantı & Etkinlik' }
];

const CategorySelector = ({ selectedKeys = [], onChange }) => {
  const toggleCategory = (key) => {
    if (selectedKeys.includes(key)) {
      onChange(selectedKeys.filter(k => k !== key));
    } else {
      onChange([...selectedKeys, key]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedKeys.includes(cat.key);
        return (
          <div 
            key={cat.key}
            onClick={() => toggleCategory(cat.key)}
            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
              isSelected 
                ? 'bg-[#C5A059]/10 border-[#C5A059]/50 text-[#C5A059]' 
                : 'bg-[#0F172A] border-white/10 text-slate-400 hover:border-white/20'
            }`}
          >
            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
              isSelected ? 'bg-[#C5A059] border-[#C5A059] text-white' : 'border-slate-600'
            }`}>
              {isSelected && <Check size={14} strokeWidth={3} />}
            </div>
            <span className="font-medium text-sm">{cat.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default CategorySelector;
