#include <stdio.h>
#include <string.h>
#include <emscripten/fetch.h>
#include <iostream>
#include <chrono>

/*////////////////////////
// This file contains the code for fetching
// -> Compiled to .wasm file with emscripten <-
*////////////////////////
auto start_time = std::chrono::high_resolution_clock::now();


void downloadSucceeded(emscripten_fetch_t *fetch) {

/*printf("t0 :%d =\n", t0);
printf("t1 :%d =\n", t1);
printf("Time elapsed :%d s\n", t1 - t0);*/
printf("Finished downloading %llu bytes from URL %s.\n", fetch->numBytes, fetch->url);
// The data is now available at fetch->data[0] through fetch->data[fetch->numBytes-1];
auto end_time = std::chrono::high_resolution_clock::now();
auto time = end_time - start_time;
printf("time = %lld ms\n", time/std::chrono::microseconds(1));
emscripten_fetch_close(fetch); // Free data associated with the fetch.

}

void downloadFailed(emscripten_fetch_t *fetch) {
printf("Downloading %s failed, HTTP failure status code: %d.\n", fetch->url, fetch->status);
emscripten_fetch_close(fetch); // Also free data on failure.
}

int main() {
    
    for(size_t i = 0; i < 20; i++)
    {
        emscripten_fetch_attr_t attr;
        emscripten_fetch_attr_init(&attr);
        strcpy(attr.requestMethod, "GET");
        attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY | EMSCRIPTEN_FETCH_PERSIST_FILE;
        attr.onsuccess = downloadSucceeded;
        attr.onerror = downloadFailed;
        emscripten_fetch(&attr, "./json/bol_list1.json");
    }

}