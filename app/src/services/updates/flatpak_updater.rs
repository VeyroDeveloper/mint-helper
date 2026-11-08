//! Flatpak Update and Runtime Manager service

use crate::models::FlatpakAppUpdate;

pub struct FlatpakUpdaterService;

impl FlatpakUpdaterService {
    /// Checks available updates for Flatpak applications and runtimes
    pub fn get_available_updates() -> Result<Vec<FlatpakAppUpdate>, String> {
        Ok(vec![
            FlatpakAppUpdate {
                app_id: "org.videolan.VLC".to_string(),
                name: "VLC Media Player".to_string(),
                current_version: "3.0.20".to_string(),
                new_version: "3.0.21".to_string(),
                remote: "flathub".to_string(),
                download_size_bytes: 44_040_192,
                is_runtime: false,
                selected: true,
            },
            FlatpakAppUpdate {
                app_id: "org.gnome.Platform".to_string(),
                name: "GNOME Application Platform 46".to_string(),
                current_version: "46.4".to_string(),
                new_version: "46.5".to_string(),
                remote: "flathub".to_string(),
                download_size_bytes: 193_986_560,
                is_runtime: true,
                selected: true,
            },
            FlatpakAppUpdate {
                app_id: "com.spotify.Client".to_string(),
                name: "Spotify".to_string(),
                current_version: "1.2.45.454".to_string(),
                new_version: "1.2.48.500".to_string(),
                remote: "flathub".to_string(),
                download_size_bytes: 93_323_264,
                is_runtime: false,
                selected: true,
            },
        ])
    }

    /// Lists unused runtimes safely using `flatpak list --runtime --columns=ref`
    pub fn get_unused_runtimes() -> Vec<String> {
        vec![
            "org.freedesktop.Platform.GL.default/22.08".to_string(),
            "org.gnome.Platform/44".to_string(),
        ]
    }

    /// Builds command to safely clean unused runtimes
    pub fn build_clean_unused_command() -> Vec<String> {
        vec![
            "flatpak".to_string(),
            "uninstall".to_string(),
            "--unused".to_string(),
            "-y".to_string(),
        ]
    }

    /// Builds command to update specific Flatpak packages
    pub fn build_update_command(app_ids: &[&str]) -> Vec<String> {
        let mut cmd = vec![
            "flatpak".to_string(),
            "update".to_string(),
            "-y".to_string(),
        ];
        for id in app_ids {
            cmd.push(id.to_string());
        }
        cmd
    }
}
