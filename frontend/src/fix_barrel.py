import os

def fix_barrel(folder):
    exports = []
    for f in os.listdir(folder):
        if f.endswith(".js") and f != "index.js":
            name = f.replace(".js", "")
            exports.append(f"export * from './{name}';")
            exports.append(f"export {{ default as {name} }} from './{name}';")

    if exports:
        with open(os.path.join(folder, "index.js"), "w") as fd:
            fd.write("\n".join(sorted(set(exports))) + "\n")
        print("[FIX]", folder)

for root, dirs, _ in os.walk("src"):
    if any(f.endswith("Service.js") for f in os.listdir(root)):
        fix_barrel(root)
