import os
import re
import sys
from pathlib import Path

def recreate_files(input_file):
    print("=" * 48)
    print(f"Recreating files from {input_file}")
    print("=" * 48)
    print()

    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by file headers
    file_pattern = r'-{40,}\nFile: (.+?)\n-{40,}\n(.*?)(?=\n-{40,}\nFile: |\Z)'
    matches = re.finditer(file_pattern, content, re.DOTALL)

    for match in matches:
        file_path = match.group(1).strip().lstrip('./')
        file_content = match.group(2).strip() + '\n'

        # Create directory structure
        Path(file_path).parent.mkdir(parents=True, exist_ok=True)

        # Write file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(file_content)

        print(f"✓ Created: {file_path}")

    print()
    print("=" * 48)
    print("File recreation complete!")
    print("=" * 48)
    print()
    print("⚠️  SECURITY WARNING:")
    print("   • These files contain sensitive credentials")
    print("   • Rotate all Supabase keys immediately")
    print("   • Never commit these files to git")
    print()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 recreate_files.py <gitignored_files.txt>")
        sys.exit(1)

    input_file = sys.argv[1]
    if not os.path.exists(input_file):
        print(f"Error: File '{input_file}' not found!")
        sys.exit(1)

    recreate_files(input_file)
