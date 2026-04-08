import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useImageUploader } from './hooks/useImageUploader';

const ImageUploader = ({ 
  multiple = false, 
  maxFileSize = 1, // MB
  idealResolution = { width: 1920, height: 1080 },
  label = "Fotoğraf Yükle"
}) => {
  const { files, errors, onDrop, removeFile, clearErrors } = useImageUploader({ 
    multiple, 
    maxFileSize, 
    idealResolution 
  });
  
  const fileInputRef = useRef(null);

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h4 className="text-white font-semibold text-sm">{label}</h4>
          <p className="text-slate-500 text-xs mt-1">
            İdeal: {idealResolution.width}x{idealResolution.height}px | Maks: {maxFileSize}MB
          </p>
        </div>
        {files.length > 0 && (
          <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider">
            {files.length} Dosya Seçildi
          </span>
        )}
      </div>

      {/* Upload Area */}
      <div 
        onClick={handleContainerClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={`
          relative border-2 border-dashed rounded-3xl p-10 
          transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center
          ${files.length > 0 ? 'border-[#C5A059]/30 bg-[#C5A059]/5' : 'border-white/10 bg-white/5 hover:border-[#C5A059]/50 hover:bg-[#C5A059]/5'}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={onDrop}
          multiple={multiple}
          accept="image/*"
          className="hidden"
        />
        
        <div className="w-16 h-16 bg-[#C5A059]/10 rounded-2xl flex items-center justify-center text-[#C5A059] mb-4">
          <Upload size={28} />
        </div>
        
        <p className="text-white font-medium">Tıklayın veya dosyaları buraya sürükleyin</p>
        <p className="text-slate-500 text-xs mt-2">PNG, JPG veya WEBP formatları desteklenir</p>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl space-y-2">
          {errors.map((error, idx) => (
            <div key={idx} className="flex items-start gap-2 text-rose-400 text-xs">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ))}
          <button 
            onClick={clearErrors}
            className="text-rose-400 text-[10px] font-bold uppercase tracking-wider hover:underline"
          >
            Temizle
          </button>
        </div>
      )}

      {/* Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file, idx) => (
            <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5">
              <img 
                src={file.preview} 
                className="w-full h-full object-cover" 
                alt="preview" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  className="p-2 bg-rose-500 text-white rounded-xl hover:scale-110 transition-transform cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 p-1 bg-emerald-500 text-white rounded-full">
                <CheckCircle2 size={10} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
