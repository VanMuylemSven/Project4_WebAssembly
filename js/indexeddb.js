(function() {
    'use strict';

    //Button clicks
    let cat = document.getElementsByClassName("category");
    for (let index = 0; index < cat.length; index++) {
        cat[index].addEventListener("click", changeCategory);
    }
    let filter = document.getElementById("btn_filter_items");
    filter.addEventListener("click", filterItems);

    // Load
    // Adding the script tag to the head //-> Old method, this can only be used once, not for loading multiple scripts/wasm modules!
    /*let head = document.head;
    let script = document.createElement('script');
    script.src = "./wasm/fetch_bol3.js";
    head.appendChild(script);*/
    
    ModuleElek();
    ConnectToIdb("elek");
    
})();

function changeCategory(event){
    //If clicked, find 'selected' and remove '> ' + 'selected'-class, and add to the new selected item
    let cat = document.getElementsByClassName("category");
    for (let index = 0; index < cat.length; index++) {
        if(cat[index].classList.contains("selected_category")){
            cat[index].classList.remove("selected_category")
            cat[index].textContent = cat[index].textContent.substr(2);
        }
    }
    event.target.classList = "selected_category category";
    event.target.textContent = "> " + event.target.textContent;
    //Load the new json, remove all current items
    let container = document.getElementById("item_container");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    //Load the new wasm module, Get from indexeddb
    //IndexedDB connection
    if(event.target.name == "elek"){
        ModuleElek();
    }
    else if(event.target.name == "muziek"){
        ModuleMuziek();
    }
    else if(event.target.name == "school"){
        ModuleSchool();
    }
    else if(event.target.name == "speel"){
        ModuleSpeel();
    }
    else if(event.target.name == "wonen"){
        ModuleWonen();
    }
    ConnectToIdb(event.target.name);
    
    
}
function ConnectToIdb(dbName){
    console.log("connecting to IndexedDB ./json/bol_cat_" + dbName + ".json");
    setTimeout(() => {
        let idb = window.indexedDB;
        let storeName = "FILES"; //Case sensitive!
        let request = idb.open('emscripten_filesystem')
        let db;
        request.onsuccess = function() {
            db = request.result;
            let transaction = db.transaction(storeName, 'readonly');
            let objectStore = transaction.objectStore(storeName);

            // IDBObjectStore.getAll() will return the full set of items in our store.
            objectStore.get("./json/bol_cat_" + dbName + ".json").onsuccess = function (event) {
                ConvertToJSON(event.target.result);
            } 
        };
    }, 100);
}

function ConvertToJSON(result){
    console.log(result);
    let int8View = new Int8Array(result);
    //console.log(int8View);
    let str = String.fromCharCode.apply(String, int8View); //RangeError when array too large...
    console.log("= Converting to JSON =");
    let json = JSON.parse(str);
    console.log(json);
    AddJSONToPage(json);
}

function AddJSONToPage(json){
    console.log("= Adding Json items to the page =")
    let container = document.getElementById("item_container");
    let item, title, image, description, link;
    json.products.forEach(element => {
        //console.log(element);
        item = document.createElement("div");
        item.className = "item";

        title = document.createElement("p");
        title.className = "item_title";
        title.innerHTML = element.title;
        image = document.createElement("img");
        image.className = "item_img";
        image.src = element.media[0].url;
        description = document.createElement("p");
        description.className = "item_description";
        //trim description length :
        let strLength = 400;
        if(element.shortDescription.length > strLength){
            description.innerHTML = element.shortDescription.substring(0, strLength) + "...";
        }
        else {
            description.innerHTML = element.shortDescription;
        }
        link = document.createElement("a");
        link.className = "item_url";
        link.innerHTML = "> Order now"
        link.href = element.urls[0].value;

        item.appendChild(title);
        item.appendChild(image);
        item.appendChild(description);
        item.appendChild(link);
        container.appendChild(item);
    });
}

function filterItems(){
    let filterText = document.getElementById("input_filter").value.toLowerCase();
    console.log("filtering on " + filterText);
    //get all items
    let items = document.getElementsByClassName("item");
    //Remove all hidden
    for (let index = 0; index < items.length; index++) {
        items[index].className = "item";
    }
    //set hidden
    for (let index = 0; index < items.length; index++) {
        //console.log(items[index].childNodes); //0 title, 2 descr
        if(items[index].childNodes[0].textContent.toLowerCase().indexOf(filterText) > -1 
        || items[index].childNodes[2].textContent.toLowerCase().indexOf(filterText) > -1){
            //console.log(items[index].childNodes[0].textContent + " CONTAINS " + filterText);
        }
        else{
            //console.log("hiding " + items[index])
            items[index].classList.add("item_hidden")
        }
    }
}

/*
// 
someObjectStore.getAll(optionalConstraint);
dbPromise.then(function(db) {
    let tx = db.transaction('store', 'readonly');
    let store = tx.objectStore('store');
    return store.getAll();
    }).then(function(items) {
    console.log('Items by name:', items);
    });
*/

// Example code for opening the Chrome IndexedDB and getting results
/*// Let us open our database
let DBOpenRequest = window.indexedDB.open("emscripten_filesystem");

DBOpenRequest.onsuccess = function(event) {
console.log("<li>Database initialised.</li>");
    
// store the result of opening the database in the db letiable.
// This is used a lot below
db = DBOpenRequest.result;
    
// Run the getData() function to get the data from the database
getData();
};

function getData() {
// open a read/write db transaction, ready for retrieving the data
let transaction = db.transaction(["./json/bol_list1.json"], "readwrite");

// report on the success of the transaction completing, when everything is done
transaction.oncomplete = function(event) {
    console.log("<li>transaction completed.</li>");
};

transaction.onerror = function(event) {
    console.log("<li>Transaction not opened due to error: " + transaction.error);
};

// create an object store on the transaction
let objectStore = transaction.objectStore("toDoList");

// Make a request to get a record by key from the object store
let objectStoreRequest = objectStore.get("./json/bol_list1.json");

objectStoreRequest.onsuccess = function(event) {
    // report the success of our request
    console.log("request succcessfull");

    let myRecord = objectStoreRequest.result;
};

};*/