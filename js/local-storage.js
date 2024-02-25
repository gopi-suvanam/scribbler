
function createIndexedDB() {
  // Open (or create) the database
  const request = window.indexedDB.open('Scribbler', 1);

  // Event triggered when the database is created or its version is upgraded
  request.onupgradeneeded = function(event) {
    const db = event.target.result;

    // Check if the object store already exists
    if (!db.objectStoreNames.contains('FileSystem')) {
      // Create a new object store
      const objectStore = db.createObjectStore('FileSystem', { keyPath: 'id', autoIncrement: true });

      // Define the structure of the object store
      objectStore.createIndex('fileName', 'fileName', { unique: false });
      // You can add more indexes if needed
    }
  };

  // Event triggered when the database is successfully opened
  request.onsuccess = function(event) {
    const db = event.target.result;
    console.log('Database opened successfully:', db);
  };

  // Event triggered if there's an error while opening the database
  request.onerror = function(event) {
    console.error('Error opening database:', event.target.error);
  };
}

// Call the function to create the IndexedDB database and object store
createIndexedDB();


function getAllFileNames() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('Scribbler', 1);

    request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction(['FileSystem'], 'readonly');
      const objectStore = transaction.objectStore('FileSystem');
      const files= [];

      objectStore.openCursor().onsuccess = function(cursorEvent) {
        const cursor = cursorEvent.target.result;
        if (cursor) {
          // Push each fileName into the array
          files.push({name:cursor.value.name,id:cursor.value.id,updateTime:cursor.value.updateTime});
          cursor.continue();
        } else {
          // Resolve the promise with the array of fileNames when cursor iteration is done
          resolve(files);
        }
      };

      transaction.oncomplete = function() {
        db.close();
      };
    };

    request.onerror = function(event) {
      reject(event.target.error);
    };
  });
}


 insertOrUpdateFile=function(nb, name,update_time,id) {
  object = {};
  object['nb']=nb;
  object['name']=name;
  object['updateTime']=update_time;
  if(typeof(id)!=='undefined')
  	object['id']=id;
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('Scribbler', 1);

    request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction(['FileSystem'], 'readwrite');
      const objectStore = transaction.objectStore('FileSystem');

      const addObjectRequest = object.id ? objectStore.put(object) : objectStore.add(object);

      addObjectRequest.onsuccess = function(event) {
        // If no ID was provided, return the newly generated ID
        if (!object.id) {
          resolve(event.target.result);
        } else {
          resolve(object.id); // Return the provided ID if object was updated
        }
      };

      transaction.oncomplete = function() {
        db.close();
      };
    };

    request.onerror = function(event) {
      reject(event.target.error);
    };
  });
}


function deleteFileById(id) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('Scribbler', 1);

    request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction(['FileSystem'], 'readwrite');
      const objectStore = transaction.objectStore('FileSystem');

      const deleteRequest = objectStore.delete(id);

      deleteRequest.onsuccess = function() {
        resolve('Object deleted successfully');
      };

      deleteRequest.onerror = function(event) {
        reject(event.target.error);
      };

      transaction.oncomplete = function() {
        db.close();
      };
    };

    request.onerror = function(event) {
      reject(event.target.error);
    };
  });
}


function getFileById(id) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('Scribbler', 1);

    request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction(['FileSystem'], 'readonly');
      const objectStore = transaction.objectStore('FileSystem');

      const getRequest = objectStore.get(parseInt(id));

      getRequest.onsuccess = function(event) {
        const result = event.target.result;
        if (result) {
          resolve(result); // Resolve with the retrieved object
        } else {
          reject('Object not found'); // Reject if object with the given ID doesn't exist
        }
      };

      getRequest.onerror = function(event) {
        reject(event.target.error);
      };

      transaction.oncomplete = function() {
        db.close();
      };
    };

    request.onerror = function(event) {
      reject(event.target.error);
    };
  });
}



