import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

const REPO_ROOT = path.resolve(process.cwd());

export type Frontmatter = {
  title?: string;
  description?: string;
};

export type TocItem = {
  id: string;
  label: string;
  depth: number;
};

export type MdxBundle = {
  mdxSource: MDXRemoteSerializeResult;
  frontmatter: Frontmatter;
  toc: TocItem[];
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function extractToc(content: string): TocItem[] {
  const items: TocItem[] = [];
  const seen = new Set<string>();
  const lines = content.split('\n');
  let inFence = false;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const depth = m[1].length;
    const label = m[2].replace(/`/g, '').replace(/\*\*/g, '');
    let id = slugify(label);
    let suffix = 2;
    while (seen.has(id)) {
      id = `${slugify(label)}-${suffix++}`;
    }
    seen.add(id);
    items.push({ id, label, depth });
  }
  return items;
}

export function readMdxFile(slug: string): string {
  const filePath = path.join(REPO_ROOT, `${slug}.mdx`);
  return fs.readFileSync(filePath, 'utf8');
}

export async function loadMdx(slug: string): Promise<MdxBundle> {
  const raw = readMdxFile(slug);
  const parsed = matter(raw);
  const toc = extractToc(parsed.content);
  const mdxSource = await serialize(parsed.content, {
    parseFrontmatter: false,
    mdxOptions: {
      development: false,
    },
  });
  return {
    mdxSource,
    frontmatter: parsed.data as Frontmatter,
    toc,
  };
}
