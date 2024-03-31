use tauri::{CustomMenuItem, Menu, Submenu};

pub fn generate_menu_bar() -> Menu {

    let app_submenu = Menu::new()
        .add_item(CustomMenuItem::new("quit", "Quit Lumibeat").accelerator("CommandOrControl+Q"));

    let menu = Menu::new()
        .add_submenu(Submenu::new("Lumibeat", app_submenu));

    return menu;

}