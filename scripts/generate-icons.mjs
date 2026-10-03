/* global Image, document -- inside Playwright's browser evaluation */
import { URL } from 'node:url';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

// Rasterize the code-owned SVG mark; no image-processing dependency required.
// Run `npx playwright install chromium` before the first regeneration.
const source = await readFile(
  new URL('../public/favicon.svg', import.meta.url),
  'utf8',
);
const destination = new URL('../public/icons/', import.meta.url);
await mkdir(destination, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const icons = await page.evaluate(async (svg) => {
    const image = new Image();
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    await image.decode();
    const variants = [
      { name: 'icon-192.png', size: 192 },
      { name: 'icon-512.png', size: 512 },
      { name: 'maskable-512.png', size: 512 },
      { name: 'apple-touch-icon.png', size: 180 },
    ];
    return variants.map(({ name, size }) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas unavailable for icon generation.');
      context.fillStyle = '#fffaf3';
      context.fillRect(0, 0, size, size);
      context.drawImage(image, 0, 0, size, size);
      return { name, data: canvas.toDataURL('image/png').split(',')[1] };
    });
  }, source);
  for (const { name, data } of icons) {
    await writeFile(new URL(name, destination), Buffer.from(data, 'base64'));
    process.stdout.write(`Generated ${name}\n`);
  }
} finally {
  await browser.close();
}
