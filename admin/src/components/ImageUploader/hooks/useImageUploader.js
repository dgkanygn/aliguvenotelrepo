import { useState, useCallback } from 'react';

export const useImageUploader = ({ multiple, maxFileSize, idealResolution, onChange }) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);

  const validateFile = (file) => {
    return new Promise((resolve) => {
      const errors = [];

      // Size check
      if (maxFileSize && file.size > maxFileSize * 1024 * 1024) {
        errors.push(`Dosya boyutu çok büyük. Maksimum: ${maxFileSize}MB`);
      }

      // Resolution check (optional/warning)
      if (idealResolution) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          if (img.width < idealResolution.width || img.height < idealResolution.height) {
            // This is a warning, not necessarily a rejection, but we'll flag it
            console.warn(`Düşük çözünürlük: ${img.width}x${img.height}. Önerilen: ${idealResolution.width}x${idealResolution.height}`);
          }
          resolve(errors);
        };
        img.onerror = () => resolve(['Geçersiz imaj dosyası']);
      } else {
        resolve(errors);
      }
    });
  };

  const onDrop = useCallback(async (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer?.files || e.target.files);
    
    if (!multiple && droppedFiles.length > 1) {
      setErrors(['Sadece tek bir dosya yükleyebilirsiniz.']);
      return;
    }

    const newFiles = multiple ? [...files] : [];
    const newErrors = [];

    for (const file of droppedFiles) {
      const fileErrors = await validateFile(file);
      if (fileErrors.length === 0) {
        newFiles.push(Object.assign(file, {
          preview: URL.createObjectURL(file)
        }));
      } else {
        newErrors.push(`${file.name}: ${fileErrors.join(', ')}`);
      }
    }

    setFiles(newFiles);
    if(onChange) onChange(newFiles);
    setErrors(newErrors);
  }, [files, multiple, maxFileSize, idealResolution, onChange]);

  const removeFile = (index) => {
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setFiles(newFiles);
    if(onChange) onChange(newFiles);
  };

  const clearErrors = () => setErrors([]);

  return {
    files,
    errors,
    onDropWrapper: onDrop,
    removeFile,
    clearErrors,
    setFiles
  };
};
