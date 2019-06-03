(function(){
    let el = document.getElementById("btn_fib");
    el.addEventListener("click", start);

    let fibNumber = document.getElementById("inputFibNumber");
    let loopSize = document.getElementById("inputFibLoops");

    function jsFib(n) {
        if (n === 1) return 1;
        if (n === 2) return 1;
        return jsFib(n-1) + jsFib(n-2);
    }

    function start() {
        console.log("Executing Fibonaccci performance test: ");
        let num = fibNumber.value;
        let loop = loopSize.value;
    
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
            return ((endTime - startTime)).toFixed(2);
        }
    
        // don't use Promise for the non Promise support browsers so far.
        setTimeout(function () {
            jsPerformance.innerText = run(jsFib, num, loop) + " ms";
            setTimeout(function () {
                wsPerformance.innerText = run(functions.fib, num, loop) + " ms";
            });
        });
    }

})();
