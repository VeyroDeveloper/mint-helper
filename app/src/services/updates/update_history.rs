//! Update history audit logging service
//! Stored locally at ~/.config/mint-helper/update_history.json

use crate::models::UpdateHistoryEntry;
use std::path::PathBuf;

pub struct UpdateHistoryService {
    history_file: PathBuf,
}

impl UpdateHistoryService {
    pub fn new() -> Self {
        let home = std::env::var("HOME").unwrap_or_else(|_| "/home/user".to_string());
        let history_file = PathBuf::from(home).join(".config/mint-helper/update_history.json");
        Self { history_file }
    }

    /// Loads update history records from JSON file
    pub fn load_history(&self) -> Vec<UpdateHistoryEntry> {
        if let Ok(content) = std::fs::read_to_string(&self.history_file) {
            if let Ok(entries) = serde_json::from_str(&content) {
                return entries;
            }
        }
        Vec::new()
    }

    /// Appends a new update entry to the persistent history file
    pub fn record_entry(&self, entry: UpdateHistoryEntry) -> Result<(), String> {
        let mut entries = self.load_history();
        entries.insert(0, entry);

        if let Some(parent) = self.history_file.parent() {
            std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }

        let json = serde_json::to_string_pretty(&entries).map_err(|e| e.to_string())?;
        std::fs::write(&self.history_file, json).map_err(|e| e.to_string())?;
        Ok(())
    }

    /// Formats history records as CSV for export
    pub fn export_csv(entries: &[UpdateHistoryEntry]) -> String {
        let mut out = String::from("ID,Timestamp,Manager,Package,OldVersion,NewVersion,Operation,Result,Details\n");
        for e in entries {
            out.push_str(&format!(
                "{},{},{},\"{}\",\"{}\",\"{}\",{:?},{:?},\"{}\"\n",
                e.id,
                e.timestamp,
                e.manager,
                e.package_name,
                e.old_version,
                e.new_version,
                e.operation_type,
                e.result,
                e.error_details.as_deref().unwrap_or("").replace('"', "\"\"")
            ));
        }
        out
    }
}
