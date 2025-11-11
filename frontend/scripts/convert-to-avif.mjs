import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SVG 파일에서 base64 PNG 이미지 추출
function extractBase64FromSVG(svgPath) {
  const svgContent = fs.readFileSync(svgPath, 'utf-8');
  const base64Match = svgContent.match(/data:image\/png;base64,([^"']+)/);
  
  if (base64Match) {
    return base64Match[1];
  }
  return null;
}

// Base64를 PNG 파일로 저장
function saveBase64AsPNG(base64, outputPath) {
  const buffer = Buffer.from(base64, 'base64');
  fs.writeFileSync(outputPath, buffer);
  console.log(`PNG saved to: ${outputPath}`);
}

// PNG를 AVIF로 변환 (sharp 라이브러리 사용)
async function convertPNGToAVIF(pngPath, avifPath) {
  try {
    // dynamic import로 sharp 로드
    const sharp = (await import('sharp')).default;
    
    await sharp(pngPath)
      .avif({ quality: 80 })
      .toFile(avifPath);
    
    console.log(`AVIF saved to: ${avifPath}`);
  } catch (error) {
    console.error('Error converting to AVIF:', error.message);
    console.log('Note: Install sharp with: npm install sharp');
  }
}

// 메인 함수
async function main() {
  const svgPath = path.join(__dirname, '../src/assets/images/header-logo.svg');
  const pngPath = path.join(__dirname, '../src/assets/images/header-logo-extracted.png');
  const avifPath = path.join(__dirname, '../src/assets/images/header-logo.avif');
  
  console.log('Extracting base64 image from SVG...');
  const base64 = extractBase64FromSVG(svgPath);
  
  if (!base64) {
    console.log('No base64 image found in SVG. Using SVG as is.');
    return;
  }
  
  console.log('Saving PNG...');
  saveBase64AsPNG(base64, pngPath);
  
  console.log('Converting PNG to AVIF...');
  await convertPNGToAVIF(pngPath, avifPath);
  
  console.log('Done!');
}

main().catch(console.error);
