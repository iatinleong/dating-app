const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 16, name: 'favicon-16x16.png' }
];

const inputFile = path.join(__dirname, 'public', 'icon-original.png');
const outputDir = path.join(__dirname, 'public');

async function generateIcons() {
  console.log('📸 開始生成 PWA 圖示...\n');

  for (const { size, name } of sizes) {
    try {
      const outputPath = path.join(outputDir, name);

      await sharp(inputFile)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ 生成 ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ 生成 ${name} 失敗:`, error.message);
    }
  }

  console.log('\n🎉 所有圖示生成完成！');
  console.log('\n📁 圖示位置：');
  sizes.forEach(({ name }) => {
    console.log(`   - public/${name}`);
  });
}

generateIcons().catch(console.error);
