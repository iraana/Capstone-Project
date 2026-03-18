use wasm_bindgen::prelude::*;
use std::io::Cursor;
use image::{load_from_memory, ImageOutputFormat};
use image::imageops::FilterType;

#[wasm_bindgen] // This tells Rust that this function should work with JavaScript
// pub means public and fn means function
// It takes image data as a byte array
// It will return either a new byte array or an error
pub fn process_image(data: &[u8]) -> Result<Vec<u8>, JsValue> {
    console_error_panic_hook::set_once(); // Makes error messages more readable in the browser console

    // Load the image from the provided byte array
    let img = load_from_memory(data)
        // If it fails, we stop right here and return an error message to JavaScript
        .map_err(|e| JsValue::from_str(&format!("Failed to load image: {}", e)))?;

    // Resizes the image to 1280x960, recropes if needed, and uses Lanczos3 for high-quality resizing
    let scaled = img.resize_to_fill(1280, 960, FilterType::Lanczos3);

    // Creates a new buffer to hold the output image data
    let mut buffer = Cursor::new(Vec::new());

    // Writes the scaled image to the buffer in WebP format
    scaled.write_to(&mut buffer, ImageOutputFormat::WebP)
        .map_err(|e| JsValue::from_str(&format!("Failed to save webp: {}", e)))?;

    // Returns the contents of the buffer as a byte array to JavaScript
    Ok(buffer.into_inner())
}