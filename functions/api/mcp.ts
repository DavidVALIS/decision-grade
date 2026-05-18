/**
 * Decision-Grade AI — MCP server (Cloudflare Pages Function)
 *
 * Implements Model Context Protocol over HTTP with JSON-RPC 2.0.
 * Exposes the framework as searchable tools so any MCP-aware AI client
 * (Claude Desktop, Cursor, etc.) can read it without the user trusting
 * a hosted chat layer.
 *
 * Endpoint: POST /api/mcp
 *
 * Tools:
 *   - list_pages: list all framework pages with id, title, description
 *   - get_page: fetch the full markdown source of a named page
 *   - search: text search across all pages, returns matching sections
 *   - get_full_framework: return the assembled llms-full.txt content
 */

interface Env {
  ASSETS: { fetch: typeof fetch };
}

type JsonRpcRequest = {
  jsonrpc: '2.0';
  id: number | string | null;
  method: string;
  params?: Record<string, unknown>;
};

type JsonRpcSuccess = {
  jsonrpc: '2.0';
  id: number | string | null;
  result: unknown;
};

type JsonRpcError = {
  jsonrpc: '2.0';
  id: number | string | null;
  error: { code: number; message: string; data?: unknown };
};

type SearchEntry = {
  slug: string;
  title: string;
  description: string;
  num: string;
  sections: Array<{ id: string; heading: string; text: string }>;
};

const PROTOCOL_VERSION = '2024-11-05';
const SERVER_NAME = 'decision-grade-ai';
const SERVER_VERSION = '1.0.0';

const TOOLS = [
  {
    name: 'list_pages',
    description:
      'List all pages of the Decision-Grade AI framework with their id, title, and short description. Use this first to discover what is available.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: 'get_page',
    description:
      'Fetch the full content of a single framework page by its slug (e.g. "the-frame", "the-doctrine", "buyers-checklist"). Returns the page markdown including all callouts, tables, and diagrams.',
    inputSchema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description:
            'The page slug. One of: introduction, the-frame, evidence, the-doctrine, buyers-checklist, lane-discipline, watchlist, about.',
        },
      },
      required: ['slug'],
      additionalProperties: false,
    },
  },
  {
    name: 'search',
    description:
      'Search across the entire framework for a query string. Returns matching sections grouped by page, with snippets. Use this to find where a concept is discussed.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The text to search for.' },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return. Default 8, max 20.',
        },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'get_full_framework',
    description:
      'Return the entire Decision-Grade AI framework as a single bundled document (the contents of llms-full.txt). Use this when you want the whole framework in one fetch.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
];

const RESOURCE_HINTS = [
  {
    uri: 'https://decision-grade.ai/llms.txt',
    name: 'llms.txt index',
    mimeType: 'text/plain',
    description: 'Compact index of all framework pages with one-line descriptions.',
  },
  {
    uri: 'https://decision-grade.ai/llms-full.txt',
    name: 'llms-full.txt bundle',
    mimeType: 'text/plain',
    description: 'Full text of the entire framework assembled into one document.',
  },
];

function ok(id: number | string | null, result: unknown): Response {
  const body: JsonRpcSuccess = { jsonrpc: '2.0', id, result };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json', ...corsHeaders() },
  });
}

function err(
  id: number | string | null,
  code: number,
  message: string,
  data?: unknown,
): Response {
  const body: JsonRpcError = { jsonrpc: '2.0', id, error: { code, message, data } };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json', ...corsHeaders() },
  });
}

function corsHeaders() {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'POST, GET, OPTIONS',
    'access-control-allow-headers': 'content-type, mcp-protocol-version',
    'access-control-max-age': '86400',
  };
}

async function readPublicJson<T>(env: Env, path: string): Promise<T | null> {
  try {
    const resp = await env.ASSETS.fetch(new Request(`https://internal/${path}`));
    if (!resp.ok) return null;
    return (await resp.json()) as T;
  } catch {
    return null;
  }
}

async function readPublicText(env: Env, path: string): Promise<string | null> {
  try {
    const resp = await env.ASSETS.fetch(new Request(`https://internal/${path}`));
    if (!resp.ok) return null;
    return await resp.text();
  } catch {
    return null;
  }
}

function textContent(text: string) {
  return [{ type: 'text', text }];
}

async function handleToolCall(
  env: Env,
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  if (name === 'list_pages') {
    const index = await readPublicJson<SearchEntry[]>(env, 'search-index.json');
    if (!index) throw new Error('Framework index not available.');
    const pages = index.map((e) => ({
      slug: e.slug,
      title: e.title,
      num: e.num,
      description: e.description,
    }));
    return { content: textContent(JSON.stringify(pages, null, 2)) };
  }

  if (name === 'get_page') {
    const slug = String(args.slug ?? '').trim();
    if (!slug) throw new Error('slug is required');
    if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('invalid slug');

    // We serve the full llms-full.txt and extract the requested page.
    const full = await readPublicText(env, 'llms-full.txt');
    if (!full) throw new Error('Framework bundle not available.');

    // Pages in llms-full.txt are separated by "---\n\n# Page Title\n" blocks.
    // Find the section for this page by title-matching using search-index for the title.
    const index = await readPublicJson<SearchEntry[]>(env, 'search-index.json');
    const entry = index?.find((e) => e.slug === slug);
    if (!entry) throw new Error(`unknown page: ${slug}`);

    // Locate the page in the bundle by its title header.
    const titleHeader = `\n# ${entry.title}\n`;
    const start = full.indexOf(titleHeader);
    if (start === -1) {
      throw new Error(`Page ${slug} not located in bundle.`);
    }
    // Find the next page header or end of file.
    const afterStart = start + titleHeader.length;
    const nextSeparator = full.indexOf('\n---\n', afterStart);
    const end = nextSeparator === -1 ? full.length : nextSeparator;
    const content = full.slice(start, end).trim();

    return { content: textContent(content) };
  }

  if (name === 'search') {
    const query = String(args.query ?? '').trim();
    const limit = Math.min(Math.max(Number(args.limit) || 8, 1), 20);
    if (!query) throw new Error('query is required');

    const index = await readPublicJson<SearchEntry[]>(env, 'search-index.json');
    if (!index) throw new Error('Framework index not available.');

    const needle = query.toLowerCase();
    const tokens = needle.split(/\s+/).filter(Boolean);
    const results: Array<{
      slug: string;
      title: string;
      section_id: string;
      heading: string;
      snippet: string;
      score: number;
    }> = [];

    for (const page of index) {
      for (const section of page.sections) {
        const haystack = `${page.title} ${section.heading} ${section.text}`.toLowerCase();
        let score = 0;
        for (const t of tokens) {
          if (haystack.includes(t)) score += 1;
        }
        if (score === 0) continue;
        // Snippet around first match
        let snippet = section.text.slice(0, 240);
        const firstMatch = haystack.indexOf(tokens[0]);
        if (firstMatch > 60 && firstMatch < section.text.length) {
          snippet = '...' + section.text.slice(Math.max(0, firstMatch - 60), firstMatch + 180);
        }
        results.push({
          slug: page.slug,
          title: page.title,
          section_id: section.id,
          heading: section.heading,
          snippet,
          score,
        });
      }
    }

    results.sort((a, b) => b.score - a.score);
    const trimmed = results.slice(0, limit).map(({ score: _score, ...rest }) => rest);
    return {
      content: textContent(
        JSON.stringify(
          {
            query,
            total: results.length,
            results: trimmed,
          },
          null,
          2,
        ),
      ),
    };
  }

  if (name === 'get_full_framework') {
    const full = await readPublicText(env, 'llms-full.txt');
    if (!full) throw new Error('Framework bundle not available.');
    return { content: textContent(full) };
  }

  throw new Error(`Unknown tool: ${name}`);
}

async function handleRpc(env: Env, req: JsonRpcRequest): Promise<Response> {
  const id = req.id ?? null;
  const params = req.params ?? {};

  switch (req.method) {
    case 'initialize':
      return ok(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {
          tools: {},
          resources: {},
        },
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION,
        },
        instructions:
          'The Decision-Grade AI framework. Use list_pages to discover content, search to find specific topics, get_page to read a full page, or get_full_framework to load everything at once.',
      });

    case 'notifications/initialized':
      return new Response(null, { status: 204, headers: corsHeaders() });

    case 'tools/list':
      return ok(id, { tools: TOOLS });

    case 'tools/call': {
      const name = String(params.name ?? '');
      const args = (params.arguments as Record<string, unknown>) ?? {};
      try {
        const result = await handleToolCall(env, name, args);
        return ok(id, result);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return ok(id, {
          content: textContent(`Error: ${msg}`),
          isError: true,
        });
      }
    }

    case 'resources/list':
      return ok(id, { resources: RESOURCE_HINTS });

    case 'resources/read': {
      const uri = String(params.uri ?? '');
      const m = uri.match(/^https:\/\/decision-grade\.ai\/(llms\.txt|llms-full\.txt)$/);
      if (!m) return err(id, -32602, `Unknown resource: ${uri}`);
      const text = await readPublicText(env, m[1]);
      if (!text) return err(id, -32603, 'Resource not available');
      return ok(id, {
        contents: [{ uri, mimeType: 'text/plain', text }],
      });
    }

    case 'ping':
      return ok(id, {});

    default:
      return err(id, -32601, `Method not found: ${req.method}`);
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: JsonRpcRequest;
  try {
    body = (await request.json()) as JsonRpcRequest;
  } catch {
    return err(null, -32700, 'Parse error');
  }
  if (!body || typeof body !== 'object' || body.jsonrpc !== '2.0' || !body.method) {
    return err(body?.id ?? null, -32600, 'Invalid Request');
  }
  return handleRpc(env, body);
};

export const onRequestGet: PagesFunction<Env> = async () => {
  // Friendly GET response so curl / browsers see a useful description.
  const info = {
    server: SERVER_NAME,
    version: SERVER_VERSION,
    protocol: PROTOCOL_VERSION,
    transport: 'http+json-rpc',
    description:
      'Decision-Grade AI MCP server. POST JSON-RPC 2.0 requests here. See https://decision-grade.ai/mcp for setup instructions.',
    methods: [
      'initialize',
      'tools/list',
      'tools/call',
      'resources/list',
      'resources/read',
      'ping',
    ],
    tools: TOOLS.map((t) => ({ name: t.name, description: t.description })),
  };
  return new Response(JSON.stringify(info, null, 2), {
    status: 200,
    headers: { 'content-type': 'application/json', ...corsHeaders() },
  });
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: corsHeaders() });
};
