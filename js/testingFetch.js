(function() {
    'use strict';
    //Load Bol. JSON for IDB testing
    ModuleBol();

    //Buttons & elements
    let btn = document.getElementById("btn_fetch_js");
    btn.addEventListener("click", fetchJson);
    // btn = document.getElementById("btn_fetch_wasm");
    // btn.addEventListener("click", fetchWasm);
    btn = document.getElementById("btn_fetchurl_js");
    btn.addEventListener("click", fetchUrlJson);
    btn = document.getElementById("btn_db_wasm");
    btn.addEventListener("click", convertIDBToJson);
    
    
})();

let loopNr = 1000;

function fetchJson(){
    //Iterate 100 times for a fetch to json file
    let startTime = performance.now();
    let url = "./json/bol_list3.json";
    for (let index = 0; index < loopNr; index++) {

        fetch(url).then(function(response){
            return response.json();
        }).then(function(json){
            //console.log(json);
        }).catch(function(error){
            console.error("An error occurred during fetch: " + error);
        });
        
    }

    let endTime = performance.now();
    let dif = (endTime - startTime).toFixed(2);
    let result = document.getElementById("fetch_js_result");
    result.innerHTML = dif + " ms";
}
function fetchUrlJson(){
    //Iterate 100 times for a fetch to REST Api
    let startTime = performance.now();
    let url = "https://restcountries.eu/rest/v2/lang/es";
    for (let index = 0; index < loopNr; index++) {

        fetch(url).then(function(response){
            return response.json();
        }).then(function(json){
            //console.log(json);
        }).catch(function(error){
            console.error("An error occurred during fetch: " + error);
        });
        
    }

    let endTime = performance.now();
    let dif = (endTime - startTime).toFixed(2);
    let result = document.getElementById("fetchurl_js_result");
    result.innerHTML = dif + " ms";
}

//Produces promise/stacktrace errors when used multiple times
/*function fetchWasm(){
    let head = document.head;
    let script = document.createElement('script');
    script.src = "./wasm/fetch_bol_loop.js";
    head.appendChild(script);
}*/

function convertIDBToJson(){
    
    let startTime = performance.now();
    //IndexedDB connection
    let idb = window.indexedDB;
    let storeName = "FILES"; //Case sensitive!
    let request = idb.open('emscripten_filesystem')
    let db;
    request.onsuccess = function() {
        db = request.result;
        let transaction = db.transaction(storeName, 'readonly');
        let objectStore = transaction.objectStore(storeName);

        // IDBObjectStore.getAll() will return the full set of items in our store.
        objectStore.get("./json/bol_list3.json").onsuccess = function (event) {
            let endTime = performance.now();
            let dif = endTime - startTime;
            ConvertToJSON(event.target.result, dif);
        } 
    };
}
function ConvertToJSON(result, getTime){

    let startTime = performance.now();
    let int8View, str, json;
        int8View = new Int8Array(result);
        str = String.fromCharCode.apply(String, int8View);
        json = JSON.parse(str);
    
    
    let endTime = performance.now();
    let dif = endTime - startTime;
    let totalDif = getTime + dif;
    //Write results
    let dbGetRes = document.getElementById("db_get_result");
    dbGetRes.innerText = getTime.toFixed(2) + " ms";
    let dbTotalRes = document.getElementById("db_total_result");
    let dbConvertRes = document.getElementById("db_convert_result");
    console.log("Finished Converting indexedDB result to JSON in " + dif + " ms");
    dbConvertRes.innerHTML = dif.toFixed(2) + " ms";
    dbTotalRes.innerHTML = totalDif.toFixed(2) + " ms";
}
