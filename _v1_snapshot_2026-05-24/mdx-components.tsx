import type { ComponentProps, ReactNode } from 'react';
import { isValidElement, Children } from 'react';
import { Note } from '@/components/mdx/Note';
import { Warning } from '@/components/mdx/Warning';
import { Tip } from '@/components/mdx/Tip';
import { Info } from '@/components/mdx/Info';
import { Card } from '@/components/mdx/Card';
import { CardGroup } from '@/components/mdx/CardGroup';
import { Accordion } from '@/components/mdx/Accordion';
import { AccordionGroup } from '@/components/mdx/AccordionGroup';
import { Steps } from '@/components/mdx/Steps';
import { Step } from '@/components/mdx/Step';
import { Mermaid } from '@/components/mdx/Mermaid';
import { Stat, StatRow } from '@/components/mdx/Stat';
import { Quote } from '@/components/mdx/Quote';
import { BenchmarkExampleTable } from '@/components/mdx/BenchmarkExampleTable';
import { BenchmarkFindingCard } from '@/components/mdx/BenchmarkFindingCard';
import {
  BenchmarkComparisonChart,
  BenchmarkTierComparison,
} from '@/components/mdx/BenchmarkComparisonChart';
import { BenchmarkAnchoringEvidence } from '@/components/mdx/BenchmarkAnchoringEvidence';
import { BenchmarkMethodologyDisclosure } from '@/components/mdx/BenchmarkMethodologyDisclosure';
import { BenchmarkTestSection } from '@/components/mdx/BenchmarkTestSection';
import { BenchmarkResultsGrid } from '@/components/mdx/BenchmarkResultsGrid';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function nodeToText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join('');
  if (isValidElement(node)) {
    return nodeToText((node.props as { children?: ReactNode }).children);
  }
  return '';
}

// Detect mermaid code fences. In MDX, ```mermaid renders as
// <pre><code className="language-mermaid">...</code></pre>.
function CodeBlock(props: ComponentProps<'pre'>) {
  const { children, ...rest } = props;
  const child = Children.only(children);
  if (isValidElement(child)) {
    const codeProps = child.props as { className?: string; children?: ReactNode };
    const className = codeProps.className ?? '';
    if (className.includes('language-mermaid')) {
      const text = nodeToText(codeProps.children);
      return <Mermaid chart={text} />;
    }
  }
  return <pre {...rest}>{children}</pre>;
}

function headingFactory(level: 2 | 3 | 4) {
  const Tag = `h${level}` as 'h2' | 'h3' | 'h4';
  const className = level === 2 ? 'dg-h2' : level === 3 ? 'dg-h3' : undefined;
  return function Heading(props: ComponentProps<'h2'>) {
    const { children, id, ...rest } = props;
    const computedId = id ?? slugify(nodeToText(children));
    return (
      <Tag id={computedId} className={className} {...rest}>
        {children}
      </Tag>
    );
  };
}

export function useMDXComponents(components: Record<string, unknown> = {}) {
  return {
    // Headings
    h1: headingFactory(2),
    h2: headingFactory(2),
    h3: headingFactory(3),
    h4: headingFactory(4),
    // Code
    pre: CodeBlock,
    // Mintlify-style components
    Note,
    Warning,
    Tip,
    Info,
    Card,
    CardGroup,
    Accordion,
    AccordionGroup,
    Steps,
    Step,
    Mermaid,
    Stat,
    StatRow,
    Quote,
    // Benchmarks
    BenchmarkExampleTable,
    BenchmarkFindingCard,
    BenchmarkComparisonChart,
    BenchmarkTierComparison,
    BenchmarkAnchoringEvidence,
    BenchmarkMethodologyDisclosure,
    BenchmarkTestSection,
    BenchmarkResultsGrid,
    Frame: ({ children }: { children: ReactNode }) => (
      <div className="dg-card" style={{ padding: 20, margin: '24px 0' }}>
        {children}
      </div>
    ),
    ...components,
  };
}
