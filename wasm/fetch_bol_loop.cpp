#include <stdio.h>
#include <string.h>
#include <emscripten/fetch.h>
#include <iostream>
#include <chrono>

/* emcc wasm/fetch_bol_loop.cpp  -Os -s WASM=1 -s ASSERTIONS=1 -s FETCH=1 -s -o wasm/fetch_bol_loop.js */
//For Module functionality
/* emcc wasm/fetch_bol_loop.cpp -s WASM=1 -s ASSERTIONS=1 -s MODULARIZE=1 -s FETCH=1 -s -o wasm/fetch_bol_loop_mod.js */ 
/* emcc wasm/fetch_bol_loop.cpp -s WASM=1 -s ASSERTIONS=1 -s MODULARIZE=1 -s FETCH=1 -s ALLOW_MEMORY_GROWTH=1 -s -o wasm/fetch_url_loop_mod.js */ 
auto start_time = std::chrono::high_resolution_clock::now();
int indexCounter = 0;
float averageTime = 0;

void downloadSucceeded(emscripten_fetch_t *fetch) {
    auto end_time = std::chrono::high_resolution_clock::now();
    auto time = end_time - start_time;
    //printf("time = %lld ms\n", time/std::chrono::microseconds(1)); //Prints every loop
    emscripten_fetch_close(fetch); // Free data associated with the fetch.
    //averageTime += time/std::chrono::microseconds(1);
    indexCounter++;
    if(indexCounter == 1000){
        //float avg = time/std::chrono::microseconds(1) / 100.0;
        //averageTime = averageTime / 100.0;
        //printf("Average time to fetch = %f ms\n", averageTime);
        printf("total time to fetch x 1000 = %lld ms\n", time/std::chrono::milliseconds(1));
    }
}

void downloadFailed(emscripten_fetch_t *fetch) {
    printf("Downloading %s failed, HTTP failure status code: %d.\n", fetch->url, fetch->status);
    emscripten_fetch_close(fetch); // Also free data on failure.
}

int main() {
    for(size_t i = 0; i < 1000; i++)
    {
        emscripten_fetch_attr_t attr;
        emscripten_fetch_attr_init(&attr);
        strcpy(attr.requestMethod, "GET");
        attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY | EMSCRIPTEN_FETCH_PERSIST_FILE;
        attr.onsuccess = downloadSucceeded;
        attr.onerror = downloadFailed;
        emscripten_fetch(&attr, "https://restcountries.eu/rest/v2/lang/es");
        //https://restcountries.eu/rest/v2/lang/es
        //     "/bol_list3.json"
    }
}