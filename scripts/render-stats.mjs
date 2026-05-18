// Render <StatRow> / <Stat> blocks into plain markdown so they show up in
// the AI-readable bundle (llms-full.txt) and the search index. The Stat
// component is a structural data element on the page; downstream consumers
// (other LLMs, the in-site search) should see the value, label, and source
// as text, not as JSX.

export function renderStats(mdx) {
  let s = mdx;
  // Drop wrapper tags
  s = s.replace(/<StatRow\b[^>]*>/g, '');
  s = s.replace(/<\/StatRow>/g, '');
  // Convert <Stat ... /> blocks (may span multiple lines) to markdown
  s = s.replace(/<Stat\b([\s\S]*?)\/>/g, (_, attrs) => {
    const value =
      (attrs.match(/value="([^"]+)"/) || [])[1] ||
      (attrs.match(/value=\{['"]([^'"]+)['"]\}/) || [])[1] ||
      '';
    const label =
      (attrs.match(/label="([^"]+)"/) || [])[1] ||
      (attrs.match(/label=\{['"]([^'"]+)['"]\}/) || [])[1] ||
      '';
    const source = (attrs.match(/source="([^"]+)"/) || [])[1] || '';
    const parts = [];
    if (value) parts.push(`**${value}**`);
    if (label) parts.push(label);
    if (source) parts.push(`(${source})`);
    return '- ' + parts.join(' — ');
  });
  return s;
}

// CLI usage: pipe MDX through stdin, get markdown on stdout
import { fileURLToPath } from 'node:url';
if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  let buf = '';
  process.stdin.on('data', (chunk) => { buf += chunk; });
  process.stdin.on('end', () => { process.stdout.write(renderStats(buf)); });
}
