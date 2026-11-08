//! Application configuration management

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum AppTheme {
    System,
    Light,
    Dark,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum Language {
    English,
    German,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum PackagePreference {
    FlatpakFirst,
    AptFirst,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub theme: AppTheme,
    pub language: Language,
    pub notifications_enabled: bool,
    pub refresh_interval_seconds: u64,
    pub package_preference: PackagePreference,
    pub log_diagnostics: bool,
    pub last_selected_page: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            theme: AppTheme::System,
            language: Language::English,
            notifications_enabled: true,
            refresh_interval_seconds: 5,
            package_preference: PackagePreference::FlatpakFirst,
            log_diagnostics: true,
            last_selected_page: "overview".to_string(),
        }
    }
}

impl AppConfig {
    pub fn config_path() -> PathBuf {
        let home = std::env::var("HOME").unwrap_or_else(|_| "/tmp".to_string());
        PathBuf::from(home).join(".config").join("mint-helper").join("config.json")
    }

    pub fn load() -> Self {
        let path = Self::config_path();
        if let Ok(contents) = fs::read_to_string(&path) {
            if let Ok(cfg) = serde_json::from_str::<Self>(&contents) {
                return cfg;
            }
        }
        Self::default()
    }

    pub fn save(&self) -> Result<(), std::io::Error> {
        let path = Self::config_path();
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent)?;
        }
        let serialized = serde_json::to_string_pretty(self)
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e))?;
        fs::write(path, serialized)
    }
}
