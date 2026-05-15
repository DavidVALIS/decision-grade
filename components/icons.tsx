import type { CSSProperties, SVGProps } from 'react';

// Icon family for Decision-Grade. 1.2px stroke, 24x24 viewBox, currentColor.
// The "geometric" variant is the only one kept; "illustrated" branches removed.

export type IconProps = {
  size?: number;
  className?: string;
  style?: CSSProperties;
  title?: string;
} & Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'className' | 'style' | 'title'>;

function Svg({ size = 24, className, style, children, title, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      {...rest}
    >
      {children}
    </svg>
  );
}

// ─── Personas ───
export const IconBuilding = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="3" width="14" height="18" />
    <path d="M9 7h2M9 11h2M9 15h2M13 7h2M13 11h2M13 15h2" />
    <path d="M10 21v-3h4v3" />
  </Svg>
);

export const IconServers = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="6" />
    <rect x="3" y="14" width="18" height="6" />
    <path d="M7 7h6M7 17h6" />
    <circle cx="17" cy="7" r="0.6" fill="currentColor" />
    <circle cx="17" cy="17" r="0.6" fill="currentColor" />
  </Svg>
);

export const IconCompass = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M14.5 9.5L12 12l-2.5 2.5L12 12z" fill="currentColor" />
    <path d="M14.5 9.5L12 12l2.5-2.5z" fill="currentColor" />
  </Svg>
);

// ─── Chapter icons ───
export const IconCrosshair = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
  </Svg>
);

export const IconShield = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l8 3v6c0 4.5-3.2 8.4-8 10-4.8-1.6-8-5.5-8-10V6z" />
    <path d="M8.5 12l2.5 2.5L16 9.5" />
  </Svg>
);

export const IconChecklist = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" />
    <path d="M7 8.5l1.5 1.5L11 7" />
    <path d="M7 14.5l1.5 1.5L11 13" />
    <path d="M14 8.5h6M14 14.5h6" />
  </Svg>
);

export const IconLanes = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 3v18M12 3v18M20 3v18" />
    <path d="M8 7v2M8 13v2M16 7v2M16 13v2" strokeDasharray="2 2" />
  </Svg>
);

export const IconCalendar = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" />
    <path d="M3 10h18" />
    <path d="M8 3v4M16 3v4" />
  </Svg>
);

// ─── How-to-read icons ───
export const IconBookOpen = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3z" />
    <path d="M21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z" />
  </Svg>
);

export const IconListCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7l1.5 1.5L8 6" />
    <path d="M4 13l1.5 1.5L8 11" />
    <path d="M4 19l1.5 1.5L8 17" />
    <path d="M11 7h9M11 13h9M11 19h6" />
  </Svg>
);

// ─── "Not" icons ───
export const IconToolX = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14.7 6.3a3 3 0 1 1 3 3l-7 7-3 3-3-3 3-3 7-7z" />
    <path d="M4 4l16 16" />
  </Svg>
);

export const IconBriefcase = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="7" width="18" height="13" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    <path d="M3 13h18" />
  </Svg>
);

export const IconCalendarX = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" />
    <path d="M3 10h18M8 3v4M16 3v4" />
    <path d="M9.5 13.5l5 5M14.5 13.5l-5 5" />
  </Svg>
);

// ─── Inline UI ───
export const IconInfo = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v6" />
    <circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none" />
  </Svg>
);

export const IconWarning = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l10 18H2z" />
    <path d="M12 10v5" />
    <circle cx="12" cy="18" r="0.6" fill="currentColor" stroke="none" />
  </Svg>
);

export const IconCheck = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.5 2.5L16 9.5" />
  </Svg>
);

export const IconX = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" />
  </Svg>
);

export const IconArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M14 6l6 6-6 6" />
  </Svg>
);

export const IconArrowDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M6 14l6 6 6-6" />
  </Svg>
);

export const IconSearch = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M16 16l5 5" />
  </Svg>
);

export const IconMenu = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const IconSparkle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
    <path d="M7 7l3 3M17 17l-3-3M7 17l3-3M17 7l-3 3" opacity="0.6" />
  </Svg>
);

export const IconSun = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
);

export const IconMoon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
  </Svg>
);

export const IconGitHub = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 19c-4 1-4-2-6-2" />
    <path d="M15 22v-3.5a3 3 0 0 0-.8-2.1c2.6-.3 5.3-1.3 5.3-5.6a4.4 4.4 0 0 0-1.2-3 4 4 0 0 0-.1-3s-1-.3-3.3 1.2a11 11 0 0 0-6 0C6.5 2.5 5.5 2.8 5.5 2.8a4 4 0 0 0-.1 3 4.4 4.4 0 0 0-1.2 3c0 4.3 2.7 5.3 5.3 5.6A3 3 0 0 0 8.7 16V22" />
  </Svg>
);

export const IconDots = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
  </Svg>
);

export const IconCommand = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 3a3 3 0 1 0 0 6h6a3 3 0 1 0 0-6 3 3 0 0 0-3 3v12a3 3 0 1 0 3-3H9a3 3 0 1 0 3 3" />
  </Svg>
);

export const IconLayers = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l9 4.5-9 4.5-9-4.5z" />
    <path d="M3 12l9 4.5 9-4.5" />
    <path d="M3 16.5l9 4.5 9-4.5" />
  </Svg>
);

export const IconPulse = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 12h4l2-6 4 12 2-6h6" />
  </Svg>
);

export const IconScale = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4v16M5 8h14" />
    <path d="M5 8l-3 6h6z" />
    <path d="M19 8l-3 6h6z" />
    <path d="M8 20h8" />
  </Svg>
);

export const IconDoc = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 3H6v18h12V7z" />
    <path d="M14 3v4h4" />
    <path d="M9 12h6M9 16h6M9 8h2" />
  </Svg>
);

export const IconFork = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="6" cy="5" r="2" />
    <circle cx="18" cy="5" r="2" />
    <circle cx="12" cy="19" r="2" />
    <path d="M6 7v3a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7" />
    <path d="M12 13v4" />
  </Svg>
);

// ─── VALIS Mark ───
export function ValisMark({ size = 26, color = 'var(--accent)' }: { size?: number; color?: string }) {
  const opacities = [1, 0.72, 0.48, 0.85, 0.58];
  const pos: [number, number][] = [
    [12, 4],
    [4, 12],
    [20, 12],
    [12, 20],
    [12, 12],
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {pos.map(([x, y], i) => (
        <rect
          key={i}
          x={x - 1.7}
          y={y - 1.7}
          width={3.4}
          height={3.4}
          fill={color}
          opacity={opacities[i]}
        />
      ))}
    </svg>
  );
}

// ─── String → component map ───
// Maps both the original icon names from chrome.jsx (IconLayers etc.)
// and the FontAwesome-style names used in the existing MDX (icon="building", etc.)
// to the actual React component.
type IconComponent = (p: IconProps) => JSX.Element;

const ICON_MAP: Record<string, IconComponent> = {
  // Original names
  IconBuilding,
  IconServers,
  IconCompass,
  IconCrosshair,
  IconShield,
  IconChecklist,
  IconLanes,
  IconCalendar,
  IconBookOpen,
  IconListCheck,
  IconToolX,
  IconBriefcase,
  IconCalendarX,
  IconInfo,
  IconWarning,
  IconCheck,
  IconX,
  IconArrowRight,
  IconArrowDown,
  IconSearch,
  IconMenu,
  IconSparkle,
  IconSun,
  IconMoon,
  IconGitHub,
  IconDots,
  IconCommand,
  IconLayers,
  IconPulse,
  IconScale,
  IconDoc,
  IconFork,

  // FontAwesome-style names used in the MDX
  building: IconBuilding,
  'building-shield': IconShield,
  server: IconServers,
  servers: IconServers,
  compass: IconCompass,
  shield: IconShield,
  'shield-halved': IconShield,
  checklist: IconChecklist,
  'clipboard-check': IconChecklist,
  'list-check': IconListCheck,
  book: IconBookOpen,
  briefcase: IconBriefcase,
  calendar: IconCalendar,
  'calendar-xmark': IconCalendarX,
  clock: IconCalendar,
  layers: IconLayers,
  'layer-group': IconLayers,
  crosshair: IconCrosshair,
  'circle-check': IconCheck,
  'circle-xmark': IconX,
  'circle-question': IconInfo,
  'circle-half-stroke': IconInfo,
  'triangle-exclamation': IconWarning,
  warning: IconWarning,
  info: IconInfo,
  check: IconCheck,
  x: IconX,
  ban: IconX,
  'door-closed': IconX,
  mask: IconX,
  search: IconSearch,
  'magnifying-glass': IconSearch,
  menu: IconMenu,
  sparkle: IconSparkle,
  bolt: IconSparkle,
  github: IconGitHub,
  dots: IconDots,
  command: IconCommand,
  pulse: IconPulse,
  'chart-line': IconPulse,
  gauge: IconPulse,
  'weight-scale': IconScale,
  scale: IconScale,
  'scale-balanced': IconScale,
  ruler: IconScale,
  doc: IconDoc,
  'file-contract': IconDoc,
  fork: IconFork,
  'code-fork': IconFork,
  'diagram-project': IconFork,
  'signs-post': IconLanes,
  lanes: IconLanes,
  lane: IconLanes,
  user: IconBuilding,
  handshake: IconBuilding,
  trophy: IconShield,
  gavel: IconScale,
  landmark: IconBuilding,
  comments: IconBookOpen,
  eye: IconSearch,
  fingerprint: IconShield,
  flask: IconPulse,
  robot: IconLayers,
  link: IconArrowRight,
  'arrows-rotate': IconArrowRight,
  'screwdriver-wrench': IconToolX,
};

export function getIcon(name: string | undefined): IconComponent | undefined {
  if (!name) return undefined;
  if (ICON_MAP[name]) return ICON_MAP[name];
  // Normalize: strip "fa-" prefix, lowercase
  const norm = name.replace(/^fa-/, '').toLowerCase();
  return ICON_MAP[norm];
}
