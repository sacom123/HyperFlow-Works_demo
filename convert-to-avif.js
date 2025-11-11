const fs = require('fs');
const path = require('path');

// AVIF 변환을 위한 간단한 스크립트
// 실제로는 sharp나 다른 라이브러리가 필요하지만,
// 일단 파일 목록을 확인하고 변환 준비
const imagesDir = path.join(__dirname, 'frontend/public/images');
const files = fs.readdirSync(imagesDir);

console.log('PNG files found:');
files.filter(f => f.endsWith('.png')).forEach(f => {
  console.log(`  - ${f}`);
  const avifName = f.replace('.png', '.avif');
  console.log(`    -> ${avifName}`);
});

console.log('\nNote: AVIF conversion requires sharp or pillow library.');
console.log('For now, we will update the code to use .avif extensions.');
