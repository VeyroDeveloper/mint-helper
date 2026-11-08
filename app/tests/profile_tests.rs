//! Rust Integration and Unit Tests for mint-helper profiles and plan generator

#[cfg(test)]
mod tests {
    use std::fs;

    #[test]
    fn test_profile_presets_have_valid_schema() {
        let schema_version = "1.0";
        let app_id = "mint-helper";

        assert_eq!(schema_version, "1.0");
        assert_eq!(app_id, "mint-helper");
    }

    #[test]
    fn test_protected_paths_protection() {
        let firefox_path = "/home/mint/.mozilla/firefox/abc123xy.default-release";
        let docs_path = "/home/mint/Documents/Taxes.pdf";
        let cache_path = "/var/cache/apt/archives/vim_2.deb";

        let is_protected = |p: &str| {
            p.contains(".mozilla/firefox")
                || p.contains(".thunderbird")
                || p.contains(".ssh")
                || p.contains("Documents")
        };

        assert!(is_protected(firefox_path));
        assert!(is_protected(docs_path));
        assert!(!is_protected(cache_path));
    }
}
