const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng() {
  try {
    const svgPath = path.join(__dirname, '../assets/logo.svg');
    const pngPath = path.join(__dirname, '../assets/logo.png');
    
    // 读取SVG文件
    const svgBuffer = fs.readFileSync(svgPath);
    
    // 使用sharp转换 - 1818x426是原logo的尺寸
    await sharp(svgBuffer, { density: 300 })
      .resize(1818, 426, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(pngPath);
    
    console.log('✅ PNG logo created at:', pngPath);
    
    // 获取文件信息
    const stats = fs.statSync(pngPath);
    console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Error converting SVG to PNG:', error.message);
    
    if (error.message.includes('Cannot find module')) {
      console.log('\n?? Please install sharp first:');
      console.log('   npm install sharp');
    }
  }
}

convertSvgToPng();