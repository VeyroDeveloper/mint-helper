//! Storage & Cleanup GTK4 View

use gtk4::prelude::*;
use gtk4::{Box, Button, Frame, Label, ListBox, Orientation, ScrolledWindow, Stack};

pub fn build_storage_page(stack: &Stack) {
    let scrolled = ScrolledWindow::builder()
        .hscrollbar_policy(gtk4::PolicyType::Never)
        .vscrollbar_policy(gtk4::PolicyType::Automatic)
        .build();

    let page_box = Box::builder()
        .orientation(Orientation::Vertical)
        .spacing(18)
        .margin_top(24)
        .margin_bottom(24)
        .margin_start(28)
        .margin_end(28)
        .build();

    let title = Label::builder()
        .label("Storage & Cleanup Station")
        .css_classes(["title-1", "heading"])
        .xalign(0.0)
        .build();
    let subtitle = Label::builder()
        .label("Analyze disk usage, purge harmless temporary files, and find duplicate files safely without touching user profiles.")
        .css_classes(["dim-label"])
        .xalign(0.0)
        .build();

    page_box.append(&title);
    page_box.append(&subtitle);

    let clean_list = ListBox::builder().css_classes(["boxed-list"]).build();

    let targets = vec![
        ("APT Download Archive (/var/cache/apt/archives)", "240 MB", "Downloaded package deb files no longer needed after install"),
        ("Thumbnail Previews (~/.cache/thumbnails)", "85 MB", "Cached image and video thumbnails that regenerate automatically"),
        ("Desktop Rubbish / Trash (~/.local/share/Trash)", "512 MB", "Deleted files currently stored in user trash"),
    ];

    for (name, size, desc) in targets {
        let row = Box::new(Orientation::Horizontal, 16);
        row.set_margin_top(12);
        row.set_margin_bottom(12);
        row.set_margin_start(16);
        row.set_margin_end(16);

        let info = Box::new(Orientation::Vertical, 4);
        info.set_hexpand(true);

        let name_lbl = Label::builder().label(name).css_classes(["heading"]).xalign(0.0).build();
        let desc_lbl = Label::builder().label(desc).css_classes(["dim-label"]).xalign(0.0).build();
        info.append(&name_lbl);
        info.append(&desc_lbl);

        let size_badge = Label::builder().label(size).css_classes(["tag"]).build();
        let purge_btn = Button::with_label("Clean");

        row.append(&info);
        row.append(&size_badge);
        row.append(&purge_btn);
        clean_list.append(&row);
    }

    page_box.append(&clean_list);
    scrolled.set_child(Some(&page_box));
    stack.add_titled(&scrolled, Some("storage"), "Storage & Cleanup");
}
