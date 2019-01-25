(function(){
    let el = document.getElementById("btn_fib");
    el.addEventListener("click", start);
})();

function jsFib(n) {
    if (n === 1) return 1;
    if (n === 2) return 1;
    return jsFib(n-1) + jsFib(n-2);
}

function start() {
    console.log("Executing Fibonaccci performance test: ");
    console.log("- 10 loops to 40th number")    
    let num = 40;
    let loop = 10;
    
    let jsPerformance = document.getElementById('js_result');
    let wsPerformance = document.getElementById('wasm_result');
    
    jsPerformance.innerText = '';
    wsPerformance.innerText = '';
    
    function run(func, n, loop) {
        let startTime = performance.now();
        for (let i = 0; i < loop; i++) {
        func(n);
        }
        let endTime = performance.now();
        return ((endTime - startTime) / loop).toFixed(4);
    }
    
    // don't use Promise for the non Promise support browsers so far.
    setTimeout(function () {
        jsPerformance.innerText = run(jsFib, num, loop) + " ms";
        setTimeout(function () {
            wsPerformance.innerText = run(functions.fib, num, loop) + " ms";
        });
    });
    }