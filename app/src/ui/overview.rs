//! Overview Dashboard GTK4 View

use crate::services::sysinfo::SysInfoService;
use gtk4::prelude::*;
use gtk4::{Box, Button, Frame, Label, Orientation, ProgressBar, ScrolledWindow, Stack};

pub fn build_overview_page(stack: &Stack) {
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

    // Header Title and Refresh Button
    let header_row = Box::new(Orientation::Horizontal, 12);
    let title = Label::builder()
        .label("System Overview")
        .css_classes(["title-1", "heading"])
        .hexpand(true)
        .xalign(0.0)
        .build();

    let refresh_btn = Button::builder()
        .label("Refresh Metrics")
        .css_classes(["suggested-action"])
        .build();

    header_row.append(&title);
    header_row.append(&refresh_btn);
    page_box.append(&header_row);

    // Initial metrics
    let mut sys_service = SysInfoService::new();
    let metrics = sys_service.collect_metrics();

    // Operating System Card
    let os_frame = Frame::builder().label("Operating System & Kernel").build();
    let os_box = Box::new(Orientation::Vertical, 8);
    os_box.set_margin_top(12);
    os_box.set_margin_bottom(12);
    os_box.set_margin_start(16);
    os_box.set_margin_end(16);

    let os_lbl = Label::builder()
        .label(format!("Distribution: {} {}", metrics.os_name, metrics.os_version))
        .xalign(0.0)
        .build();
    let kernel_lbl = Label::builder()
        .label(format!("Kernel: {}", metrics.kernel_version))
        .xalign(0.0)
        .build();
    let de_lbl = Label::builder()
        .label(format!("Desktop Environment: {}", metrics.desktop_environment))
        .xalign(0.0)
        .build();

    os_box.append(&os_lbl);
    os_box.append(&kernel_lbl);
    os_box.append(&de_lbl);
    os_frame.set_child(Some(&os_box));
    page_box.append(&os_frame);

    // Hardware & Resources Card
    let hw_frame = Frame::builder().label("Hardware & Resource Utilization").build();
    let hw_box = Box::new(Orientation::Vertical, 12);
    hw_box.set_margin_top(12);
    hw_box.set_margin_bottom(12);
    hw_box.set_margin_start(16);
    hw_box.set_margin_end(16);

    let cpu_lbl = Label::builder()
        .label(format!("CPU: {} ({} Cores)", metrics.cpu_model, metrics.cpu_cores))
        .xalign(0.0)
        .build();

    let cpu_bar = ProgressBar::builder()
        .fraction((metrics.cpu_usage_percent / 100.0) as f64)
        .show_text(true)
        .text(format!("{:.1}% CPU", metrics.cpu_usage_percent))
        .build();

    let mem_lbl = Label::builder()
        .label(format!("RAM: {} MB / {} MB used", metrics.used_memory_mb, metrics.total_memory_mb))
        .xalign(0.0)
        .build();

    let mem_fraction = if metrics.total_memory_mb > 0 {
        metrics.used_memory_mb as f64 / metrics.total_memory_mb as f64
    } else {
        0.0
    };

    let mem_bar = ProgressBar::builder()
        .fraction(mem_fraction)
        .show_text(true)
        .text(format!("{:.1}% RAM", mem_fraction * 100.0))
        .build();

    hw_box.append(&cpu_lbl);
    hw_box.append(&cpu_bar);
    hw_box.append(&mem_lbl);
    hw_box.append(&mem_bar);
    hw_frame.set_child(Some(&hw_box));
    page_box.append(&hw_frame);

    scrolled.set_child(Some(&page_box));
    stack.add_titled(&scrolled, Some("overview"), "Overview");
}
