# Decision-Grade.ai · v1 Snapshot · 2026-05-24

Frozen copy of the site as of 2026-05-24, taken immediately before the
layman-first audit's v2 changes were applied.

## What this is

A point-in-time snapshot of every page (`.mdx`), every component the pages
depend on (`components/`), the page registry (`lib/`), the global stylesheet
(`style.css` + `styles/`), and the Mintlify-style config (`docs.json`).

Use it to diff v2 against v1 in your editor, to inspect a single line that
got changed, or to roll back any individual edit if a v2 change does not
land the way you wanted it to.

## What it is not

Not a build artifact. Not a separately renderable site. The directory name
is prefixed with `_` so the Next.js / MDX build will not treat it as routable
pages (Next conventionally treats `_`-prefixed directories as private).

## Diff conventions

To compare a single page against v2:

```bash
diff -u _v1_snapshot_2026-05-24/introduction.mdx ./introduction.mdx
```

To compare the whole site at once:

```bash
diff -ruN _v1_snapshot_2026-05-24/ ./ \
  | grep -v "^Only in ./_v1_snapshot_2026-05-24/" \
  | head -200
```

To restore a single file from v1:

```bash
cp _v1_snapshot_2026-05-24/<file> ./<file>
```

## Companion audit document

The audit that drove the v2 changes lives at
`../Documentation/Core/website/DecisionGrade_Layman_Audit_2026-05-24.md`
in the parent VALIS workspace. It documents the rationale for every change
and the alternatives that were rejected.

## What is intentionally not snapshotted

Files matching `.gitignore` patterns (notably `signals.mdx`, `self-audit.mdx`,
and `components/mdx/Briefing.tsx` / `SignalsFeed.tsx`) are still present in
the working tree but flagged as "feature on hold" by the gitignore. They are
snapshotted alongside the published files so this snapshot reflects the
working tree, not the deployed site. The v2 changes do not touch them.
