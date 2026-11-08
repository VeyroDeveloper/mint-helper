//! Maintenance Center GTK4 View

use gtk4::prelude::*;
use gtk4::{Box, Button, Frame, Label, Orientation, ScrolledWindow, Stack};

pub fn build_maintenance_page(stack: &Stack) {
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
        .label("Maintenance Center")
        .css_classes(["title-1", "heading"])
        .xalign(0.0)
        .build();
    let subtitle = Label::builder()
        .label("Routine maintenance tasks: package cleanup, repository refresh, and orphaned dependency removal.")
        .css_classes(["dim-label"])
        .xalign(0.0)
        .build();

    page_box.append(&title);
    page_box.append(&subtitle);

    // Section 1: System & Flatpak Updates
    let updates_frame = Frame::builder().label("Software Updates").build();
    let updates_box = Box::new(Orientation::Vertical, 10);
    updates_box.set_margin_top(12);
    updates_box.set_margin_bottom(12);
    updates_box.set_margin_start(16);
    updates_box.set_margin_end(16);

    let row1 = Box::new(Orientation::Horizontal, 12);
    let lbl1 = Label::builder()
        .label("Check and install official APT distribution updates")
        .hexpand(true)
        .xalign(0.0)
        .build();
    let btn1 = Button::with_label("Check APT Updates");
    row1.append(&lbl1);
    row1.append(&btn1);

    let row2 = Box::new(Orientation::Horizontal, 12);
    let lbl2 = Label::builder()
        .label("Refresh Flatpak appstream metadata and update Flatpaks")
        .hexpand(true)
        .xalign(0.0)
        .build();
    let btn2 = Button::with_label("Update Flatpaks");
    row2.append(&lbl2);
    row2.append(&btn2);

    updates_box.append(&row1);
    updates_box.append(&row2);
    updates_frame.set_child(Some(&updates_box));
    page_box.append(&updates_frame);

    // Section 2: Safe Package Cleanup
    let clean_frame = Frame::builder().label("Package & Dependency Cleanup").build();
    let clean_box = Box::new(Orientation::Vertical, 10);
    clean_box.set_margin_top(12);
    clean_box.set_margin_bottom(12);
    clean_box.set_margin_start(16);
    clean_box.set_margin_end(16);

    let row3 = Box::new(Orientation::Horizontal, 12);
    let lbl3 = Label::builder()
        .label("Remove obsolete deb packages and unused dependencies (apt autoremove)")
        .hexpand(true)
        .xalign(0.0)
        .build();
    let btn3 = Button::with_label("Clean APT Cache");
    row3.append(&lbl3);
    row3.append(&btn3);

    clean_box.append(&row3);
    clean_frame.set_child(Some(&clean_box));
    page_box.append(&clean_frame);

    scrolled.set_child(Some(&page_box));
    stack.add_titled(&scrolled, Some("maintenance"), "Maintenance");
}
