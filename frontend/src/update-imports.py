import os
import re
import sys
from pathlib import Path

EXTENSIONS = [".js", ".jsx"]
RESOLVE_EXTENSIONS = ["", ".js", ".jsx", "/index.js", "/index.jsx"]

IMPORT_RE = re.compile(
    r"""import\s+
        (?:
            (?P<default>[a-zA-Z0-9_$]+)
            (?:\s*,\s*)?
        )?
        (?:
            \{\s*(?P<named>[a-zA-Z0-9_$,\s]+)\s*\} |
            \*\s+as\s+(?P<namespace>[a-zA-Z0-9_$]+)
        )?
        \s*from\s*
        ['"](?P<path>[^'"]+)['"]
    """,
    re.VERBOSE,
)

SIDE_EFFECT_RE = re.compile(
    r"""import\s+['"](?P<path>[^'"]+)['"]"""
)

EXPORT_RE = re.compile(
    r"""export\s+
        (?:default\s+)?
        (?:
            function\s+(?P<fn>[a-zA-Z0-9_$]+) |
            class\s+(?P<class>[a-zA-Z0-9_$]+) |
            const\s+(?P<const>[a-zA-Z0-9_$]+) |
            \{\s*(?P<named>[a-zA-Z0-9_$,\s]+)\s*\}
        )
    """,
    re.VERBOSE,
)

def collect_exports(file_path):
    exports = set()
    try:
        content = file_path.read_text()
    except Exception:
        return exports

    for m in EXPORT_RE.finditer(content):
        for key in ("fn", "class", "const"):
            if m.group(key):
                exports.add(m.group(key))
        if m.group("named"):
            for name in m.group("named").split(","):
                exports.add(name.strip())

    return exports

def resolve_import(base_file, import_path):
    base_dir = base_file.parent
    full_path = (base_dir / import_path).resolve()

    for ext in RESOLVE_EXTENSIONS:
        candidate = Path(str(full_path) + ext)
        if candidate.exists():
            return candidate

    return None

def find_file_by_name(root, filename):
    for path in root.rglob(filename):
        return path
    return None

def relative_path(from_file, to_file):
    rel = os.path.relpath(to_file, from_file.parent)
    if not rel.startswith("."):
        rel = "./" + rel
    return rel.replace("\\", "/")

def process_file(file_path, project_root):
    content = file_path.read_text()
    updated = False

    def handle_import(match):
        nonlocal updated
        import_path = match.group("path")

        if not import_path.startswith("."):
            return match.group(0)

        resolved = resolve_import(file_path, import_path)
        if resolved:
            named = match.groupdict().get("named")
            if named:
                exports = collect_exports(resolved)
                for name in named.split(","):
                    name = name.strip()
                    if name not in exports:
                        print(
                            f"[ERROR] {file_path}: '{name}' not exported by {resolved}"
                        )
            return match.group(0)

        target_name = Path(import_path).name
        found = (
            find_file_by_name(project_root, target_name + ".js")
            or find_file_by_name(project_root, target_name + ".jsx")
        )

        if found:
            new_path = relative_path(file_path, found)
            print(f"[FIX] {file_path}: {import_path} → {new_path}")
            updated = True
            return match.group(0).replace(import_path, new_path)

        print(f"[ERROR] {file_path}: unresolved import '{import_path}'")
        return match.group(0)

    content = IMPORT_RE.sub(handle_import, content)
    content = SIDE_EFFECT_RE.sub(handle_import, content)

    if updated:
        file_path.write_text(content)

def main(root_dir):
    root = Path(root_dir).resolve()

    for file in root.rglob("*"):
        if file.suffix in EXTENSIONS:
            process_file(file, root)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python update-imports.py <project_root>")
        sys.exit(1)

    main(sys.argv[1])
