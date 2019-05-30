#include <stdio.h>
#include <string.h>
#include <emscripten/fetch.h>
#include <iostream>
#include <chrono>

/* emcc wasm/fetch_bol3.cpp  -Os -s WASM=1 -s MODULARIZE=1 -s ASSERTIONS=1 -s FETCH=1 -s -o wasm/fetch_cat_wonen.js */

//For logging purposes
auto start_time = std::chrono::high_resolution_clock::now();

/*////////////////////////
// This file contains the code for fetching
// -> Compiled to .wasm file with emscripten <-
*////////////////////////
void downloadSucceeded(emscripten_fetch_t *fetch) {
    auto end_time = std::chrono::high_resolution_clock::now();
    auto time = end_time - start_time;
    printf("Finished downloading %llu bytes from URL %s.\n", fetch->numBytes, fetch->url);
    printf("Time to fetch = %lld ms\n", time/std::chrono::milliseconds(1));
    emscripten_fetch_close(fetch); // Free data associated with the fetch.
}

void downloadFailed(emscripten_fetch_t *fetch) {
    printf("Downloading %s failed, HTTP failure status code: %d.\n", fetch->url, fetch->status);
    emscripten_fetch_close(fetch); // Also free data on failure.
}

int main() {
    emscripten_fetch_attr_t attr;
    emscripten_fetch_attr_init(&attr);
    strcpy(attr.requestMethod, "GET");
    attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY | EMSCRIPTEN_FETCH_PERSIST_FILE;
    attr.onsuccess = downloadSucceeded;
    attr.onerror = downloadFailed;
    emscripten_fetch(&attr, "./json/bol_list3.json");
}