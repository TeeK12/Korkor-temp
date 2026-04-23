/**
 * Market News Aggregator
 *
 * Fetches RSS feeds from Nigerian business news sources, parses entries,
 * normalises them and returns a single combined list sorted by recency.
 *
 * Public endpoint (verify_jwt = false in supabase/config.toml).
 *
 * In-memory cache keeps load on upstream sources low (~5 minute TTL).
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  publishedAt: string; // ISO
  excerpt: string;
}

interface Source {
  name: string;
  url: string;
}

/**
 * Curated Nigerian + global business RSS feeds.
 * Add or swap sources here without touching the parser.
 */
const SOURCES: Source[] = [
  { name: "BusinessDay", url: "https://businessday.ng/feed/" },
  { name: "Nairametrics", url: "https://nairametrics.com/feed/" },
  { name: "Punch Business", url: "https://punchng.com/topics/business/feed/" },
  { name: "Vanguard Business", url: "https://www.vanguardngr.com/category/business/feed/" },
];

/** ~5 minute in-memory cache. */
const CACHE_TTL_MS = 5 * 60 * 1000;
let cache: { at: number; items: NewsItem[] } | null = null;

/** Strip CDATA wrappers and decode common HTML entities for plain-text use. */
const decode = (raw: string): string => {
  let s = raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  s = s.replace(/<[^>]+>/g, ""); // drop HTML tags
  s = s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
  return s.replace(/\s+/g, " ").trim();
};

/** Pull the first occurrence of a tag's inner text. */
const pickTag = (xml: string, tag: string): string => {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1] : "";
};

/** Truncate plain text to a sentence-friendly excerpt. */
const excerpt = (text: string, max = 220): string => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trim() + "…";
};

/** Stable id from link or title — keeps front-end keys deterministic. */
const hashId = async (input: string): Promise<string> => {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(buf))
    .slice(0, 10)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const parseFeed = async (
  source: Source,
  xml: string,
): Promise<NewsItem[]> => {
  const items: NewsItem[] = [];
  // Match RSS <item> or Atom <entry>
  const entryRegex = /<(item|entry)[\s>][\s\S]*?<\/\1>/gi;
  const matches = xml.match(entryRegex) ?? [];

  for (const block of matches.slice(0, 25)) {
    const titleRaw = pickTag(block, "title");
    if (!titleRaw) continue;
    const linkRaw =
      pickTag(block, "link") ||
      (block.match(/<link[^>]*href=["']([^"']+)["']/i)?.[1] ?? "");
    const dateRaw =
      pickTag(block, "pubDate") ||
      pickTag(block, "published") ||
      pickTag(block, "updated") ||
      pickTag(block, "dc:date");
    const descRaw =
      pickTag(block, "description") ||
      pickTag(block, "summary") ||
      pickTag(block, "content:encoded") ||
      pickTag(block, "content");

    const title = decode(titleRaw);
    const link = decode(linkRaw);
    if (!title || !link) continue;

    let publishedAt = new Date().toISOString();
    if (dateRaw) {
      const d = new Date(decode(dateRaw));
      if (!Number.isNaN(d.getTime())) publishedAt = d.toISOString();
    }

    items.push({
      id: await hashId(link || title),
      title,
      link,
      source: source.name,
      publishedAt,
      excerpt: excerpt(decode(descRaw)),
    });
  }
  return items;
};

const fetchSource = async (source: Source): Promise<NewsItem[]> => {
  // Hard timeout per source so a slow feed can't hang the whole response.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(source.url, {
      headers: {
        // Some feeds gate on a proper UA.
        "User-Agent": "Mozilla/5.0 (compatible; BulkbookFeed/1.0)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      signal: controller.signal,
    });
    if (!res.ok) {
      console.warn(`[market-news] ${source.name} → HTTP ${res.status}`);
      return [];
    }
    const xml = await res.text();
    return await parseFeed(source, xml);
  } catch (err) {
    console.warn(`[market-news] ${source.name} fetch failed:`, err);
    return [];
  } finally {
    clearTimeout(timer);
  }
};

const buildFeed = async (): Promise<NewsItem[]> => {
  const results = await Promise.all(SOURCES.map(fetchSource));
  const merged = results.flat();
  // Sort newest-first
  merged.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  return merged.slice(0, 60);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const force = url.searchParams.get("refresh") === "1";

    const now = Date.now();
    if (!force && cache && now - cache.at < CACHE_TTL_MS) {
      return new Response(
        JSON.stringify({ items: cache.items, cached: true }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const items = await buildFeed();
    cache = { at: now, items };
    return new Response(JSON.stringify({ items, cached: false }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[market-news] unhandled error:", err);
    const message = err instanceof Error ? err.message : "unknown error";
    // Serve stale cache on hard failure when possible.
    if (cache) {
      return new Response(
        JSON.stringify({ items: cache.items, cached: true, stale: true, error: message }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    return new Response(JSON.stringify({ items: [], error: message }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});