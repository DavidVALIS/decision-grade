// Helpers for the benchmarks pages: typed accessors over the
// v1.0.0 summary JSON (and any later versions). Compact-only data;
// per_case arrays are stripped at build time in data/benchmarks/v1-0-0.json.

import data from '@/data/benchmarks/v1-0-0.json';

export type RosterScore = {
  model_id: string;
  macro_f1?: number;
  refusal_rate?: number;
  refusal_count?: number;
  scored_count?: number;
  total_count?: number;
  // mechanism_gap / falsifier / citation
  precision_unsupported?: number;
  recall_unsupported?: number;
  f1_unsupported?: number;
  precision_stated_unfalsifiable?: number;
  recall_stated_unfalsifiable?: number;
  f1_stated_unfalsifiable?: number;
  precision_unfaithful?: number;
  recall_unfaithful?: number;
  f1_unfaithful?: number;
  accuracy?: number;
  malformed_rate?: number;
  // boundary
  macro_precision?: number;
  macro_recall?: number;
  distractor_match_rate?: number;
  // LBCI
  tier_1_macro_f1?: number;
  tier_2_macro_f1?: number;
  tier_3_macro_f1?: number;
  tier_3_macro_precision?: number;
  tier_3_macro_recall?: number;
};

export type WedgeRow = {
  model_id: string;
  wedge: string;
  roster_score: RosterScore;
  outcome_counts: Record<string, number>;
};

export type BenchmarkVersionData = {
  version: string;
  created_at: string;
  wedges: Record<string, WedgeRow[]>;
};

const RAW: BenchmarkVersionData = data as unknown as BenchmarkVersionData;

export const VERSION = RAW.version;
export const CREATED_AT = RAW.created_at;
export const WEDGE_KEYS = [
  'phantom_precision',
  'mechanism_gap',
  'falsifier_observability',
  'citation_faithfulness',
  'boundary_condition_omission',
  'load_bearing_claim_identification',
] as const;
export type WedgeKey = (typeof WEDGE_KEYS)[number];

const HEADLINE_FIELD: Record<WedgeKey, { label: string; key: keyof RosterScore }> = {
  phantom_precision: { label: 'Macro F1', key: 'macro_f1' },
  mechanism_gap: { label: 'F1 (unsupported)', key: 'f1_unsupported' },
  falsifier_observability: { label: 'F1 (stated unfalsifiable)', key: 'f1_stated_unfalsifiable' },
  citation_faithfulness: { label: 'F1 (unfaithful)', key: 'f1_unfaithful' },
  boundary_condition_omission: { label: 'Macro F1', key: 'macro_f1' },
  load_bearing_claim_identification: { label: 'Macro F1', key: 'macro_f1' },
};

export function getWedge(key: WedgeKey): WedgeRow[] {
  return RAW.wedges[key] ?? [];
}

export function headlineMetric(key: WedgeKey): { label: string; key: keyof RosterScore } {
  return HEADLINE_FIELD[key];
}

export type ModelScore = {
  model_id: string;
  value: number;
  scored: number;
  total: number;
  partial_count: number;
  rate_limit_count: number;
  outcome_counts: Record<string, number>;
};

export function modelScores(key: WedgeKey): ModelScore[] {
  const { key: field } = HEADLINE_FIELD[key];
  const rows = getWedge(key);
  return rows
    .map((r) => {
      const oc = r.outcome_counts ?? {};
      const total = r.roster_score.total_count ?? Object.values(oc).reduce((a, b) => a + b, 0);
      const scored = r.roster_score.scored_count ?? oc.response ?? 0;
      return {
        model_id: r.model_id,
        value: Number((r.roster_score as Record<string, unknown>)[field as string] ?? 0),
        scored,
        total,
        partial_count: oc.partial_response ?? 0,
        rate_limit_count: oc.error_rate_limit ?? 0,
        outcome_counts: oc,
      };
    })
    .sort((a, b) => a.model_id.localeCompare(b.model_id));
}

export function leader(key: WedgeKey): ModelScore | undefined {
  const scores = modelScores(key);
  if (scores.length === 0) return undefined;
  return scores.reduce((a, b) => (a.value >= b.value ? a : b));
}

export function worst(key: WedgeKey): ModelScore | undefined {
  const scores = modelScores(key);
  if (scores.length === 0) return undefined;
  return scores.reduce((a, b) => (a.value <= b.value ? a : b));
}
