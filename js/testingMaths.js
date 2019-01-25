//Old version
// -> Problems with WASM code instantiation
// -> SumInt.js <-
(function() {
    'use strict';

    //Buttons & elements
    let btn = document.getElementById("btn_sum_js");
    btn.addEventListener("click", jsSum);
    btn = document.getElementById("btn_sum_wasm");
    btn.addEventListener("click", waSum);
    

})();

///////////////////////////
// Maths : Sum functions // 
///////////////////////////
function jsSum() {
    console.log("Executing Js Sum testing: ")
    console.log("-> Array(10000), 100 iterations ")
    let num = 10000;
    let loop = 100;
    let jsResult = document.getElementById("sum_js_result");
    let arr = new Int32Array(num);
    //Fill array
    for (let i = 0, len = arr.length; i < len; i++) {
        arr[i] = ((Math.random() * 20000) | 0) - 10000;
    }

    function jsSumInt(arr, n){
        let s = 0;
        for (let i = 0; i < n; i++) {
            s += arr[i];
        }
        return s;
    }
    
    jsResult.innerText = runSumPerformance(jsSumInt, arr, loop)
}
function runSumPerformance(func, array, loop) {
    let elapsedTime = 0.0;
    for (let i = 0; i < loop; i++) {
    let startTime = performance.now(); //Start of performance
    func(array, array.length);
    let endTime = performance.now();
    elapsedTime += (endTime - startTime);
    }
    console.log("Elapsed Time = " + (elapsedTime / loop).toFixed(4));
    return (elapsedTime / loop).toFixed(4);
}
function waSum(){
    console.log("Executing Wasm Sum testing: ")
    console.log("-> Array(10000), 100 iterations ")

    

    //
    let num = 100;
    let loop = 10;
    let wasmResult = document.getElementById("sum_wasm_result");
    let arr = new Int32Array(num);
    //Fill array
    for (let i = 0, len = arr.length; i < len; i++) {
        arr[i] = ((Math.random() * 20000) | 0) - 10000;
    }

    function waSumInt(array, n) {
        let pointer = module._malloc(array.length * 4);
        let offset = pointer / 4;
        module.HEAP32.set(array, offset);
        let result = functions.sumInt(pointer, n);
        module._free(pointer);
        return result;
    }

    wasmResult.innerText = runSumPerformance(waSumInt, arr, loop);
}