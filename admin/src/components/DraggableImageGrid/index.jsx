import React from 'react';
import { X, GripVertical } from 'lucide-react';
import { useDragSort } from '../../hooks/useDragSort';

/**
 * Sürükle/bırak destekli görsel grid bileşeni.
 * Edit modunda görsellerin sırasını doğrudan grid üzerinde değiştirebilirsiniz.
 *
 * Props:
 *   images: Array - Gösterilecek görsel dizisi
 *   isEditing: boolean - Edit modunda mı?
 *   onReorder: (newImages) => void - Sıralama değiştiğinde çağrılır
 *   onRemove: (index) => void - Görsel silindiğinde çağrılır
 *   altText: string - img alt metni
 */
const DraggableImageGrid = ({ images, isEditing, onReorder, onRemove, altText = 'image' }) => {
  const {
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  } = useDragSort(images, onReorder);

  return (
    <>
      {images?.map((img, idx) => (
        <div
          key={img.id || idx}
          draggable={isEditing}
          onDragStart={isEditing ? (e) => handleDragStart(e, idx) : undefined}
          onDragOver={isEditing ? (e) => handleDragOver(e, idx) : undefined}
          onDragLeave={isEditing ? handleDragLeave : undefined}
          onDrop={isEditing ? (e) => handleDrop(e, idx) : undefined}
          onDragEnd={isEditing ? handleDragEnd : undefined}
          className={`
            relative aspect-video rounded-xl overflow-hidden border transition-all
            ${isEditing ? 'cursor-grab active:cursor-grabbing' : ''}
            ${draggedIndex === idx
              ? 'opacity-30 border-[#C5A059]/40 scale-95'
              : dragOverIndex === idx
                ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30 scale-[1.03]'
                : 'border-white/10'
            }
          `}
        >
          <img
            src={img.image_url || img.url}
            className="w-full h-full object-cover pointer-events-none"
            alt={altText}
            draggable={false}
          />

          {/* Sıra numarası badge'i - edit modunda */}
          {isEditing && (
            <div className={`
              absolute top-2 left-2 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold
              ${idx === 0
                ? 'bg-[#C5A059] text-white shadow-md'
                : 'bg-black/60 text-white/80 backdrop-blur-sm'
              }
            `}>
              {idx + 1}
            </div>
          )}

          {/* Grip handle - edit modunda */}
          {isEditing && (
            <div className="absolute bottom-2 left-2 p-1 bg-black/50 text-white/70 rounded-md backdrop-blur-sm">
              <GripVertical size={12} />
            </div>
          )}

          {/* Sil butonu - edit modunda */}
          {isEditing && (
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
              className="absolute top-2 right-2 p-1.5 bg-rose-500/90 text-white rounded-lg hover:bg-rose-500 hover:scale-110 transition-all shadow-md cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}
    </>
  );
};

export default DraggableImageGrid;
