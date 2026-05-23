import { BenchmarkComparisonChart } from './BenchmarkComparisonChart';
import type { WedgeKey } from '@/lib/benchmarks';

type TestSpec = {
  wedge: WedgeKey;
  question: string;
  description: string;
  href: string;
};

const TESTS: TestSpec[] = [
  {
    wedge: 'phantom_precision',
    question: 'Can it spot a fake number?',
    description:
      'We hide one fabricated number inside otherwise sound business prose. The model has to find the lie.',
    href: '/benchmarks-v1-0-0-phantom-precision/',
  },
  {
    wedge: 'mechanism_gap',
    question: 'Does "because" actually mean because?',
    description:
      'Sentences shaped like "X because Y." The model has to tell whether Y is actually evidence for X, or just dressed up as evidence.',
    href: '/benchmarks-v1-0-0-mechanism-gap/',
  },
  {
    wedge: 'falsifier_observability',
    question: 'Could this claim ever be proven wrong?',
    description:
      'A claim like "Brazil will be more resilient in 2027." The model has to tell whether that claim could ever be tested against reality, or whether it is just a feeling dressed up as a prediction.',
    href: '/benchmarks-v1-0-0-falsifier-observability/',
  },
  {
    wedge: 'citation_faithfulness',
    question: 'When it cites a source, does the source say that?',
    description:
      'A claim paired with a real source. The model has to tell whether the source actually says what the claim says it says.',
    href: '/benchmarks-v1-0-0-citation-faithfulness/',
  },
  {
    wedge: 'boundary_condition_omission',
    question: 'Can it notice what is missing?',
    description:
      'An analysis that looks complete but quietly leaves out a condition a careful reader would catch. The model has to surface the omission.',
    href: '/benchmarks-v1-0-0-boundary-condition-omission/',
  },
  {
    wedge: 'load_bearing_claim_identification',
    question: 'Which claim, if wrong, breaks the whole thing?',
    description:
      'A long recommendation built on a few load-bearing claims and many decorative ones. The model has to point at the few that, if false, would collapse the recommendation.',
    href: '/benchmarks-v1-0-0-load-bearing-claim-identification/',
  },
];

/**
 * The six v1.0.0 tests, stacked vertically. Each cell shows a layman
 * question, a description of what the test asks the model to do, and the
 * bar chart with the 95 percent reference line. The whole cell is a link
 * to the per-wedge deep read.
 */
export function BenchmarkResultsGrid() {
  return (
    <div className="dg-bench-grid">
      {TESTS.map((t) => (
        <a key={t.wedge} className="dg-bench-grid__cell" href={t.href}>
          <p className="dg-bench-grid__question">{t.question}</p>
          <p className="dg-bench-grid__description">{t.description}</p>
          <BenchmarkComparisonChart wedge={t.wedge} />
        </a>
      ))}
    </div>
  );
}
