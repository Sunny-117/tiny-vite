const fs = require('fs');
const path = require('path');

// 创建简单的SVG到PNG转换脚本
// 注意：需要安装 sharp 或使用浏览器/在线工具转换

const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1818" height="426">
  <defs>
    <linearGradient id="tiny-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#646cff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9d6aff;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 简化的闪电符号，带小点体现"tiny" -->
  <g>
    <!-- 主闪电 -->
    <path d="M280 48L180 200h100l-40 264 192-280H280z" 
          fill="url(#tiny-gradient)" 
          stroke="none"/>
    
    <!-- 小装饰点，体现"tiny"概念 -->
    <circle cx="320" cy="140" r="12" fill="#bd88ff" opacity="0.8"/>
    <circle cx="350" cy="170" r="8" fill="#bd88ff" opacity="0.6"/>
    <circle cx="300" cy="115" r="6" fill="#bd88ff" opacity="0.5"/>
  </g>
</svg>`;

// 保存SVG文件
const svgPath = path.join(__dirname, '../assets/logo.svg');
fs.writeFileSync(svgPath, svgContent);

console.log('✅ SVG logo created at:', svgPath);
console.log('💡 To convert to PNG, you can:');
console.log('   1. Use an online tool like: https://cloudconvert.com/svg-to-png');
console.log('   2. Use sharp package: npm install sharp && node scripts/svg-to-png.js');
console.log('   3. Use a design tool like Figma, Sketch, or Adobe Illustrator');