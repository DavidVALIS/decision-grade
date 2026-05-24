import type { ReactNode } from 'react';

export type BenchmarkAnchoringEvidenceProps = {
  /** Rekor log index */
  logIndex?: number | string;
  /** Public Rekor search URL */
  searchUrl?: string;
  /** Manifest hash (64-hex SHA256) */
  manifestSha?: string;
  /** OTS state for this manifest */
  otsState?: 'confirmed' | 'pending' | 'unknown';
  /** Cosign verify command (shown verbatim, copy-paste-ready) */
  verifyCommand?: string;
  /** Optional override for the call-to-action text */
  callout?: ReactNode;
};

/**
 * Cryptographic provenance band. Sigstore Rekor + OpenTimestamps + manifest
 * SHA, plus the cosign verify command. Mirrors the anchoring_evidence_block
 * macro in valis/benchmarks/site/templates/_components.html.
 */
export function BenchmarkAnchoringEvidence({
  logIndex,
  searchUrl,
  manifestSha,
  otsState = 'pending',
  verifyCommand = 'cosign verify-blob --bundle manifest.bundle.json manifest.yaml',
  callout,
}: BenchmarkAnchoringEvidenceProps) {
  const otsLine =
    otsState === 'confirmed'
      ? 'Bitcoin-confirmed'
      : otsState === 'pending'
      ? 'Bitcoin block pending'
      : 'State unknown';
  const otsSub =
    otsState === 'confirmed'
      ? 'Manifest hash anchored in a Bitcoin block'
      : otsState === 'pending'
      ? 'Confirmation arrives 3-6h after publish'
      : 'Re-run ots verify on the proof';

  return (
    <section
      className={`dg-bench-evidence dg-bench-evidence--${otsState}`}
      aria-label="Anchoring evidence"
    >
      <div className="dg-bench-evidence__row">
        <div className="dg-bench-evidence__cell">
          <span className="dg-bench-evidence__label">Sigstore Rekor</span>
          <span className="dg-bench-evidence__value">
            {logIndex ? (
              searchUrl ? (
                <>
                  log index <a href={searchUrl}><code>{logIndex}</code></a>
                </>
              ) : (
                <>log index <code>{logIndex}</code></>
              )
            ) : (
              'not yet anchored'
            )}
          </span>
        </div>
        <div className="dg-bench-evidence__cell">
          <span className="dg-bench-evidence__label">OpenTimestamps</span>
          <span className="dg-bench-evidence__value">{otsLine}</span>
          <span className="dg-bench-evidence__sub">{otsSub}</span>
        </div>
        <div className="dg-bench-evidence__cell">
          <span className="dg-bench-evidence__label">Manifest SHA256</span>
          <span className="dg-bench-evidence__value">
            <code>{manifestSha ?? '(not present)'}</code>
          </span>
        </div>
      </div>
      <div className="dg-bench-evidence__verify">
        <span className="dg-bench-evidence__label">Verify on a clean machine</span>
        <code>{verifyCommand}</code>
      </div>
      {callout ? <div className="dg-bench-evidence__callout">{callout}</div> : null}
    </section>
  );
}
