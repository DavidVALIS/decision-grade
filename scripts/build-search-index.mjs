#!/usr/bin/env node
// Build a flat search index from MDX files in the repo root.
// Writes public/search-index.json consumed by components/Search.tsx.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SLUGS = [
  'introduction',
  'the-frame',
  'evidence',
  'the-doctrine',
  'buyers-checklist',
  'lane-discipline',
  'watchlist',
  'about',
  'mcp',
];

const NUMS = {
  introduction: '00',
  'the-frame': '01',
  evidence: '02',
  'the-doctrine': '03',
  'buyers-checklist': '04',
  'lane-discipline': '05',
  watchlist: '06',
  about: 'A',
  mcp: 'M',
};

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function stripMdx(content) {
  let s = content;
  // Strip code fences (including mermaid)
  s = s.replace(/```[\s\S]*?```/g, ' ');
  // Strip inline code
  s = s.replace(/`[^`]+`/g, ' ');
  // Strip JSX/HTML tags but keep inner text. Run twice to handle nested-ish cases.
  s = s.replace(/<[^>]+>/g, ' ');
  s = s.replace(/<[^>]+>/g, ' ');
  // Strip markdown bold/italic emphasis markers (keep content)
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1');
  s = s.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1$2');
  s = s.replace(/(^|[\s(])_([^_\n]+)_/g, '$1$2');
  // Markdown links: keep text, drop URL
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // Markdown bullet markers
  s = s.replace(/^\s*[-*+]\s+/gm, '');
  // Blockquote markers
  s = s.replace(/^\s*>\s?/gm, '');
  // Tables: keep cell contents, drop pipes and separators
  s = s.replace(/^\s*\|.*\|.*$/gm, (line) =>
    line.replace(/\|/g, ' ').replace(/^[\s\-:]+$/, ''),
  );
  // Drop heading hashes (we handle headings separately)
  s = s.replace(/^#+\s*/gm, '');
  // Normalize whitespace
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function buildIndex() {
  const entries = [];

  for (const slug of SLUGS) {
    const file = path.join(ROOT, `${slug}.mdx`);
    if (!fs.existsSync(file)) {
      console.warn(`Skipping missing file: ${slug}.mdx`);
      continue;
    }

    const raw = fs.readFileSync(file, 'utf-8');
    const { data, content } = matter(raw);

    const sections = [];

    // Split by H2 headings: parts alternate [intro, heading1, body1, heading2, body2, ...]
    const parts = content.split(/^## (.+)$/m);

    // Intro (text before first H2)
    const introText = stripMdx(parts[0] || '');
    if (introText) {
      sections.push({ id: '', heading: '', text: introText });
    }

    for (let i = 1; i < parts.length; i += 2) {
      const heading = parts[i].trim();
      const body = parts[i + 1] || '';
      const text = stripMdx(body);
      sections.push({
        id: slugify(heading),
        heading,
        text,
      });
    }

    entries.push({
      slug,
      title: data.title || slug,
      description: data.description || '',
      num: NUMS[slug] || '',
      sections,
    });
  }

  const outDir = path.join(ROOT, 'public');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'search-index.json');
  fs.writeFileSync(outPath, JSON.stringify(entries));

  const sectionCount = entries.reduce((acc, p) => acc + p.sections.length, 0);
  console.log(
    `Built search index: ${entries.length} pages, ${sectionCount} sections, ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`,
  );
}

buildIndex();
