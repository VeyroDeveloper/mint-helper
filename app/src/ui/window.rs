//! GTK4 Main Window and Stack Navigation

use crate::config::AppConfig;
use gtk4::prelude::*;
use gtk4::{Application, ApplicationWindow, Box, HeaderBar, Label, Orientation, Paned, Stack, StackSidebar};

pub fn create_main_window(app: &Application, config: &AppConfig) -> ApplicationWindow {
    let window = ApplicationWindow::builder()
        .application(app)
        .title("mint-helper")
        .default_width(1080)
        .default_height(720)
        .build();

    let header_bar = HeaderBar::new();
    let title_label = Label::builder()
        .label("mint-helper")
        .css_classes(["title", "heading"])
        .build();
    header_bar.set_title_widget(Some(&title_label));
    window.set_titlebar(Some(&header_bar));

    let main_box = Box::new(Orientation::Horizontal, 0);
    let paned = Paned::new(Orientation::Horizontal);
    paned.set_position(240);

    let stack = Stack::builder()
        .transition_type(gtk4::StackTransitionType::Crossfade)
        .transition_duration(200)
        .build();

    // Populate the stack pages
    super::overview::build_overview_page(&stack);
    super::wizard::build_wizard_page(&stack);
    super::apps::build_apps_page(&stack);
    super::health::build_health_page(&stack);
    super::maintenance::build_maintenance_page(&stack);
    super::storage::build_storage_page(&stack);
    super::settings::build_settings_page(&stack, config);

    let sidebar = StackSidebar::new();
    sidebar.set_stack(&stack);
    sidebar.set_width_request(240);

    paned.set_start_child(Some(&sidebar));
    paned.set_end_child(Some(&stack));

    main_box.append(&paned);
    window.set_child(Some(&main_box));
    window.present();

    window
}
