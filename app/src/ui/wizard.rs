//! Post-Installation Wizard GTK4 View

use crate::services::profile::ProfileService;
use gtk4::prelude::*;
use gtk4::{Box, Button, CheckButton, Frame, Label, Orientation, ScrolledWindow, Stack};

pub fn build_wizard_page(stack: &Stack) {
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
        .label("Post-Installation Setup Wizard")
        .css_classes(["title-1", "heading"])
        .xalign(0.0)
        .build();
    let subtitle = Label::builder()
        .label("Configure your fresh Linux Mint system in minutes with automated best-practices or custom control.")
        .css_classes(["dim-label"])
        .xalign(0.0)
        .build();

    page_box.append(&title);
    page_box.append(&subtitle);

    // Profile selector bar
    let profile_frame = Frame::builder().label("1. Select Setup Profile").build();
    let profile_box = Box::new(Orientation::Horizontal, 12);
    profile_box.set_margin_top(12);
    profile_box.set_margin_bottom(12);
    profile_box.set_margin_start(16);
    profile_box.set_margin_end(16);

    let btn_everyday = Button::with_label("Everyday User");
    btn_everyday.set_css_classes(&["suggested-action"]);
    let btn_dev = Button::with_label("Developer");
    let btn_gaming = Button::with_label("Gaming");
    let btn_creative = Button::with_label("Creative");

    profile_box.append(&btn_everyday);
    profile_box.append(&btn_dev);
    profile_box.append(&btn_gaming);
    profile_box.append(&btn_creative);
    profile_frame.set_child(Some(&profile_box));
    page_box.append(&profile_frame);

    // Options Checklist Frame
    let options_frame = Frame::builder().label("2. Review Post-Install Components").build();
    let options_box = Box::new(Orientation::Vertical, 10);
    options_box.set_margin_top(12);
    options_box.set_margin_bottom(12);
    options_box.set_margin_start(16);
    options_box.set_margin_end(16);

    let chk_codecs = CheckButton::with_label("Install Multimedia Codecs (mint-meta-codecs)");
    chk_codecs.set_active(true);
    let chk_fonts = CheckButton::with_label("Install Microsoft-Compatible Fonts (Arial, Times New Roman)");
    chk_fonts.set_active(true);
    let chk_firewall = CheckButton::with_label("Enable UFW Firewall with Safe Defaults");
    chk_firewall.set_active(true);
    let chk_libreoffice = CheckButton::with_label("Configure LibreOffice Tabbed Ribbon-style Layout");
    chk_libreoffice.set_active(true);
    let chk_updates = CheckButton::with_label("Configure Automatic Daily Security Updates");
    chk_updates.set_active(true);

    options_box.append(&chk_codecs);
    options_box.append(&chk_fonts);
    options_box.append(&chk_firewall);
    options_box.append(&chk_libreoffice);
    options_box.append(&chk_updates);
    options_frame.set_child(Some(&options_box));
    page_box.append(&options_frame);

    // Plan Generation and Execution Button
    let plan_row = Box::new(Orientation::Horizontal, 12);
    let btn_generate_plan = Button::builder()
        .label("Generate Reviewable Installation Plan")
        .css_classes(["suggested-action"])
        .build();

    let plan_status_lbl = Label::builder()
        .label("No plan generated yet. Select a profile or customize checkboxes above.")
        .css_classes(["dim-label"])
        .build();

    plan_row.append(&btn_generate_plan);
    plan_row.append(&plan_status_lbl);
    page_box.append(&plan_row);

    scrolled.set_child(Some(&page_box));
    stack.add_titled(&scrolled, Some("wizard"), "Post Installation");
}
