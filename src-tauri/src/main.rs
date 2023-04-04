#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::fs::{File, metadata};
use std::io::prelude::*;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      write_file,
      get_dir_files,
      read_file
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn write_file(path: String, content: String) -> Result<(), String> {
  let mut file = File::create(path).unwrap();
  file.write_all(content.as_bytes()).unwrap();
  Ok(())
}

#[tauri::command]
fn get_dir_files(path: String) -> Result<Vec<String>, String> {
  if !is_directory_or_file(&path) {
    return Err("not a directory".to_string());
  }
  let mut files = Vec::new();
      for entry in std::fs::read_dir(path).unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();
        if path.is_file() {
          files.push(path.to_str().unwrap().to_string());
        }
      }

  Ok(files)
}

#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
  if is_directory_or_file(&path) {
    return Err("not a file".to_string());
  }
  let mut file = File::open(path).unwrap();
  let mut contents = String::new();
  file.read_to_string(&mut contents).unwrap();
  Ok(contents)
}

fn is_directory_or_file(directory_path: &str) -> bool {
    match metadata(directory_path) {
        Ok(metadata) => metadata.is_dir(),
        Err(_) => false,
    }
}
