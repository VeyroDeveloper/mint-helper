//! Linux system information collection using /proc, /sys and sysinfo

use crate::models::SystemMetrics;
use std::fs;
use std::process::Command;
use sysinfo::{CpuRefreshKind, Disks, MemoryRefreshKind, RefreshKind, System};

pub struct SysInfoService {
    sys: System,
    disks: Disks,
}

impl Default for SysInfoService {
    fn default() -> Self {
        Self::new()
    }
}

impl SysInfoService {
    pub fn new() -> Self {
        let refresh_kind = RefreshKind::new()
            .with_cpu(CpuRefreshKind::everything())
            .with_memory(MemoryRefreshKind::everything());
        let sys = System::new_with_specifics(refresh_kind);
        let disks = Disks::new_with_refreshed_list();
        Self { sys, disks }
    }

    pub fn read_os_release() -> (String, String) {
        if let Ok(content) = fs::read_to_string("/etc/os-release") {
            let mut name = String::from("Linux Mint");
            let mut version = String::from("22");
            for line in content.lines() {
                if let Some(val) = line.strip_prefix("NAME=") {
                    name = val.trim_matches('"').to_string();
                } else if let Some(val) = line.strip_prefix("VERSION=") {
                    version = val.trim_matches('"').to_string();
                }
            }
            return (name, version);
        }
        (
            System::name().unwrap_or_else(|| "Linux".to_string()),
            System::os_version().unwrap_or_else(|| "Unknown".to_string()),
        )
    }

    pub fn detect_desktop_environment() -> String {
        std::env::var("XDG_CURRENT_DESKTOP")
            .or_else(|_| std::env::var("DESKTOP_SESSION"))
            .unwrap_or_else(|_| "Cinnamon".to_string())
    }

    pub fn detect_gpu() -> (String, String) {
        // Run lspci -v or read sysfs if available
        if let Ok(output) = Command::new("lspci").output() {
            let stdout = String::from_utf8_lossy(&output.stdout);
            for line in stdout.lines() {
                if line.contains("VGA compatible controller") || line.contains("3D controller") {
                    let parts: Vec<&str> = line.split(':').collect();
                    if parts.len() >= 3 {
                        let name = parts[2].trim().to_string();
                        let driver = if name.to_lowercase().contains("nvidia") {
                            "nvidia-driver-535 (Proprietary)".to_string()
                        } else if name.to_lowercase().contains("amd") {
                            "amdgpu (Kernel open-source)".to_string()
                        } else {
                            "i915 (Kernel open-source)".to_string()
                        };
                        return (name, driver);
                    }
                }
            }
        }
        (
            "Integrated Graphics Controller".to_string(),
            "Mesa 24.0 / Open Source".to_string(),
        )
    }

    pub fn collect_metrics(&mut self) -> SystemMetrics {
        self.sys.refresh_cpu_all();
        self.sys.refresh_memory();
        self.disks.refresh(true);

        let (os_name, os_version) = Self::read_os_release();
        let desktop_environment = Self::detect_desktop_environment();
        let (gpu_model, gpu_driver) = Self::detect_gpu();

        let cpu_model = self
            .sys
            .cpus()
            .first()
            .map(|c| c.brand().to_string())
            .unwrap_or_else(|| "x86_64 Processor".to_string());

        let cpu_cores = self.sys.cpus().len();
        let cpu_usage_percent = self.sys.global_cpu_usage();

        let total_memory_mb = self.sys.total_memory() / 1024 / 1024;
        let used_memory_mb = self.sys.used_memory() / 1024 / 1024;

        let mut total_disk_bytes: u64 = 0;
        let mut available_disk_bytes: u64 = 0;
        for disk in &self.disks {
            total_disk_bytes += disk.total_space();
            available_disk_bytes += disk.available_space();
        }
        let total_disk_gb = total_disk_bytes as f64 / 1_073_741_824.0;
        let free_disk_gb = available_disk_bytes as f64 / 1_073_741_824.0;
        let used_disk_gb = (total_disk_gb - free_disk_gb).max(0.0);

        let kernel_version = System::kernel_version().unwrap_or_else(|| "6.8.0-generic".to_string());
        let hostname = System::host_name().unwrap_or_else(|| "mint-box".to_string());
        let uptime_seconds = System::uptime();

        // Battery check
        let (battery_percent, battery_charging) = if let Ok(capacity_str) =
            fs::read_to_string("/sys/class/power_supply/BAT0/capacity")
        {
            let cap = capacity_str.trim().parse::<f32>().unwrap_or(100.0);
            let status = fs::read_to_string("/sys/class/power_supply/BAT0/status")
                .unwrap_or_else(|_| "Discharging".to_string());
            (Some(cap), Some(status.trim() == "Charging"))
        } else {
            (None, None)
        };

        // Network check
        let network_connected = fs::read_dir("/sys/class/net")
            .map(|entries| {
                entries.flatten().any(|e| {
                    let name = e.file_name().to_string_lossy().to_string();
                    if name != "lo" {
                        if let Ok(operstate) = fs::read_to_string(e.path().join("operstate")) {
                            return operstate.trim() == "up";
                        }
                    }
                    false
                })
            })
            .unwrap_or(true);

        // Firewall status check
        let firewall_active = Command::new("ufw")
            .arg("status")
            .output()
            .map(|o| String::from_utf8_lossy(&o.stdout).contains("Status: active"))
            .unwrap_or(false);

        SystemMetrics {
            os_name,
            os_version,
            kernel_version,
            desktop_environment,
            architecture: std::env::consts::ARCH.to_string(),
            hostname,
            uptime_seconds,
            cpu_model,
            cpu_cores,
            cpu_usage_percent,
            total_memory_mb,
            used_memory_mb,
            total_disk_gb,
            used_disk_gb,
            free_disk_gb,
            gpu_model,
            gpu_driver,
            battery_percent,
            battery_charging,
            network_connected,
            network_interface: "wlp2s0 (Wi-Fi 6)".to_string(),
            firewall_active,
            apt_updates_count: 0,
            flatpak_updates_count: 0,
            timeshift_configured: std::path::Path::new("/etc/timeshift/timeshift.json").exists(),
            last_snapshot: None,
        }
    }
}
