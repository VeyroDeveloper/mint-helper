//! Domain data structures and types for mint-helper

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum OperationKind {
    Install,
    Remove,
    Configure,
    Keep,
    OptionalCleanup,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum PackageSource {
    Flatpak,
    Apt,
    AppImage,
    SystemSetting,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlanItem {
    pub id: String,
    pub title: String,
    pub kind: OperationKind,
    pub source: PackageSource,
    pub description: String,
    pub reason: String,
    pub permissions_required: String,
    pub reversible: bool,
    pub enabled: bool,
    pub command: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InstallationPlan {
    pub name: String,
    pub created_at: String,
    pub items: Vec<PlanItem>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemMetrics {
    pub os_name: String,
    pub os_version: String,
    pub kernel_version: String,
    pub desktop_environment: String,
    pub architecture: String,
    pub hostname: String,
    pub uptime_seconds: u64,
    pub cpu_model: String,
    pub cpu_cores: usize,
    pub cpu_usage_percent: f32,
    pub total_memory_mb: u64,
    pub used_memory_mb: u64,
    pub total_disk_gb: f64,
    pub used_disk_gb: f64,
    pub free_disk_gb: f64,
    pub gpu_model: String,
    pub gpu_driver: String,
    pub battery_percent: Option<f32>,
    pub battery_charging: Option<bool>,
    pub network_connected: bool,
    pub network_interface: String,
    pub firewall_active: bool,
    pub apt_updates_count: usize,
    pub flatpak_updates_count: usize,
    pub timeshift_configured: bool,
    pub last_snapshot: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppPackage {
    pub id: String,
    pub name: String,
    pub category: String,
    pub description: String,
    pub source: PackageSource,
    pub installed: bool,
    pub version: Option<String>,
    pub publisher: Option<String>,
    pub permissions: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SetupProfile {
    pub schema_version: String,
    pub app_id: String,
    pub name: String,
    pub description: String,
    pub selected_browser: String,
    pub install_codecs: bool,
    pub install_fonts: bool,
    pub enable_firewall: bool,
    pub auto_security_updates: bool,
    pub libreoffice_tabbed: bool,
    pub dev_tools: Vec<String>,
    pub recommended_apps: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditRecord {
    pub timestamp: String,
    pub action: String,
    pub category: String,
    pub status: String,
    pub details: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ReleaseChannel {
    Stable,
    Beta,
    Development,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum AptUpdateCategory {
    Security,
    Recommended,
    Optional,
    Kernel,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AptPackageUpdate {
    pub package_name: String,
    pub current_version: String,
    pub new_version: String,
    pub size_bytes: u64,
    pub category: AptUpdateCategory,
    pub is_security: bool,
    pub is_kernel: bool,
    pub requires_reboot: bool,
    pub will_remove: Vec<String>,
    pub new_dependencies: Vec<String>,
    pub selected: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FlatpakAppUpdate {
    pub app_id: String,
    pub name: String,
    pub current_version: String,
    pub new_version: String,
    pub remote: String,
    pub download_size_bytes: u64,
    pub is_runtime: bool,
    pub selected: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MintHelperRelease {
    pub version: String,
    pub channel: ReleaseChannel,
    pub release_date: String,
    pub changelog: Vec<String>,
    pub download_size_bytes: u64,
    pub sha256: String,
    pub signature_verified: bool,
    pub supported_arch: Vec<String>,
    pub appimage_filename: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum UpdateOperationType {
    Update,
    SecurityPatch,
    Rollback,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum UpdateResult {
    Success,
    Failed,
    RolledBack,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateHistoryEntry {
    pub id: String,
    pub timestamp: String,
    pub package_name: String,
    pub old_version: String,
    pub new_version: String,
    pub manager: String, // "mint-helper", "APT", "Flatpak"
    pub operation_type: UpdateOperationType,
    pub result: UpdateResult,
    pub error_details: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateSettings {
    pub auto_check_enabled: bool,
    pub frequency: String, // "startup", "daily", "weekly", "manual"
    pub channel: ReleaseChannel,
    pub notify_on_update: bool,
    pub only_notify_security: bool,
    pub auto_download_appimage: bool,
    pub retention_days: u32,
}

impl Default for UpdateSettings {
    fn default() -> Self {
        Self {
            auto_check_enabled: true,
            frequency: "daily".to_string(),
            channel: ReleaseChannel::Stable,
            notify_on_update: true,
            only_notify_security: false,
            auto_download_appimage: false,
            retention_days: 90,
        }
    }
}
