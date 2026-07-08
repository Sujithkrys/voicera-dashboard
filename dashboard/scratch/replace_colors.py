import os
import re

# Mapping of hardcoded light-theme classes to semantic equivalents
# We use regex with word boundaries to ensure we only replace exact tailwind classes.

replacements = {
    # Backgrounds
    r'\bbg-white\b': 'bg-background',
    r'\bbg-\[\#fafafa\]\b': 'bg-background',
    r'\bbg-\[\#FDFCFB\]\b': 'bg-background',
    r'\bbg-neutral-50\b': 'bg-muted',
    r'\bbg-neutral-100\b': 'bg-secondary',
    r'\bhover:bg-neutral-50\b': 'hover:bg-muted',
    r'\bhover:bg-neutral-100\b': 'hover:bg-secondary',
    r'\bbg-neutral-900\b': 'bg-primary',
    r'\bbg-neutral-800\b': 'bg-primary',
    
    # Text
    r'\btext-neutral-900\b': 'text-foreground',
    r'\btext-neutral-800\b': 'text-foreground',
    r'\btext-neutral-700\b': 'text-foreground',
    r'\btext-neutral-600\b': 'text-muted-foreground',
    r'\btext-neutral-500\b': 'text-muted-foreground',
    r'\btext-neutral-400\b': 'text-muted-foreground',
    r'\btext-white\b': 'text-primary-foreground',
    r'\btext-black\b': 'text-foreground',
    
    # Borders
    r'\bborder-neutral-200\b': 'border-border',
    r'\bborder-neutral-100\b': 'border-border',
    r'\bborder-neutral-300\b': 'border-border',
    r'\bhover:border-neutral-300\b': 'hover:border-border',
    
    # Custom specific colors (if they exist)
    r'\bbg-slate-50\b': 'bg-muted',
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    for pattern, replacement in replacements.items():
        new_content = re.sub(pattern, replacement, new_content)

    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def main():
    target_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src', 'app'))
    
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.jsx', '.js')):
                filepath = os.path.join(root, file)
                process_file(filepath)

if __name__ == "__main__":
    main()
