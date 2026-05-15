export type PageEntry = {
  id: string;
  title: string;
  icon: string;
  num: string;
};

export const PAGES: PageEntry[] = [
  { id: 'introduction', title: 'Introduction', icon: 'IconLayers', num: '00' },
  { id: 'the-frame', title: 'The Frame', icon: 'IconCrosshair', num: '01' },
  { id: 'the-doctrine', title: 'The Doctrine', icon: 'IconShield', num: '02' },
  { id: 'buyers-checklist', title: "The Buyer's Checklist", icon: 'IconChecklist', num: '03' },
  { id: 'lane-discipline', title: 'Lane Discipline', icon: 'IconLanes', num: '04' },
  { id: 'watchlist', title: '2026 Watchlist', icon: 'IconCalendar', num: '05' },
];

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

export const ALL_SLUGS: string[] = [
  ...PAGES.map((p) => p.id),
  ABOUT_PAGE.id,
  MCP_PAGE.id,
];

export function getBySlug(slug: string): PageEntry | undefined {
  if (slug === ABOUT_PAGE.id) return ABOUT_PAGE;
  if (slug === MCP_PAGE.id) return MCP_PAGE;
  return PAGES.find((p) => p.id === slug);
}

export function getPrev(slug: string): PageEntry | undefined {
  const idx = PAGES.findIndex((p) => p.id === slug);
  if (idx <= 0) return undefined;
  return PAGES[idx - 1];
}

export function getNext(slug: string): PageEntry | undefined {
  const idx = PAGES.findIndex((p) => p.id === slug);
  if (idx === -1 || idx >= PAGES.length - 1) return undefined;
  return PAGES[idx + 1];
}

export const REPO_URL = 'https://github.com/DavidVALIS/decision-grade';
export const REPO_RAW_URL = 'https://raw.githubusercontent.com/DavidVALIS/decision-grade/main';
