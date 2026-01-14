import os
import re
import json
from pathlib import Path

# Extensions à analyser
EXTENSIONS = {'.js', '.jsx'}

IMPORT_REGEX = re.compile(
    r"""
    import\s+
    (?:
        (?P<what>[\w*\s{},]+)\s+from\s+['"](?P<from>[^'"]+)['"]
        |
        ['"](?P<side_effect>[^'"]+)['"]
    )
    """,
    re.VERBOSE,
)

EXPORT_NAMED_REGEX = re.compile(
    r"export\s+(?:const|let|var|function|class)\s+(?P<name>\w+)"
)

EXPORT_DEFAULT_REGEX = re.compile(
    r"export\s+default\s+(?P<name>\w+)?"
)

EXPORT_LIST_REGEX = re.compile(
    r"export\s*{\s*(?P<names>[^}]+)\s*}(?:\s+from\s+['\"](?P<from>[^'\"]+)['\"])?"
)


def scan_file(path):
    imports = []
    exports = []

    try:
        content = path.read_text(encoding="utf-8")
    except Exception:
        return imports, exports

    # Imports
    for match in IMPORT_REGEX.finditer(content):
        if match.group("from"):
            imports.append({
                "file": str(path),
                "source": match.group("from"),
                "what": match.group("what").strip(),
            })
        else:
            imports.append({
                "file": str(path),
                "source": match.group("side_effect"),
                "what": None,
            })

    # Exports nommés
    for match in EXPORT_NAMED_REGEX.finditer(content):
        exports.append({
            "file": str(path),
            "type": "named",
            "name": match.group("name"),
        })

    # Export default
    for match in EXPORT_DEFAULT_REGEX.finditer(content):
        exports.append({
            "file": str(path),
            "type": "default",
            "name": match.group("name"),
        })

    # export { a, b as c }
    for match in EXPORT_LIST_REGEX.finditer(content):
        names = [n.strip() for n in match.group("names").split(",")]
        exports.append({
            "file": str(path),
            "type": "list",
            "names": names,
            "from": match.group("from"),
        })

    return imports, exports


def scan_project(root):
    all_imports = []
    all_exports = []

    for path in Path(root).rglob("*"):
        if path.suffix in EXTENSIONS:
            imports, exports = scan_file(path)
            all_imports.extend(imports)
            all_exports.extend(exports)

    return all_imports, all_exports


if __name__ == "__main__":
    PROJECT_ROOT = "."  # ou chemin absolu
    imports, exports = scan_project(PROJECT_ROOT)

    # Sauvegarde dans 2 fichiers JSON
    with open("imports.json", "w", encoding="utf-8") as f:
        json.dump(imports, f, indent=2, ensure_ascii=False)

    with open("exports.json", "w", encoding="utf-8") as f:
        json.dump(exports, f, indent=2, ensure_ascii=False)

    print(f"Found {len(imports)} imports and {len(exports)} exports.")
    print("Saved to imports.json and exports.json")
