//! Safe storage analyzer, temporary file scanner, and duplicate finder

use sha2::{Digest, Sha256};
use std::collections::HashMap;
use std::fs::{self, File};
use std::io::{self, Read};
use std::path::{Path, PathBuf};

#[derive(Debug, Clone)]
pub struct CleanupTarget {
    pub category: String,
    pub path: PathBuf,
    pub size_bytes: u64,
    pub description: String,
    pub safe_to_delete: bool,
}

#[derive(Debug, Clone)]
pub struct DuplicateGroup {
    pub hash: String,
    pub file_size: u64,
    pub paths: Vec<PathBuf>,
}

pub struct CleanupService;

impl CleanupService {
    /// Protected paths that mint-helper will NEVER automatically delete
    pub fn is_protected_path(path: &Path) -> bool {
        let path_str = path.to_string_lossy();
        path_str.contains(".mozilla/firefox")
            || path_str.contains(".thunderbird")
            || path_str.contains(".ssh")
            || path_str.contains(".gnupg")
            || path_str.contains("Documents")
            || path_str.contains("Pictures")
    }

    /// Scan system and user caches safely
    pub fn scan_cleanable_caches() -> Vec<CleanupTarget> {
        let mut targets = Vec::new();
        let home = std::env::var("HOME").unwrap_or_else(|_| "/tmp".to_string());

        // 1. APT package archive cache
        let apt_cache = PathBuf::from("/var/cache/apt/archives");
        if apt_cache.exists() {
            let size = Self::calculate_dir_size(&apt_cache);
            targets.push(CleanupTarget {
                category: "Package Cache (APT)".to_string(),
                path: apt_cache,
                size_bytes: size,
                description: "Old downloaded .deb installer files in /var/cache/apt/archives".to_string(),
                safe_to_delete: true,
            });
        }

        // 2. User thumbnail cache
        let thumb_cache = PathBuf::from(&home).join(".cache").join("thumbnails");
        if thumb_cache.exists() {
            let size = Self::calculate_dir_size(&thumb_cache);
            targets.push(CleanupTarget {
                category: "Thumbnail Cache".to_string(),
                path: thumb_cache,
                size_bytes: size,
                description: "Generated image/video preview thumbnails that can be regenerated on demand".to_string(),
                safe_to_delete: true,
            });
        }

        // 3. User trash
        let trash_files = PathBuf::from(&home).join(".local/share/Trash/files");
        if trash_files.exists() {
            let size = Self::calculate_dir_size(&trash_files);
            targets.push(CleanupTarget {
                category: "Rubbish / Trash".to_string(),
                path: trash_files,
                size_bytes: size,
                description: "Files currently placed in the Linux Mint Trash can".to_string(),
                safe_to_delete: true,
            });
        }

        targets
    }

    /// Calculate total bytes in a directory non-recursively into symlinks
    pub fn calculate_dir_size(path: &Path) -> u64 {
        let mut total = 0;
        if let Ok(entries) = fs::read_dir(path) {
            for entry in entries.flatten() {
                if let Ok(meta) = entry.metadata() {
                    if meta.is_file() {
                        total += meta.len();
                    } else if meta.is_dir() && !meta.is_symlink() {
                        total += Self::calculate_dir_size(&entry.path());
                    }
                }
            }
        }
        total
    }

    /// Computes SHA-256 hash of a file for safe content matching
    pub fn hash_file(path: &Path) -> io::Result<String> {
        let mut file = File::open(path)?;
        let mut hasher = Sha256::new();
        let mut buffer = [0u8; 8192];
        loop {
            let count = file.read(&mut buffer)?;
            if count == 0 {
                break;
            }
            hasher.update(&buffer[..count]);
        }
        Ok(hex::encode(hasher.finalize()))
    }

    /// Find duplicate files in a folder based on exact SHA-256 contents
    pub fn find_duplicates(dir: &Path) -> Vec<DuplicateGroup> {
        let mut size_map: HashMap<u64, Vec<PathBuf>> = HashMap::new();

        // Pass 1: Group by file length
        if let Ok(entries) = fs::read_dir(dir) {
            for entry in entries.flatten() {
                if let Ok(meta) = entry.metadata() {
                    if meta.is_file() && meta.len() > 0 && !Self::is_protected_path(&entry.path()) {
                        size_map.entry(meta.len()).or_default().push(entry.path());
                    }
                }
            }
        }

        // Pass 2: For groups with >= 2 files of the same size, compare cryptographic hashes
        let mut duplicates: Vec<DuplicateGroup> = Vec::new();

        for (size, files) in size_map {
            if files.len() > 1 {
                let mut hash_map: HashMap<String, Vec<PathBuf>> = HashMap::new();
                for f in files {
                    if let Ok(h) = Self::hash_file(&f) {
                        hash_map.entry(h).or_default().push(f);
                    }
                }
                for (h, paths) in hash_map {
                    if paths.len() > 1 {
                        duplicates.push(DuplicateGroup {
                            hash: h,
                            file_size: size,
                            paths,
                        });
                    }
                }
            }
        }

        duplicates
    }
}
