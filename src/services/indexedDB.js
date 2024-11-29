export const openDatabase = (dbName, storeName) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName);
  
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, { keyPath: "key" });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };
  
  export const addOrUpdateItem = async (db, storeName, key, value) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
  
      const timestamp = Date.now();
      const request = store.put({ key, value, timestamp });
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };
  
  export const getAllItems = (db, storeName) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
  
      const request = store.getAll();
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };
  
  export const deleteOldestItem = async (db, storeName) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const index = store.index("timestamp");
  
      const request = index.openCursor(null, "next");
  
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          resolve(cursor.key);
        } else {
          reject("No items to delete");
        }
      };
  
      request.onerror = () => reject(request.error);
    });
  };