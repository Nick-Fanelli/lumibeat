// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;
use std::sync::Mutex;

use uuid::Uuid;

struct State {

    app_instances: Mutex<HashMap<String, tauri::Window>>,
    app_data: Mutex<HashMap<String, AppData>>

}

struct AppData {

    show_file_path: String

}

#[derive(Debug, serde::Serialize)]
struct WindowInfo {

    window_uuid: String,
    show_file_path: String

}

#[tauri::command]
fn get_app_window_info(window: tauri::Window, state: tauri::State<State>) -> Result<String, String> {

    let app_instances = state.app_instances.lock().unwrap();
    let app_data = state.app_data.lock().unwrap();

    let uuid_instance = String::from(window.label());

    let lookup_window = app_instances.get(&uuid_instance);
    let lookup_app_data = app_data.get(&uuid_instance).unwrap();

    match lookup_window {

        Some(value) => {
            let window_info = WindowInfo {
                window_uuid: value.label().to_owned(),
                show_file_path: lookup_app_data.show_file_path.clone()
            };

            let json_string = serde_json::to_string(&window_info).map_err(|e| e.to_string()).unwrap();

            Ok(json_string)
        }

        None => {
            Err(String::from("Could not lookup"))
        }

    }    

}

#[tauri::command]
async fn open_app(handle: tauri::AppHandle, state: tauri::State<'_, State>, filepath: String) -> Result<(), ()> {

    let mut app_instances = state.app_instances.lock().unwrap();
    let mut app_data = state.app_data.lock().unwrap();

    // Generate UUID
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

    let local_app_data = AppData {

        show_file_path: filepath
        
    };

    app_instances.insert(window_uuid.clone(), window);
    app_data.insert(window_uuid.clone(), local_app_data);

    Ok(())

}

fn main() {

    let state = State {

        app_instances: Mutex::new(HashMap::new()),
        app_data: Mutex::new(HashMap::new())

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
