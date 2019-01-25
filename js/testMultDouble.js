(function(){
    let el = document.getElementById("btn_mult");
    el.addEventListener("click", start);
})();

function jsMultiplyDouble(a, b, n) {
    let c = 1.0;
    for (let i = 0; i < n; i++) {
        c = c * a * b;
    }
    return c;
    }

function start() {
    console.log("Executing multiplication performance test: ");

    let num = 10000;
    let loop = 10;

    let jsPerformance = document.getElementById('js_mult');
    let wsPerformance = document.getElementById('wasm_mult');

    jsPerformance.innerText = '';
    wsPerformance.innerText = '';

    function run(func, n, loop) {
        func(n); // warm-up
        let elapsedTime = 0.0;
        for (let i = 0; i < loop; i++) {
        let startTime = performance.now();
        func(1.0, 1.0, n);
        let endTime = performance.now();
        elapsedTime += (endTime - startTime);
        }
        return (elapsedTime / loop).toFixed(4);
    }

    setTimeout(function () {
    jsPerformance.innerText = run(jsMultiplyDouble, num, loop) + " ms";
        setTimeout(function () {
            wsPerformance.innerText = run(functions.multiplyDouble, num, loop) + " ms";
        });
    });
}