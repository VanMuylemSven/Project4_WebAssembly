/* emcc wasm/sum.c  -Os  -s WASM=1  -s MODULARIZE=1  -s DEMANGLE_SUPPORT=1  -s ALLOW_MEMORY_GROWTH=1  -s "EXPORTED_FUNCTIONS=['_sum']"  -o wasm/sum.js */
int sum(int *array, int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        s += array[i];
    }
    return s;
}