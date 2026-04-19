import React, { useRef, useState } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle2, FileDown } from 'lucide-react';

const FileUploader = ({
  accept = ".pdf",
  maxFileSize = 5, // MB
  label = "Dosya Yükle",
  onFileSelect
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const processFile = (file) => {
    setError(null);
    if (!file) return;

    // Check type
    const extension = file.name.split('.').pop().toLowerCase();
    if (accept && !accept.includes(extension)) {
      setError(`Geçersiz dosya formatı. Sadece ${accept} kabul edilir.`);
      return;
    }

    // Check size
    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`Dosya boyutu çok büyük. Maksimum ${maxFileSize}MB yüklenebilir.`);
      return;
    }

    const fileData = {
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
      preview: URL.createObjectURL(file)
    };

    setSelectedFile(fileData);
    if (onFileSelect) onFileSelect(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    processFile(file);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h4 className="text-white font-semibold text-sm">{label}</h4>
          <p className="text-slate-500 text-xs mt-1">
            Maksimum {maxFileSize}MB | {accept.toUpperCase()}
          </p>
        </div>
      </div>

      {!selectedFile ? (
        <div
          onClick={handleContainerClick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="relative border-2 border-dashed border-white/10 bg-white/5 hover:border-[#C5A059]/50 hover:bg-[#C5A059]/5 rounded-3xl p-8 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onDrop}
            accept={accept}
            className="hidden"
          />
          <div className="w-14 h-14 bg-[#C5A059]/10 rounded-2xl flex items-center justify-center text-[#C5A059] mb-4">
            <Upload size={24} />
          </div>
          <p className="text-white text-sm font-medium">Tıklayın veya dosyayı buraya sürükleyin</p>
        </div>
      ) : (
        <div className="bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-3xl p-5 flex items-center justify-between group">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="w-12 h-12 bg-[#C5A059]/20 rounded-xl flex items-center justify-center text-[#C5A059] shrink-0">
              <FileDown size={24} />
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-semibold truncate italic">{selectedFile.name}</p>
              <p className="text-slate-500 text-xs mt-0.5">{selectedFile.size} MB</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <div className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} />
            </div> */}
            <button
              onClick={removeFile}
              className="w-8 h-8 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-start gap-3 text-rose-400 text-xs">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
