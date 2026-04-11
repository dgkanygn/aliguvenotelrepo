import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title = "Öğeyi Sil", message = "Bu öğeyi silmek istediğinize emin misiniz?", isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />
      
      {/* Modal Box */}
      <div className="relative w-full max-w-sm bg-[#0F172A] border border-white/10 rounded-[32px] p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <button 
          title="Kapat"
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-6 top-6 text-slate-500 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            {message} İşlem geri alınamaz.
          </p>

          <div className="flex items-center gap-3 w-full">
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              İptal
            </button>
            <button 
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Evet, Sil"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
