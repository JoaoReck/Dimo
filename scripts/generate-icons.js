import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Clean SVG in Vanilla (#EDE8D0) + Charcoal (#141410) palette
const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Solid Beige Baunilha Claro background -->
  <rect width="512" height="512" fill="#EDE8D0"/>
  
  <!-- Subtle container / card frame in Baunilha + Acinzentado -->
  <rect x="36" y="36" width="440" height="440" rx="96" fill="#EDE8D0" stroke="#C4C0AB" stroke-width="8"/>
  
  <!-- Centered Dimo Symbol (letter D formed by spine and cycle) -->
  <g transform="translate(144, 144) scale(7)">
    <!-- Vertical timeline spine -->
    <line x1="10" y1="6" x2="10" y2="26" stroke="#777567" stroke-width="2.6" stroke-linecap="round"/>
    
    <!-- Semicircular journey / cycle path forming the loop of 'D' -->
    <path d="M 10 7.5 H 17 C 22.5 7.5 25.5 11 25.5 16 C 25.5 21 22.5 24.5 17 24.5 H 10" 
          stroke="#141410" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    
    <!-- Waypoint outer aura / ring -->
    <circle cx="10" cy="16" r="5" stroke="#9D9988" stroke-width="1.2" stroke-opacity="0.6"/>
    
    <!-- Waypoint node center -->
    <circle cx="10" cy="16" r="3.2" fill="#141410"/>
  </g>
</svg>`;

// Full bleed maskable SVG with safe margin
const maskableSvgContent = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Solid Beige Baunilha Claro background -->
  <rect width="512" height="512" fill="#EDE8D0"/>
  
  <!-- Centered Dimo Symbol within the 70% safe zone -->
  <g transform="translate(160, 160) scale(6)">
    <!-- Vertical timeline spine -->
    <line x1="10" y1="6" x2="10" y2="26" stroke="#777567" stroke-width="2.6" stroke-linecap="round"/>
    
    <!-- Semicircular journey / cycle path forming the loop of 'D' -->
    <path d="M 10 7.5 H 17 C 22.5 7.5 25.5 11 25.5 16 C 25.5 21 22.5 24.5 17 24.5 H 10" 
          stroke="#141410" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    
    <!-- Waypoint outer aura / ring -->
    <circle cx="10" cy="16" r="5" stroke="#9D9988" stroke-width="1.2" stroke-opacity="0.6"/>
    
    <!-- Waypoint node center -->
    <circle cx="10" cy="16" r="3.2" fill="#141410"/>
  </g>
</svg>`;

async function generate() {
  const publicDir = path.resolve('public');

  // Write icon.svg
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf8');
  console.log('Written icon.svg');

  const svgBuffer = Buffer.from(svgContent);
  const maskableSvgBuffer = Buffer.from(maskableSvgContent);

  // 1. apple-touch-icon.png (180x180 for iOS Safari home screen)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png (180x180)');

  // 2. pwa-192x192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // 3. pwa-512x512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // 4. pwa-maskable-512x512.png
  await sharp(maskableSvgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // 5. favicon-32x32.png
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('Generated favicon-32x32.png');

  console.log('All icons generated successfully!');
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
