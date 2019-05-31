(function(){
    let el = document.getElementById("btn_sort");
    el.addEventListener("click", start);
})();

function jsQuicksortInt(array, start, end) {
    if (start >= end) return;
    let pivot = array[end];
    let left = 0;
    let right = 0;
    while (left + right < end - start) {
        let num = array[start+left];
        if (num < pivot) {
        left++;
        } else {
        array[start+left] = array[end-right-1];
        array[end-right-1] = pivot;
        array[end-right] = num;
        right++;
        }
    }
    jsQuicksortInt(array, start, start+left-1);
    jsQuicksortInt(array, start+left+1, end);
    }

function start() {
    console.log("Executing Quicksort performance tests ");
    console.log("- 10,000 loops of array(10,000)")

    let num = 10000;
    let loop = 10000;
    
    let jsPerformance = document.getElementById('js_result');
    let wsPerformance = document.getElementById('wasm_result');
    
    jsPerformance.innerText = '';
    wsPerformance.innerText = '';
    
    let array0 = new Int32Array(num); // master
    let array1 = new Int32Array(num); // for JavaScript
    let array2 = new Int32Array(num); // for WebAssembly
    
    initArray(array0);
    
    function initArray(array) {
        for (let i = 0, il = array.length; i < il; i++) {
        array[i] = ((Math.random() * 20000) | 0) - 10000;
        }
    }
    function copyArray(src, res) {
        for (let i = 0, il = src.length; i < il; i++) {
        res[i] = src[i];
        }
    }
    
    function run(func, array, loop) {
        copyArray(array0, array);
        func(array, 0, array.length-1); // warm-up
        let elapsedTime = 0.0;
        for (let i = 0; i < loop; i++) {
        copyArray(array0, array);
        let startTime = performance.now();
        func(array, 0, array.length-1);
        let endTime = performance.now();
        elapsedTime += (endTime - startTime);
        }
        return (elapsedTime).toFixed(2);
    }
    
    function wsQuicksortInt(array, start, end) {
        let pointer = module._malloc(array.length * 4);
        let offset = pointer / 4;
        module.HEAP32.set(array, offset);
        functions.quicksortInt(pointer, start, end);
        array.set(module.HEAP32.subarray(offset, offset + end + 1));
        module._free(pointer);
    }
    
    // don't use Promise for the non Promise support browsers so far.
    setTimeout(function () {
        setTimeout(function () {
        jsPerformance.innerText = run(jsQuicksortInt, array1, loop) + " ms";
            setTimeout(function () {
                wsPerformance.innerText = run(wsQuicksortInt, array2, loop) + " ms";
            });
        });
    });
}