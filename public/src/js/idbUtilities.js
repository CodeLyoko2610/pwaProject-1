//Open db, create store if not yet created
let idbPromise = idb.open('posts-store', 1, function (db) {
    if (!db.objectStoreNames.contains('posts')) {
        db.createObjectStore('posts', {
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

            //Close transaction with "done" promise
            return tx.complete;
        })
}