(function() {
    'use strict';
    var idb = window.indexedDB;
    var storeName = "FILES";
    var request = idb.open('emscripten_filesystem')
    var db;
    let arrayBuffer;
    request.onsuccess = function() {
        db = request.result;

        var transaction = db.transaction(storeName, 'readonly');
        var objectStore = transaction.objectStore(storeName);

        if ('getAll' in objectStore) {
            // IDBObjectStore.getAll() will return the full set of items in our store.
            arrayBuffer = objectStore.getAll().onsuccess = function (event) {
                ConvertToJSON(event.target.result);
            };
        } 
    };
})();

function ConvertToJSON(result){
    console.log("= Converting to JSON =");
    console.log(result);
    var int8View = new Int8Array(result[0]);
    console.log("parsing");
    var str = String.fromCharCode.apply(String, int8View);
    //console.log("str = " + str);
    var json = JSON.parse(str);
    console.log(json);
    AddJSONToPage(json);
}

function AddJSONToPage(json){
    console.log("= Adding Json items to the page =")
    
}

/*
// 
someObjectStore.getAll(optionalConstraint);
dbPromise.then(function(db) {
    var tx = db.transaction('store', 'readonly');
    var store = tx.objectStore('store');
    return store.getAll();
    }).then(function(items) {
    console.log('Items by name:', items);
    });
*/

// Example code for opening the Chrome IndexedDB and getting results
/*// Let us open our database
var DBOpenRequest = window.indexedDB.open("emscripten_filesystem");

DBOpenRequest.onsuccess = function(event) {
console.log("<li>Database initialised.</li>");
    
// store the result of opening the database in the db variable.
// This is used a lot below
db = DBOpenRequest.result;
    
// Run the getData() function to get the data from the database
getData();
};

function getData() {
// open a read/write db transaction, ready for retrieving the data
var transaction = db.transaction(["./json/bol_list1.json"], "readwrite");

// report on the success of the transaction completing, when everything is done
transaction.oncomplete = function(event) {
    console.log("<li>transaction completed.</li>");
};

transaction.onerror = function(event) {
    console.log("<li>Transaction not opened due to error: " + transaction.error);
};

// create an object store on the transaction
var objectStore = transaction.objectStore("toDoList");

// Make a request to get a record by key from the object store
var objectStoreRequest = objectStore.get("./json/bol_list1.json");

objectStoreRequest.onsuccess = function(event) {
    // report the success of our request
    console.log("request succcessfull");

    var myRecord = objectStoreRequest.result;
};

};*/