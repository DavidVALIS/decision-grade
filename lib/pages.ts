export type PageEntry = {
  id: string;
  title: string;
  icon: string;
  num: string;
};

export const PAGES: PageEntry[] = [
  { id: 'introduction', title: 'Introduction', icon: 'IconLayers', num: '00' },
  { id: 'the-frame', title: 'The Frame', icon: 'IconCrosshair', num: '01' },
  { id: 'evidence', title: 'The Evidence Base', icon: 'IconPulse', num: '02' },
  { id: 'the-doctrine', title: 'The Doctrine', icon: 'IconShield', num: '03' },
  { id: 'buyers-checklist', title: "The Buyer's Checklist", icon: 'IconChecklist', num: '04' },
  { id: 'lane-discipline', title: 'Lane Discipline', icon: 'IconLanes', num: '05' },
  { id: 'watchlist', title: '2026 Watchlist', icon: 'IconCalendar', num: '06' },
];

// Benchmarks section removed 2026-07-06. Pages, components, and data
// deleted; the benchmark evidence repo is no longer public.

export const ABOUT_PAGE: PageEntry = {
  id: 'about',
  title: 'About',
  icon: 'IconDoc',
  num: 'A',
};

export const MCP_PAGE: PageEntry = {
  id: 'mcp',
  title: 'MCP Server',
  icon: 'IconFork',
  num: 'M',
};

export const COST_PAGE: PageEntry = {
  id: 'cost',
  title: 'The Costed Stack',
  icon: 'IconChecklist',
  num: 'C',
};

export const ALL_SLUGS: string[] = [
  ...PAGES.map((p) => p.id),
  ABOUT_PAGE.id,
  MCP_PAGE.id,
  COST_PAGE.id,
];

export function getBySlug(slug: string): PageEntry | undefined {
  if (slug === ABOUT_PAGE.id) return ABOUT_PAGE;
  if (slug === MCP_PAGE.id) return MCP_PAGE;
  if (slug === COST_PAGE.id) return COST_PAGE;
  return PAGES.find((p) => p.id === slug);
}

// Pager (prev/next).
function siblingList(slug: string): PageEntry[] | undefined {
  if (PAGES.some((p) => p.id === slug)) return PAGES;
  return undefined;
}

export function getPrev(slug: string): PageEntry | undefined {
  const list = siblingList(slug);
  if (!list) return undefined;
  const idx = list.findIndex((p) => p.id === slug);
  if (idx <= 0) return undefined;
  return list[idx - 1];
}

export function getNext(slug: string): PageEntry | undefined {
  const list = siblingList(slug);
  if (!list) return undefined;
  const idx = list.findIndex((p) => p.id === slug);
  if (idx === -1 || idx >= list.length - 1) return undefined;
  return list[idx + 1];
}

export const REPO_URL = 'https://github.com/DavidVALIS/decision-grade';
export const REPO_RAW_URL = 'https://raw.githubusercontent.com/DavidVALIS/decision-grade/main';
