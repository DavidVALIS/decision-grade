// Copies the canonical llms.txt and llms-full.txt from the repo root
// into the Next.js public/ folder so they ship in the static export.
// Run automatically before dev and build.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const publicDir = resolve(root, 'public');

if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

const files = ['llms.txt', 'llms-full.txt'];
for (const name of files) {
  const src = resolve(root, name);
  if (!existsSync(src)) {
    console.warn(`[sync-public] skip: ${name} not found at repo root`);
    continue;
  }
  copyFileSync(src, resolve(publicDir, name));
  console.log(`[sync-public] copied ${name} -> public/${name}`);
}
