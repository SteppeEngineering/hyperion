use wasm_bindgen::prelude::*;

// Expose this function to JavaScript
#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
