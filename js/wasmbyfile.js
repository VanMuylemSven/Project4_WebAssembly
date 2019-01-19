// https://rustwasm.github.io/wasm-bindgen/examples/fetch.html

/*let squarer;
let fetchByFile;

function loadWebAssemblySquarer(fileName) {
return fetch(fileName)
    .then(response => response.arrayBuffer())
    .then(bits => WebAssembly.compile(bits))
    .then(module => { return new WebAssembly.Instance(module) });
};
function loadWebAssembly(fileName) {
    return fetch(fileName)
        .then(response => response.arrayBuffer())
        .then(bits => WebAssembly.compile(bits))
    };
  
loadWebAssemblySquarer('./wasm/squarer.wasm') //Testing function
.then(instance => {
    squarer = instance.exports._Z7squareri;
    console.log('Finished compiling Squarer');
});


(function() {
    loadWebAssembly('./wasm/fetch.wasm');
})();
*/

//////////////////////////////
/*let importObj;
fetch('./wasm/fetch.wasm').then(response=>
response.arrayBuffer()
).then(buffer =>
    WebAssembly.instantiate(buffer, importObj)
).then(({module, instance}) =>
    console.log(instance.exports)
);*/

/*WebAssembly.instantiateStreaming(fetch('./wasm/fetch.wasm'))
.then(obj => {
    let test = obj.instance.exports
    console.log(test);
}
    );*/

// This is our recommended way of loading WebAssembly.
(async () => {
    const fetchPromise = fetch('./wasm/fetch.wasm');
    const { instance } = await WebAssembly.instantiateStreaming(fetchPromise);
    const result = instance.exports._main;
    console.log(result);
})();