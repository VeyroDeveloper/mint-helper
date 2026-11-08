//! mint-helper - The Linux Mint Desktop Companion and System Manager
//! Licensed under GPL-3.0-or-later

mod config;
mod models;
mod services;
mod ui;

use config::AppConfig;
use gtk4::prelude::*;
use gtk4::Application;
use log::info;

const APP_ID: &str = "com.linuxmint.mint_helper";

fn main() {
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();

    let args: Vec<String> = std::env::args().collect();
    if args.contains(&"--version".to_string()) || args.contains(&"-v".to_string()) {
        println!("mint-helper version 1.0.0 (Linux Mint Companion)");
        return;
    }

    if args.contains(&"--help".to_string()) || args.contains(&"-h".to_string()) {
        println!("mint-helper - The Linux Mint Desktop Companion\n");
        println!("Usage: mint-helper [OPTIONS]");
        println!("Options:");
        println!("  -h, --help       Show this help message");
        println!("  -v, --version    Show version information");
        println!("  --debug          Enable verbose diagnostic logging\n");
        println!("Visit https://github.com/linuxmint-community/mint-helper for documentation.");
        return;
    }

    info!("Starting mint-helper desktop application...");
    let app_config = AppConfig::load();
    info!("Loaded configuration with theme: {:?}", app_config.theme);

    let app = Application::builder()
        .application_id(APP_ID)
        .build();

    app.connect_activate(move |app| {
        ui::build_ui(app, &app_config);
    });

    app.run();
}
