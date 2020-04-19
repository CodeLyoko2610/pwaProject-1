//Open db, create store if not yet created
//Parameter list: dbName, version, callbackFunction
let idbPromise = idb.open('posts-store', 1, function (db) {
    if (!db.objectStoreNames.contains('posts')) {
        db.createObjectStore('posts', {
            keyPath: 'id'
        })
    }

    if (!db.objectStoreNames.contains('sync-posts')) {
        db.createObjectStore('sync-posts', {
            keyPath: 'id'
        })
    }
})

//Put data in db
function writeData(storeName, data) {
    return idbPromise
        .then(function (db) {
            //Set up transaction
            let tx = db.transaction(storeName, 'readwrite');
            let store = tx.objectStore(storeName);

            //Put data in
            store.put(data);

            //Return a promise
            //Close transaction only when successful
            return tx.complete;
        })
}

//Read data in db
function readAllData(storeName) {
    return idbPromise
        .then(function (db) {
            let tx = db.transaction(storeName, 'readonly');
            let store = tx.objectStore(storeName);

            //Read data and return data, null is returned if failed
            //No need to indicate transaction succeed with tx.complete, as no change to db made
            return store.getAll();
        })
}

//Delete all data in db
function clearAllData(storeName) {
    return idbPromise
        .then(function (db) {
            let tx = db.transaction(storeName, 'readwrite');
            let store = tx.objectStore(storeName);


            store.clear();
            //Clear the store, return promise when successfully finish the process
            return tx.complete;
        })
}

//Delete single item
function deleteSingleItem(storeName, itemId) {
    idbPromise
        .then(function (db) {
            let tx = db.transaction(storeName, 'readwrite');
            let store = tx.objectStore(storeName);

            store.delete(itemId);
            return tx.complete;
        })
        //Handle the promise right here, no need for "return idbPromise"
        .then(function (something) {
            console.log('Item deleted.');
        })
}