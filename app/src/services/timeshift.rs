//! Timeshift system snapshot detection and backup verification

use std::fs;
use std::path::Path;
use std::process::Command;

#[derive(Debug, Clone)]
pub struct SnapshotInfo {
    pub tag: String,
    pub date: String,
    pub snapshot_type: String, // RSYNC or BTRFS
}

pub struct TimeshiftService;

impl TimeshiftService {
    pub fn is_timeshift_installed() -> bool {
        Command::new("which")
            .arg("timeshift")
            .output()
            .map(|o| o.status.success())
            .unwrap_or(false)
    }

    pub fn is_configured() -> bool {
        Path::new("/etc/timeshift/timeshift.json").exists()
    }

    pub fn list_snapshots() -> Vec<SnapshotInfo> {
        if let Ok(output) = Command::new("timeshift").arg("--list").output() {
            let stdout = String::from_utf8_lossy(&output.stdout);
            let mut list = Vec::new();
            for line in stdout.lines() {
                if line.contains(">") && (line.contains("ondemand") || line.contains("boot") || line.contains("daily")) {
                    let parts: Vec<&str> = line.split_whitespace().collect();
                    if parts.len() >= 3 {
                        list.push(SnapshotInfo {
                            tag: parts[1].to_string(),
                            date: parts[2].to_string(),
                            snapshot_type: "RSYNC".to_string(),
                        });
                    }
                }
            }
            return list;
        }
        vec![]
    }

    pub fn generate_create_snapshot_command(comment: &str) -> String {
        format!("pkexec timeshift --create --comments \"{}\"", comment)
    }

    pub fn open_gui_command() -> String {
        "timeshift-gtk".to_string()
    }
}
