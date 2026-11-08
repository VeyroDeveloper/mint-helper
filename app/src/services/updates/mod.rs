pub mod github_releases;
pub mod apt_updater;
pub mod flatpak_updater;
pub mod appimage_updater;
pub mod update_history;

pub use github_releases::GitHubReleaseService;
pub use apt_updater::AptUpdaterService;
pub use flatpak_updater::FlatpakUpdaterService;
pub use appimage_updater::AppImageUpdaterService;
pub use update_history::UpdateHistoryService;
