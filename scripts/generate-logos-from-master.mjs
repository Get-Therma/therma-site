#!/usr/bin/env node
/**
 * Generate all logo sizes from the master logo file
 * 
 * This script uses the master logo file as the source of truth:
 * - public/therma-logo-master.png (1024x1024)
 * 
 * Generates all required sizes for:
 * - Favicons (16, 24, 32)
 * - App icons (180, 192, 512)
 * - General use (various sizes)
 * 
 * Usage: node scripts/generate-logos-from-master.mjs
 * 
 * Requires: npm install --save-dev sharp
 */

import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const masterLogoPath = path.join(publicDir, 'therma-logo-master.png');

// All required logo sizes
const LOGO_SIZES = [
  // Favicons
  { name: 'therma-logo-16.png', size: 16 },
  { name: 'therma-logo-24.png', size: 24 },
  { name: 'therma-logo-32.png', size: 32 },
  // Email logo (80x80 is common for email templates)
  { name: 'therma-logo-80x80.png', size: 80 },
  // App icons
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'therma-logo-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'therma-logo.png', size: 512 },
];

async function generateLogoSize(filename, size) {
  try {
    const outputPath = path.join(publicDir, filename);
    
    await sharp(masterLogoPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
      })
      .png()
      .toFile(outputPath);
    
    console.log(`✓ Generated ${filename} (${size}x${size})`);
  } catch (error) {
    console.error(`✗ Failed to generate ${filename}:`, error.message);
    throw error;
  }
}

async function generateSVGFromMaster() {
  // Create SVG versions by embedding the PNG as base64
  // This is a simple approach - for better results, consider converting PNG to SVG vector
  const sizes = [16, 24, 32];
  
  for (const size of sizes) {
    const pngBuffer = await sharp(masterLogoPath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();
    
    const base64 = pngBuffer.toString('base64');
    const svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,${base64}" width="${size}" height="${size}"/>
</svg>`;
    
    const svgPath = path.join(publicDir, `therma-logo-${size}.svg`);
    await fs.writeFile(svgPath, svgContent);
    console.log(`✓ Generated therma-logo-${size}.svg (${size}x${size})`);
  }
  
  // Also create the main therma-logo.svg (32x32 default)
  const mainSvgPath = path.join(publicDir, 'therma-logo.svg');
  const mainPngBuffer = await sharp(masterLogoPath)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();
  
  const mainBase64 = mainPngBuffer.toString('base64');
  const mainSvgContent = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,${mainBase64}" width="32" height="32"/>
</svg>`;
  
  await fs.writeFile(mainSvgPath, mainSvgContent);
  console.log(`✓ Generated therma-logo.svg (32x32)`);
}

async function main() {
  console.log('🎨 Generating logos from master file...\n');
  
  // Check if master file exists
  try {
    await fs.access(masterLogoPath);
  } catch (error) {
    console.error(`✗ Master logo file not found: ${masterLogoPath}`);
    console.error('Please ensure therma-logo-master.png exists in the public folder.');
    process.exit(1);
  }
  
  // Generate all PNG sizes
  console.log('Generating PNG logos...');
  for (const { name, size } of LOGO_SIZES) {
    await generateLogoSize(name, size);
  }
  
  // Generate SVG versions
  console.log('\nGenerating SVG logos...');
  await generateSVGFromMaster();
  
  console.log('\n✅ All logos generated successfully!');
  console.log('\n📝 Note: The master file (therma-logo-master.png) is the source of truth.');
  console.log('   All generated logos are derived from this file.');
}

main().catch((err) => {
  console.error('\n❌ Error:', err);
  process.exit(1);
});
