"""
GeoWatershed AI - Teammate Package Builder
Creates a clean, ready-to-distribute ZIP archive for team members,
excluding node_modules, .venv, git histories, and caches.
"""

import os
import zipfile
from pathlib import Path

def create_team_zip():
    root_dir = Path(__file__).resolve().parent
    output_zip_path = root_dir / "GeoWatershed_AI_Team_Package.zip"

    # Folders to exclude
    EXCLUDE_DIRS = {
        "node_modules", ".venv", "__pycache__", ".pytest_cache",
        ".git", "dist", ".vite", ".idea", ".vscode"
    }

    # Files to exclude
    EXCLUDE_FILES = {
        "geowatershed.db", "geowatershed.db-journal",
        "GeoWatershed_AI_Team_Package.zip"
    }

    # File extensions to exclude
    EXCLUDE_EXTS = {".pyc", ".pyo", ".pyd"}

    print("==================================================================")
    print("  Creating Clean Zip Archive for Teammates...")
    print("==================================================================")
    print(f"Target Archive: {output_zip_path.name}")

    total_files = 0
    with zipfile.ZipFile(output_zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for foldername, subfolders, filenames in os.walk(root_dir):
            # Prune excluded directories in-place
            subfolders[:] = [d for d in subfolders if d not in EXCLUDE_DIRS and not d.startswith(".")]

            current_path = Path(foldername)
            for filename in filenames:
                file_path = current_path / filename

                if filename in EXCLUDE_FILES or file_path.suffix in EXCLUDE_EXTS:
                    continue
                if any(ex in file_path.parts for ex in EXCLUDE_DIRS):
                    continue

                rel_path = file_path.relative_to(root_dir)
                zipf.write(file_path, arcname=str(rel_path))
                total_files += 1

    size_mb = output_zip_path.stat().st_size / (1024 * 1024)
    print(f"[+] Successfully packaged {total_files} files into {output_zip_path.name}")
    print(f"[+] Archive Size: {size_mb:.2f} MB")
    print(f"[+] Location: {output_zip_path}")
    print("==================================================================")

if __name__ == "__main__":
    create_team_zip()
