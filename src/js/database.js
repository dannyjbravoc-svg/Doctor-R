// src/js/database.js
const DB_NAME = 'MediVzlaStorage';
const DB_VERSION = 1;
const STORE_NAME = 'imagenes';

let db = null;

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('metadata', 'metadata', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject(new Error(`Error al inicializar IndexedDB: ${event.target.error}`));
    };
  });
};

export const saveImage = (id, blob, metadata) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Base de datos no inicializada'));
      return;
    }

    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const imageRecord = {
      id,
      blob,
      metadata,
      createdAt: new Date().toISOString()
    };
    
    const request = store.put(imageRecord);
    
    request.onsuccess = () => {
      resolve(imageRecord);
    };
    
    request.onerror = (event) => {
      reject(new Error(`Error al guardar imagen: ${event.target.error}`));
    };
  });
};

export const getImage = (id) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Base de datos no inicializada'));
      return;
    }

    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.get(id);
    
    request.onsuccess = (event) => {
      const result = event.target.result;
      if (result) {
        resolve(result);
      } else {
        reject(new Error(`Imagen no encontrada: ${id}`));
      }
    };
    
    request.onerror = (event) => {
      reject(new Error(`Error al obtener imagen: ${event.target.error}`));
    };
  });
};

export const deleteImage = (id) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Base de datos no inicializada'));
      return;
    }

    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve(true);
    };
    
    request.onerror = (event) => {
      reject(new Error(`Error al eliminar imagen: ${event.target.error}`));
    };
  });
};

// Inicializar la base de datos al cargar
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initDatabase();
    console.log('IndexedDB inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar IndexedDB:', error);
  }
});
