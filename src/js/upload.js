// src/js/upload.js
import { saveImage } from './database.js';
import { showToast } from './notifications.js';

export const handleImageUpload = (fileInput, previewContainer) => {
  return new Promise((resolve, reject) => {
    if (!fileInput.files || fileInput.files.length === 0) {
      reject(new Error('No se seleccionó ninguna imagen'));
      return;
    }
    
    const file = fileInput.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    if (!validTypes.includes(file.type)) {
      reject(new Error('Formato de archivo no soportado. Use JPG, PNG o GIF'));
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('La imagen es demasiado grande. Máximo 5MB'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        // Comprimir la imagen
        const compressedImage = await compressImage(e.target.result, file.type);
        
        // Mostrar vista previa
        const preview = document.createElement('div');
        preview.className = 'file-preview-item';
        
        const img = document.createElement('img');
        img.src = compressedImage;
        img.className = 'file-preview-image';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'file-preview-remove';
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', () => {
          preview.remove();
          resolve(null);
        });
        
        preview.appendChild(img);
        preview.appendChild(removeBtn);
        
        // Limpiar contenedor y agregar nueva vista previa
        previewContainer.innerHTML = '';
        previewContainer.appendChild(preview);
        
        resolve({
          blob: dataURLToBlob(compressedImage),
          dataUrl: compressedImage,
          name: file.name,
          type: file.type
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsDataURL(file);
  });
};

const compressImage = (dataUrl, mimeType, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 1024;
      const MAX_HEIGHT = 1024;
      
      let width = img.width;
      let height = img.height;
      
      // Ajustar tamaño manteniendo aspect ratio
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      try {
        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
        resolve(compressedDataUrl);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = (err) => {
      reject(new Error('Error al cargar la imagen'));
    };
    
    img.src = dataUrl;
  });
};

const dataURLToBlob = (dataUrl) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

export const uploadImage = async (fileInput, metadata) => {
  try {
    const imageData = await handleImageUpload(fileInput, document.querySelector('.file-preview'));
    
    if (!imageData) return null;
    
    const imageId = generateId('img');
    
    // Guardar en IndexedDB
    await saveImage(imageId, imageData.blob, metadata);
    
    return {
      id: imageId,
      url: imageData.dataUrl,
      name: imageData.name,
      type: imageData.type,
      metadata
    };
  } catch (error) {
    showToast(error.message, 'error');
    throw error;
  }
};

export const initImageUploader = () => {
  const uploadContainers = document.querySelectorAll('.file-upload');
  
  uploadContainers.forEach(container => {
    const fileInput = container.querySelector('input[type="file"]');
    const previewContainer = container.nextElementSibling;
    
    if (!fileInput || !previewContainer) return;
    
    container.addEventListener('click', () => {
      fileInput.click();
    });
    
    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      container.classList.add('drag-over');
    });
    
    container.addEventListener('dragleave', () => {
      container.classList.remove('drag-over');
    });
    
    container.addEventListener('drop', (e) => {
      e.preventDefault();
      container.classList.remove('drag-over');
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        fileInput.files = e.dataTransfer.files;
        handleImageUpload(fileInput, previewContainer)
          .catch(error => showToast(error.message, 'error'));
      }
    });
    
    fileInput.addEventListener('change', () => {
      handleImageUpload(fileInput, previewContainer)
        .catch(error => showToast(error.message, 'error'));
    });
  });
};

// Inicializar carga de imágenes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initImageUploader();
});
