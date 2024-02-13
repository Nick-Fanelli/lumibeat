// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;
use std::sync::Mutex;

use uuid::Uuid;

struct State {

    app_instances: Mutex<HashMap<String, tauri::Window>>

}

#[derive(Debug, serde::Serialize)]
struct WindowInfo {

    window_uuid: String

}

#[tauri::command]
fn get_app_window_info(window: tauri::Window, state: tauri::State<State>) -> Result<String, String> {

    let app_instances = state.app_instances.lock().unwrap();
    let lookup_window = app_instances.get(&String::from(window.label()));

    match lookup_window {

        Some(value) => {
            let window_info = WindowInfo {
                window_uuid: value.label().to_owned()
            };

            let json_string = serde_json::to_string(&window_info).map_err(|e| e.to_string()).unwrap();

            return Ok(json_string);
        }

        None => {
            return Err(String::from("Could not lookup"));
        }

    }    

}

#[tauri::command]
fn open_app(handle: tauri::AppHandle, state: tauri::State<State>) {

    let mut app_instances = state.app_instances.lock().unwrap();

    let mut window_uuid: String = "app-".into();
    window_uuid.push_str(&Uuid::new_v4().to_string());

    let window = tauri::WindowBuilder::new(
        &handle,
        window_uuid.clone(),
        tauri::WindowUrl::App("app.html".into())
    )
        .fullscreen(false)
        .resizable(true)
        .title("Lumibeat App")
        .inner_size(900.0, 700.0)
        .min_inner_size(900.0, 550.0)
        .initialization_script(&format!("window.localStorage.setItem('windowUUID', {});", window_uuid))
    .build()
    .expect("Error making app window");

    app_instances.insert(window_uuid, window);

}

fn main() {

    let state = State {

        app_instances: Mutex::new(HashMap::new())

    };

    let app = tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            open_app,
            get_app_window_info
        ])
        .build(tauri::generate_context!())
        .expect("Error creating app context");

    tauri::WindowBuilder::new(
        &app,
        "launcher",
        tauri::WindowUrl::App("index.html".into())
    )
        .title("Lumibeat Launcher")
        .inner_size(900.0, 700.0)
        .resizable(false)
        .fullscreen(false)
    .build()
    .expect("Failed to build launcher");

    app.run(|_, _| {});

}
