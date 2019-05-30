(function(){
    let el = document.getElementById("btn_sumInt");
    el.addEventListener("click", start);
})();

function start() {
    console.log("Executing SumInt performance tests: ");

    let num = 100000;
    let loop = 10000;
    let jsPerformance = document.getElementById('sum_js_result');
    let wsPerformance = document.getElementById('sum_wasm_result');
    let array = new Int32Array(num);
    
    initArray(array);
    function initArray(array) {
        for (let i = 0, il = array.length; i < il; i++) {
        array[i] = ((Math.random() * 20000) | 0) - 10000;
        }
    }
    
    function jsSumInt(array, n) {
        let s = 0;
        for (let i = 0; i < n; i++) {
        s += array[i];
        }
        return s;
    }
    
    function run(func, array, loop) {
        let elapsedTime = 0.0;
        let startTime = performance.now();
        // console.log(startTime);
        for (let i = 0; i < loop; i++) {
            func(array, array.length);
        }
        let endTime = performance.now();
        elapsedTime += (endTime - startTime);
        // console.log(endTime);
        return (elapsedTime).toFixed(2);
    }
    
    
    function waSumInt(array, n) {
        let pointer = module._malloc(array.length * 4);
        let offset = pointer / 4;
        module.HEAP32.set(array, offset);
        let result = functions.sumInt(pointer, n);
        module._free(pointer);

        return result;
    }
    
    // don't use Promise for the non Promise support browsers so far.
    setTimeout(function () {
        jsPerformance.innerText = run(jsSumInt, array, loop) + " ms";
        setTimeout(function () {
        wsPerformance.innerText = run(waSumInt, array, loop) + " ms";
        });
    });
}