import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Exact SVG representation of the user's official Dimo RPG Chromatic Sword
// Upright Vertical (icone4)
const verticalSwordSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Left edge rainbow gradient (cyan to deep sky) -->
    <linearGradient id="bladeLeft" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#e0f2fe" />
    </linearGradient>

    <!-- Right edge rainbow gradient (purple, magenta, orange, yellow) -->
    <linearGradient id="bladeRight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="25%" stop-color="#818cf8" />
      <stop offset="50%" stop-color="#c084fc" />
      <stop offset="75%" stop-color="#f472b6" />
      <stop offset="100%" stop-color="#fbbf24" />
    </linearGradient>

    <!-- Central fuller silver groove -->
    <linearGradient id="bladeCenter" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#64748b" />
      <stop offset="50%" stop-color="#334155" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>

    <!-- Crossguard steel gradient -->
    <linearGradient id="guardSteel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f1f5f9" />
      <stop offset="30%" stop-color="#cbd5e1" />
      <stop offset="70%" stop-color="#64748b" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>

    <!-- Red Cross Jewel gradient -->
    <linearGradient id="crossRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="50%" stop-color="#dc2626" />
      <stop offset="100%" stop-color="#991b1b" />
    </linearGradient>

    <!-- Crimson Leather grip -->
    <linearGradient id="gripLeather" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7f1d1d" />
      <stop offset="40%" stop-color="#991b1b" />
      <stop offset="70%" stop-color="#dc2626" />
      <stop offset="100%" stop-color="#450a0a" />
    </linearGradient>

    <!-- Gold rings -->
    <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>

    <!-- Drop shadow for weapon definition -->
    <filter id="swordOutline" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#141410" flood-opacity="0.35" />
    </filter>
  </defs>

  <g filter="url(#swordOutline)">
    <!-- OUTLINE SILHOUETTE (Dark Charcoal #141410) -->
    <!-- Blade Outer -->
    <path d="M256 34 L294 92 L294 316 L218 316 L218 92 Z" fill="#141410" stroke="#141410" stroke-width="12" stroke-linejoin="round" />

    <!-- Blade Left Face -->
    <path d="M256 42 L224 96 L224 312 L246 312 L246 102 Z" fill="url(#bladeLeft)" />
    <!-- Blade Right Face -->
    <path d="M256 42 L288 96 L288 312 L266 312 L266 102 Z" fill="url(#bladeRight)" />
    <!-- Blade Central Groove / Fuller -->
    <path d="M256 102 L246 112 L246 312 L266 312 L266 112 Z" fill="url(#bladeCenter)" />
    <line x1="256" y1="102" x2="256" y2="312" stroke="#f8fafc" stroke-width="3" stroke-linecap="round" opacity="0.85" />
    <!-- Blade Edge Highlights -->
    <line x1="256" y1="42" x2="224" y2="96" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
    <line x1="224" y1="96" x2="224" y2="312" stroke="#ffffff" stroke-width="2" opacity="0.6" />

    <!-- Pommel & Grip Outline -->
    <path d="M238 368 H274 V452 H238 Z" fill="#141410" stroke="#141410" stroke-width="8" stroke-linejoin="round" />

    <!-- Pommel (Bottom Cap) -->
    <path d="M232 454 H280 L274 476 L256 488 L238 476 Z" fill="url(#guardSteel)" stroke="#141410" stroke-width="6" stroke-linejoin="round" />
    <line x1="244" y1="462" x2="268" y2="462" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.8" />

    <!-- Grip (Burgundy leather segments) -->
    <rect x="238" y="372" width="36" height="20" rx="4" fill="url(#gripLeather)" stroke="#141410" stroke-width="3" />
    <rect x="238" y="396" width="36" height="24" rx="4" fill="url(#gripLeather)" stroke="#141410" stroke-width="3" />
    <rect x="238" y="424" width="36" height="24" rx="4" fill="url(#gripLeather)" stroke="#141410" stroke-width="3" />

    <!-- Grip Golden Rings -->
    <rect x="236" y="366" width="40" height="7" rx="3" fill="url(#goldRing)" stroke="#141410" stroke-width="2.5" />
    <rect x="236" y="418" width="40" height="7" rx="3" fill="url(#goldRing)" stroke="#141410" stroke-width="2.5" />
    <rect x="236" y="448" width="40" height="7" rx="3" fill="url(#goldRing)" stroke="#141410" stroke-width="2.5" />

    <!-- Crossguard (Steel with rounded brackets & central medallion) -->
    <!-- Guard Base Bar -->
    <path d="M192 316 C182 316 182 364 192 364 H320 C330 364 330 316 320 316 Z" fill="url(#guardSteel)" stroke="#141410" stroke-width="8" stroke-linejoin="round" />
    <!-- Guard Side Brackets -->
    <path d="M184 316 C174 316 174 364 184 364 H196 V316 Z" fill="url(#guardSteel)" stroke="#141410" stroke-width="6" />
    <path d="M328 316 C338 316 338 364 328 364 H316 V316 Z" fill="url(#guardSteel)" stroke="#141410" stroke-width="6" />
    <!-- Rivet Studs -->
    <circle cx="210" cy="340" r="7" fill="#64748b" stroke="#141410" stroke-width="3" />
    <circle cx="208" cy="338" r="2.5" fill="#f8fafc" />
    <circle cx="302" cy="340" r="7" fill="#64748b" stroke="#141410" stroke-width="3" />
    <circle cx="300" cy="338" r="2.5" fill="#f8fafc" />

    <!-- Central Square Cross Medallion Plate -->
    <rect x="232" y="314" width="48" height="52" rx="10" fill="url(#guardSteel)" stroke="#141410" stroke-width="6" />

    <!-- Red Cross Insignia -->
    <path d="M250 324 H262 V334 H272 V346 H262 V356 H250 V346 H240 V334 H250 Z" fill="url(#crossRed)" stroke="#141410" stroke-width="4" stroke-linejoin="round" />
    <path d="M252 326 H260 V336 H270 V344 H260 V354 H252 V344 H242 V336 H252 Z" fill="#f87171" opacity="0.6" />
  </g>
</svg>
`;

// Diagonal 45-degree angle (icone2)
const diagonalSwordSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Left edge rainbow gradient (cyan to deep sky) -->
    <linearGradient id="bladeLeftD" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#e0f2fe" />
    </linearGradient>

    <!-- Right edge rainbow gradient (purple, magenta, orange, yellow) -->
    <linearGradient id="bladeRightD" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="25%" stop-color="#818cf8" />
      <stop offset="50%" stop-color="#c084fc" />
      <stop offset="75%" stop-color="#f472b6" />
      <stop offset="100%" stop-color="#fbbf24" />
    </linearGradient>

    <!-- Central fuller silver groove -->
    <linearGradient id="bladeCenterD" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#64748b" />
      <stop offset="50%" stop-color="#334155" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>

    <!-- Crossguard steel gradient -->
    <linearGradient id="guardSteelD" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f1f5f9" />
      <stop offset="30%" stop-color="#cbd5e1" />
      <stop offset="70%" stop-color="#64748b" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>

    <!-- Red Cross Jewel gradient -->
    <linearGradient id="crossRedD" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="50%" stop-color="#dc2626" />
      <stop offset="100%" stop-color="#991b1b" />
    </linearGradient>

    <!-- Crimson Leather grip -->
    <linearGradient id="gripLeatherD" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7f1d1d" />
      <stop offset="40%" stop-color="#991b1b" />
      <stop offset="70%" stop-color="#dc2626" />
      <stop offset="100%" stop-color="#450a0a" />
    </linearGradient>

    <!-- Gold rings -->
    <linearGradient id="goldRingD" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>

    <!-- Drop shadow for weapon definition -->
    <filter id="swordOutlineD" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="-2" dy="6" stdDeviation="6" flood-color="#141410" flood-opacity="0.3" />
    </filter>
  </defs>

  <g transform="rotate(45 256 256)" filter="url(#swordOutlineD)">
    <!-- OUTLINE SILHOUETTE (Dark Charcoal #141410) -->
    <!-- Blade Outer -->
    <path d="M256 34 L294 92 L294 316 L218 316 L218 92 Z" fill="#141410" stroke="#141410" stroke-width="12" stroke-linejoin="round" />

    <!-- Blade Left Face -->
    <path d="M256 42 L224 96 L224 312 L246 312 L246 102 Z" fill="url(#bladeLeftD)" />
    <!-- Blade Right Face -->
    <path d="M256 42 L288 96 L288 312 L266 312 L266 102 Z" fill="url(#bladeRightD)" />
    <!-- Blade Central Groove / Fuller -->
    <path d="M256 102 L246 112 L246 312 L266 312 L266 112 Z" fill="url(#bladeCenterD)" />
    <line x1="256" y1="102" x2="256" y2="312" stroke="#f8fafc" stroke-width="3" stroke-linecap="round" opacity="0.85" />
    <!-- Blade Edge Highlights -->
    <line x1="256" y1="42" x2="224" y2="96" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
    <line x1="224" y1="96" x2="224" y2="312" stroke="#ffffff" stroke-width="2" opacity="0.6" />

    <!-- Pommel & Grip Outline -->
    <path d="M238 368 H274 V452 H238 Z" fill="#141410" stroke="#141410" stroke-width="8" stroke-linejoin="round" />

    <!-- Pommel (Bottom Cap) -->
    <path d="M232 454 H280 L274 476 L256 488 L238 476 Z" fill="url(#guardSteelD)" stroke="#141410" stroke-width="6" stroke-linejoin="round" />
    <line x1="244" y1="462" x2="268" y2="462" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.8" />

    <!-- Grip (Burgundy leather segments) -->
    <rect x="238" y="372" width="36" height="20" rx="4" fill="url(#gripLeatherD)" stroke="#141410" stroke-width="3" />
    <rect x="238" y="396" width="36" height="24" rx="4" fill="url(#gripLeatherD)" stroke="#141410" stroke-width="3" />
    <rect x="238" y="424" width="36" height="24" rx="4" fill="url(#gripLeatherD)" stroke="#141410" stroke-width="3" />

    <!-- Grip Golden Rings -->
    <rect x="236" y="366" width="40" height="7" rx="3" fill="url(#goldRingD)" stroke="#141410" stroke-width="2.5" />
    <rect x="236" y="418" width="40" height="7" rx="3" fill="url(#goldRingD)" stroke="#141410" stroke-width="2.5" />
    <rect x="236" y="448" width="40" height="7" rx="3" fill="url(#goldRingD)" stroke="#141410" stroke-width="2.5" />

    <!-- Crossguard (Steel with rounded brackets & central medallion) -->
    <path d="M192 316 C182 316 182 364 192 364 H320 C330 364 330 316 320 316 Z" fill="url(#guardSteelD)" stroke="#141410" stroke-width="8" stroke-linejoin="round" />
    <path d="M184 316 C174 316 174 364 184 364 H196 V316 Z" fill="url(#guardSteelD)" stroke="#141410" stroke-width="6" />
    <path d="M328 316 C338 316 338 364 328 364 H316 V316 Z" fill="url(#guardSteelD)" stroke="#141410" stroke-width="6" />
    <!-- Rivet Studs -->
    <circle cx="210" cy="340" r="7" fill="#64748b" stroke="#141410" stroke-width="3" />
    <circle cx="208" cy="338" r="2.5" fill="#f8fafc" />
    <circle cx="302" cy="340" r="7" fill="#64748b" stroke="#141410" stroke-width="3" />
    <circle cx="300" cy="338" r="2.5" fill="#f8fafc" />

    <!-- Central Square Cross Medallion Plate -->
    <rect x="232" y="314" width="48" height="52" rx="10" fill="url(#guardSteelD)" stroke="#141410" stroke-width="6" />

    <!-- Red Cross Insignia -->
    <path d="M250 324 H262 V334 H272 V346 H262 V356 H250 V346 H240 V334 H250 Z" fill="url(#crossRedD)" stroke="#141410" stroke-width="4" stroke-linejoin="round" />
    <path d="M252 326 H260 V336 H270 V344 H260 V354 H252 V344 H242 V336 H252 Z" fill="#f87171" opacity="0.6" />
  </g>
</svg>
`;

// App Icon with official Baunilha (#EDE8D0) background badge for iPhone Home Screen and PWA
const appIconSvg = (size = 512, padding = 48) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <!-- Background subtle gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF8F0" />
      <stop offset="100%" stop-color="#EDE8D0" />
    </linearGradient>
    <filter id="badgeShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#141410" flood-opacity="0.18" />
    </filter>
  </defs>

  <!-- iOS / PWA Squircle Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bgGrad)" />

  <!-- Subtle inner border -->
  <rect x="4" y="4" width="${size - 8}" height="${size - 8}" rx="${size * 0.22}" fill="none" stroke="#C4C0AB" stroke-width="6" opacity="0.6" />

  <!-- Diagonal Sword embedded inside the App Icon Badge -->
  <g transform="translate(${padding}, ${padding}) scale(${(size - padding * 2) / 512})">
    ${diagonalSwordSvg.replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">', '').replace('</svg>', '')}
  </g>
</svg>
`;

async function generate() {
  const publicDir = path.resolve('public');

  console.log('Generating sword assets...');

  // 1. icone4.png (Vertical upright sword, transparent 512x512)
  await sharp(Buffer.from(verticalSwordSvg))
    .png()
    .toFile(path.join(publicDir, 'icone4.png'));
  console.log('Saved public/icone4.png');

  // 2. icone2.png (Diagonal 45-degree sword, transparent 512x512)
  await sharp(Buffer.from(diagonalSwordSvg))
    .png()
    .toFile(path.join(publicDir, 'icone2.png'));
  console.log('Saved public/icone2.png');

  // 3. apple-touch-icon.png (180x180 with solid Baunilha badge for iPhone Home Screen)
  await sharp(Buffer.from(appIconSvg(180, 16)))
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Saved public/apple-touch-icon.png (iPhone Home Screen)');

  // Also create apple-touch-icon-precomposed.png
  await sharp(Buffer.from(appIconSvg(180, 16)))
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon-precomposed.png'));

  // 4. pwa-192x192.png
  await sharp(Buffer.from(appIconSvg(192, 18)))
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Saved public/pwa-192x192.png');

  // 5. pwa-512x512.png
  await sharp(Buffer.from(appIconSvg(512, 48)))
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Saved public/pwa-512x512.png');

  // 6. pwa-maskable-512x512.png (with safe-zone padding)
  await sharp(Buffer.from(appIconSvg(512, 80)))
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Saved public/pwa-maskable-512x512.png');

  // 7. favicon-32x32.png
  await sharp(Buffer.from(appIconSvg(64, 4)))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('Saved public/favicon-32x32.png');

  // 8. icon.svg
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), appIconSvg(512, 48));
  console.log('Saved public/icon.svg');

  // Also save vertical and diagonal raw SVGs for fast vector inlining in components
  fs.writeFileSync(path.join(publicDir, 'sword-vertical.svg'), verticalSwordSvg);
  fs.writeFileSync(path.join(publicDir, 'sword-diagonal.svg'), diagonalSwordSvg);
  console.log('All Dimo sword icons generated successfully!');
}

generate().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
