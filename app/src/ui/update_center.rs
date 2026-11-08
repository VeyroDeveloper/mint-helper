//! GTK4 UI component for Update Center

use gtk4::prelude::*;
use gtk4::{Box, Button, Label, Orientation, ProgressBar, ScrolledWindow, Notebook};
use crate::models::{MintHelperRelease, ReleaseChannel};
use crate::services::updates::{AptUpdaterService, FlatpakUpdaterService, GitHubReleaseService};

pub struct UpdateCenterView {
    pub container: Box,
}

impl UpdateCenterView {
    pub fn new() -> Self {
        let container = Box::new(Orientation::Vertical, 16);
        container.set_margin_start(24);
        container.set_margin_end(24);
        container.set_margin_top(24);
        container.set_margin_bottom(24);

        // Header
        let header_box = Box::new(Orientation::Horizontal, 12);
        let title_label = Label::new(Some("Update Center"));
        title_label.add_css_class("title-1");

        let check_button = Button::with_label("Check for updates");
        check_button.add_css_class("suggested-action");

        header_box.append(&title_label);
        let spacer = Box::new(Orientation::Horizontal, 0);
        spacer.set_hexpand(true);
        header_box.append(&spacer);
        header_box.append(&check_button);

        container.append(&header_box);

        // Summary Bar Card
        let summary_card = Box::new(Orientation::Horizontal, 16);
        summary_card.add_css_class("card");

        let status_label = Label::new(Some("Status: 4 Updates Available (1 Security)"));
        summary_card.append(&status_label);
        container.append(&summary_card);

        // Notebook with 4 Tabs
        let notebook = Notebook::new();

        // Tab 1: mint-helper Updates
        let mint_box = Box::new(Orientation::Vertical, 12);
        let mint_lbl = Label::new(Some("mint-helper v1.0.0 installed. Latest v1.1.0 available on GitHub."));
        let update_appimage_btn = Button::with_label("Download and Install AppImage Update");
        mint_box.append(&mint_lbl);
        mint_box.append(&update_appimage_btn);
        notebook.append_page(&mint_box, Some(&Label::new(Some("mint-helper Updates"))));

        // Tab 2: Linux System Updates (APT)
        let apt_box = Box::new(Orientation::Vertical, 12);
        let apt_lbl = Label::new(Some("APT Updates: linux-image-6.8.0-50-generic, openssl, curl, mesa-va-drivers"));
        let apt_install_btn = Button::with_label("Install Selected Updates (PolicyKit)");
        apt_box.append(&apt_lbl);
        apt_box.append(&apt_install_btn);
        notebook.append_page(&apt_box, Some(&Label::new(Some("Linux System Updates (APT)"))));

        // Tab 3: Flatpak Updates
        let flatpak_box = Box::new(Orientation::Vertical, 12);
        let flatpak_lbl = Label::new(Some("Flatpak Updates: VLC Media Player, GNOME Platform 46, Spotify"));
        let flatpak_clean_btn = Button::with_label("Clean Unused Runtimes");
        flatpak_box.append(&flatpak_lbl);
        flatpak_box.append(&flatpak_clean_btn);
        notebook.append_page(&flatpak_box, Some(&Label::new(Some("Flatpak Updates"))));

        // Tab 4: Update History
        let hist_box = Box::new(Orientation::Vertical, 12);
        let hist_lbl = Label::new(Some("Local Audit Log: 4 transactions recorded in ~/.config/mint-helper/update_history.json"));
        let export_csv_btn = Button::with_label("Export History (CSV)");
        hist_box.append(&hist_lbl);
        hist_box.append(&export_csv_btn);
        notebook.append_page(&hist_box, Some(&Label::new(Some("Update History"))));

        container.append(&notebook);

        Self { container }
    }
}
