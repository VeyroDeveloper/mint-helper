//! Application Manager GTK4 View

use crate::models::PackageSource;
use crate::services::package_manager::PackageManagerService;
use gtk4::prelude::*;
use gtk4::{Box, Button, Frame, Label, ListBox, Orientation, ScrolledWindow, SearchEntry, Stack};

pub fn build_apps_page(stack: &Stack) {
    let scrolled = ScrolledWindow::builder()
        .hscrollbar_policy(gtk4::PolicyType::Never)
        .vscrollbar_policy(gtk4::PolicyType::Automatic)
        .build();

    let page_box = Box::builder()
        .orientation(Orientation::Vertical)
        .spacing(16)
        .margin_top(24)
        .margin_bottom(24)
        .margin_start(28)
        .margin_end(28)
        .build();

    let header_row = Box::new(Orientation::Horizontal, 12);
    let title = Label::builder()
        .label("Application & Flatpak Manager")
        .css_classes(["title-1", "heading"])
        .hexpand(true)
        .xalign(0.0)
        .build();
    let search = SearchEntry::builder().placeholder_text("Search packages...").build();

    header_row.append(&title);
    header_row.append(&search);
    page_box.append(&header_row);

    let list_box = ListBox::builder().css_classes(["boxed-list"]).build();

    let catalog = PackageManagerService::get_curated_catalog();
    for app in catalog {
        let row_box = Box::new(Orientation::Horizontal, 16);
        row_box.set_margin_top(10);
        row_box.set_margin_bottom(10);
        row_box.set_margin_start(12);
        row_box.set_margin_end(12);

        let info_box = Box::new(Orientation::Vertical, 4);
        info_box.set_hexpand(true);

        let name_row = Box::new(Orientation::Horizontal, 8);
        let name_lbl = Label::builder()
            .label(&app.name)
            .css_classes(["heading"])
            .xalign(0.0)
            .build();

        let source_badge = Label::builder()
            .label(match app.source {
                PackageSource::Flatpak => "Flatpak",
                PackageSource::Apt => "APT",
                PackageSource::AppImage => "AppImage",
                PackageSource::SystemSetting => "Setting",
            })
            .css_classes(["tag", "dim-label"])
            .build();

        name_row.append(&name_lbl);
        name_row.append(&source_badge);

        let desc_lbl = Label::builder()
            .label(&app.description)
            .css_classes(["dim-label"])
            .wrap(true)
            .xalign(0.0)
            .build();

        info_box.append(&name_row);
        info_box.append(&desc_lbl);

        let action_btn = if app.installed {
            Button::builder().label("Installed").css_classes(["flat"]).sensitive(false).build()
        } else {
            Button::builder().label("Install").css_classes(["suggested-action"]).build()
        };

        row_box.append(&info_box);
        row_box.append(&action_btn);
        list_box.append(&row_box);
    }

    page_box.append(&list_box);
    scrolled.set_child(Some(&page_box));
    stack.add_titled(&scrolled, Some("applications"), "Applications");
}
