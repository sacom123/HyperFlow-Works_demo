#!/bin/bash

# AVIF 변환을 위한 스크립트
# 사용법: pip3 install pillow-avif-plugin 또는 sharp를 사용

cd "$(dirname "$0")/frontend/public/images"

echo "Converting PNG images to AVIF format..."

# Python Pillow를 사용한 변환 (pillow-avif-plugin 필요)
if command -v python3 &> /dev/null; then
    python3 << 'PYTHON_SCRIPT'
import os
from PIL import Image

png_files = [
    'workflow-image-01.png',
    'workflow-image-02.png',
    'workflow-image-03.png',
    'workflow-image-04.png',
    'workflow-image-05.png',
    'logo.png'
]

converted = 0
for png_file in png_files:
    if os.path.exists(png_file):
        try:
            img = Image.open(png_file)
            avif_file = png_file.replace('.png', '.avif')
            img.save(avif_file, format='AVIF', quality=85)
            print(f"✓ Converted {png_file} to {avif_file}")
            converted += 1
        except Exception as e:
            print(f"✗ Error converting {png_file}: {e}")
    else:
        print(f"⚠ File not found: {png_file}")

if converted > 0:
    print(f"\n✓ Successfully converted {converted} images to AVIF format!")
else:
    print("\n⚠ No images were converted. Please install pillow-avif-plugin:")
    print("   pip3 install pillow-avif-plugin")
PYTHON_SCRIPT
else
    echo "Python3 not found. Please install Python3 and pillow-avif-plugin"
fi

