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

// Benchmarks group -- a sibling section to Framework in the sidebar.
// Each entry is a page slug at the project root (benchmarks.mdx,
// benchmarks-methodology.mdx, etc). Nested wedges live as
// benchmarks-v1-0-0-<wedge>.mdx under the v1.0.0 sub-group.
export type BenchmarkVersionGroup = {
  version: string;
  pages: PageEntry[];
};

export const BENCHMARK_PAGES: PageEntry[] = [
  { id: 'benchmarks', title: 'Overview', icon: 'IconBars', num: 'B0' },
  { id: 'benchmarks-methodology', title: 'Methodology', icon: 'IconBookOpen', num: 'B1' },
  { id: 'benchmarks-verify', title: 'Verify', icon: 'IconShield', num: 'B2' },
];

export const BENCHMARK_VERSION_GROUPS: BenchmarkVersionGroup[] = [
  {
    version: 'v1.0.0',
    pages: [
      { id: 'benchmarks-v1-0-0', title: 'Results overview', icon: 'IconPulse', num: 'B3' },
      { id: 'benchmarks-v1-0-0-phantom-precision', title: 'Spot a fake number', icon: 'IconCrosshair', num: 'B3.1' },
      { id: 'benchmarks-v1-0-0-mechanism-gap', title: 'Does "because" mean because', icon: 'IconCrosshair', num: 'B3.2' },
      { id: 'benchmarks-v1-0-0-falsifier-observability', title: 'Could it be proven wrong', icon: 'IconCrosshair', num: 'B3.3' },
      { id: 'benchmarks-v1-0-0-citation-faithfulness', title: 'Does the source say that', icon: 'IconCrosshair', num: 'B3.4' },
      { id: 'benchmarks-v1-0-0-boundary-condition-omission', title: 'Notice what is missing', icon: 'IconCrosshair', num: 'B3.5' },
      { id: 'benchmarks-v1-0-0-load-bearing-claim-identification', title: 'Which claim breaks it', icon: 'IconCrosshair', num: 'B3.6' },
      { id: 'benchmarks-v1-0-0-disagreement', title: 'Reviewer disagreement', icon: 'IconListCheck', num: 'B3.7' },
    ],
  },
];

export const ALL_BENCHMARK_PAGES: PageEntry[] = [
  ...BENCHMARK_PAGES,
  ...BENCHMARK_VERSION_GROUPS.flatMap((g) => g.pages),
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

export const COST_PAGE: PageEntry = {
  id: 'cost',
  title: 'The Costed Stack',
  icon: 'IconChecklist',
  num: 'C',
};

export const ALL_SLUGS: string[] = [
  ...PAGES.map((p) => p.id),
  ...ALL_BENCHMARK_PAGES.map((p) => p.id),
  ABOUT_PAGE.id,
  MCP_PAGE.id,
  COST_PAGE.id,
];

export function getBySlug(slug: string): PageEntry | undefined {
  if (slug === ABOUT_PAGE.id) return ABOUT_PAGE;
  if (slug === MCP_PAGE.id) return MCP_PAGE;
  if (slug === COST_PAGE.id) return COST_PAGE;
  const benchmark = ALL_BENCHMARK_PAGES.find((p) => p.id === slug);
  if (benchmark) return benchmark;
  return PAGES.find((p) => p.id === slug);
}

// Pager (prev/next). Benchmark pages chain through their own ordered list
// so the per-wedge pages link to each other, not back into the Framework
// pages.
function siblingList(slug: string): PageEntry[] | undefined {
  if (PAGES.some((p) => p.id === slug)) return PAGES;
  if (ALL_BENCHMARK_PAGES.some((p) => p.id === slug)) return ALL_BENCHMARK_PAGES;
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
