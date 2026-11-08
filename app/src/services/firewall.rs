//! Linux UFW Firewall control and rule inspection

use std::process::Command;

pub struct FirewallService;

impl FirewallService {
    pub fn is_ufw_installed() -> bool {
        Command::new("which")
            .arg("ufw")
            .output()
            .map(|o| o.status.success())
            .unwrap_or(false)
    }

    pub fn get_status() -> Result<bool, String> {
        let output = Command::new("ufw")
            .arg("status")
            .output()
            .map_err(|e| format!("Failed to execute ufw: {}", e))?;

        let stdout = String::from_utf8_lossy(&output.stdout);
        Ok(stdout.contains("Status: active"))
    }

    pub fn get_rules() -> Vec<String> {
        if let Ok(output) = Command::new("ufw").args(["status", "numbered"]).output() {
            let stdout = String::from_utf8_lossy(&output.stdout);
            return stdout
                .lines()
                .filter(|line| line.starts_with('[') && line.contains(']'))
                .map(|line| line.trim().to_string())
                .collect();
        }
        vec![]
    }

    pub fn generate_enable_command() -> String {
        "pkexec ufw default deny incoming && pkexec ufw default allow outgoing && pkexec ufw enable".to_string()
    }

    pub fn generate_disable_command() -> String {
        "pkexec ufw disable".to_string()
    }
}
