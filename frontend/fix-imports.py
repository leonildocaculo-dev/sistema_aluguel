import os
import re

replacements = ['Button', 'Card', 'Input', 'Popover', 'Calendar', 'Checkbox', 'Label', 'Skeleton', 'Slider', 'Separator', 'Badge']

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            original = content
            for r in replacements:
                # Replace ui/Card with ui/card
                content = re.sub(r'ui/' + r + r'(?=[\'\"])', 'ui/' + r.lower(), content)
                # Replace ./Card with ./card inside components/ui
                if 'components\\\\ui' in path or 'components/ui' in path:
                    content = re.sub(r'\./' + r + r'(?=[\'\"])', './' + r.lower(), content)
            if content != original:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Fixed {path}')
