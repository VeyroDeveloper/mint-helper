//! Settings GTK4 View

use crate::config::AppConfig;
use gtk4::prelude::*;
use gtk4::{Box, Button, CheckButton, DropDown, Frame, Label, Orientation, ScrolledWindow, Stack, StringList};

pub fn build_settings_page(stack: &Stack, _config: &AppConfig) {
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
        .label("Preferences & Configuration")
        .css_classes(["title-1", "heading"])
        .xalign(0.0)
        .build();
    page_box.append(&title);

    // Appearance Frame
    let app_frame = Frame::builder().label("Appearance & Language").build();
    let app_box = Box::new(Orientation::Vertical, 12);
    app_box.set_margin_top(12);
    app_box.set_margin_bottom(12);
    app_box.set_margin_start(16);
    app_box.set_margin_end(16);

    let theme_row = Box::new(Orientation::Horizontal, 12);
    let theme_lbl = Label::builder().label("Theme").hexpand(true).xalign(0.0).build();
    let theme_list = StringList::new(&["Follow System", "Light", "Dark"]);
    let theme_dropdown = DropDown::builder().model(&theme_list).selected(0).build();
    theme_row.append(&theme_lbl);
    theme_row.append(&theme_dropdown);

    let lang_row = Box::new(Orientation::Horizontal, 12);
    let lang_lbl = Label::builder().label("Language").hexpand(true).xalign(0.0).build();
    let lang_list = StringList::new(&["English (US)", "Deutsch (German)"]);
    let lang_dropdown = DropDown::builder().model(&lang_list).selected(0).build();
    lang_row.append(&lang_lbl);
    lang_row.append(&lang_dropdown);

    app_box.append(&theme_row);
    app_box.append(&lang_row);
    app_frame.set_child(Some(&app_box));
    page_box.append(&app_frame);

    // Profile Export & Import
    let export_frame = Frame::builder().label("Configuration Profile Backup").build();
    let export_box = Box::new(Orientation::Horizontal, 12);
    export_box.set_margin_top(12);
    export_box.set_margin_bottom(12);
    export_box.set_margin_start(16);
    export_box.set_margin_end(16);

    let btn_export = Button::with_label("Export Profile JSON");
    let btn_import = Button::with_label("Import Profile JSON");

    export_box.append(&btn_export);
    export_box.append(&btn_import);
    export_frame.set_child(Some(&export_box));
    page_box.append(&export_frame);

    scrolled.set_child(Some(&page_box));
    stack.add_titled(&scrolled, Some("settings"), "Settings");
}
