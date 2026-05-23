import fs from 'node:fs';
import path from 'node:path';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Layout } from '@/components/Layout';
import { ALL_SLUGS, getBySlug } from '@/lib/pages';
import { loadMdx, type Frontmatter, type TocItem } from '@/lib/mdx';
import { useMDXComponents } from '@/mdx-components';

type PageProps = {
  slug: string;
  mdxSource: MDXRemoteSerializeResult;
  frontmatter: Frontmatter;
  toc: TocItem[];
};

function mdxExists(slug: string): boolean {
  return fs.existsSync(path.join(process.cwd(), `${slug}.mdx`));
}

export const getStaticPaths: GetStaticPaths = async () => {
  // A slug registered in lib/pages.ts may not yet have a committed MDX file
  // (work-in-progress pages live in the working tree but stay un-staged).
  // Skip those rather than failing the prerender on CI's clean checkout.
  return {
    paths: ALL_SLUGS.filter(mdxExists).map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async (ctx) => {
  const slug = ctx.params?.slug as string;
  if (!slug || !ALL_SLUGS.includes(slug) || !mdxExists(slug)) {
    return { notFound: true };
  }
  const { mdxSource, frontmatter, toc } = await loadMdx(slug);
  // Strip undefined values to keep getStaticProps output JSON-serializable.
  const cleanFrontmatter: Frontmatter = {};
  if (frontmatter.title) cleanFrontmatter.title = frontmatter.title;
  if (frontmatter.description) cleanFrontmatter.description = frontmatter.description;
  return {
    props: { slug, mdxSource, frontmatter: cleanFrontmatter, toc },
  };
};

export default function DocsPage({ slug, mdxSource, frontmatter, toc }: PageProps) {
  const components = useMDXComponents();
  const page = getBySlug(slug);
  const title = frontmatter.title ?? page?.title ?? slug;
  const description = frontmatter.description;
  const pageTitle = `${title} · Decision-Grade AI`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {description ? <meta name="description" content={description} /> : null}
        <meta property="og:title" content={pageTitle} />
        {description ? <meta property="og:description" content={description} /> : null}
        <meta property="og:type" content="article" />
      </Head>
      <Layout slug={slug} title={title} description={description} toc={toc}>
        <MDXRemote {...mdxSource} components={components} />
      </Layout>
    </>
  );
}
