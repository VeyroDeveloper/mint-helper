pub mod apps;
pub mod health;
pub mod maintenance;
pub mod overview;
pub mod settings;
pub mod sidebar;
pub mod storage;
pub mod update_center;
pub mod window;
pub mod wizard;

use crate::config::AppConfig;
use gtk4::Application;

pub fn build_ui(app: &Application, config: &AppConfig) {
    window::create_main_window(app, config);
}
