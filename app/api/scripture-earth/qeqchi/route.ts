import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://www.scriptureearth.org/api";
const TARGETS = [
  { query: { idx: "264" }, iso: "kek", label: "Q’eqchi’ tradicional", idx: 264 },
  { query: { iso: "kek" }, iso: "kek", label: "Q’eqchi’ por ISO", idx: null },
  { query: { idx: "240" }, iso: "spa", label: "Español (índice 240)", idx: 240 },
  { query: { iso: "spa" }, iso: "spa", label: "Español por ISO", idx: null },
] as const;
const ENDPOINTS = ["records.php", "media_se.php", "download_media.php", "general_links.php", "other_se.php", "website_links.php"] as const;

async function requestSE(endpoint: string, key: string, query: Record<string, string>) {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set("v", "1");
  url.searchParams.set("key", key);
  Object.entries(query).forEach(([name, value]) => url.searchParams.set(name, value));
  const response = await fetch(url.toString(), { cache: "no-store", headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`${endpoint} respondió ${response.status}`);
  return response.json();
}

async function safeRequest(endpoint: string, key: string, query: Record<string, string>) {
  try { return { ok: true as const, data: await requestSE(endpoint, key, query) }; }
  catch (error) { return { ok: false as const, error: error instanceof Error ? error.message : `No se pudo consultar ${endpoint}` }; }
}

function collect(value: unknown, out: { audio: string[]; video: string[]; pdf: string[]; bibleIs: string[]; grn: string[]; rvr1960: string[] }) {
  if (typeof value === "string") {
    const s = value.trim();
    if (/\.(mp3|m4a|wav|ogg)(\?|$)/i.test(s)) out.audio.push(s);
    if (/\.(mp4|webm|mov)(\?|$)/i.test(s)) out.video.push(s);
    if (/\.pdf(\?|$)/i.test(s)) out.pdf.push(s);
    if (/bible\.is/i.test(s)) out.bibleIs.push(s);
    if (/globalrecordings|global-recordings|\bgrn\b/i.test(s)) out.grn.push(s);
    if (/rvr\s*1960|reina[- ]?valera\s*1960/i.test(s)) out.rvr1960.push(s);
    return;
  }
  if (Array.isArray(value)) return value.forEach((item) => collect(item, out));
  if (value && typeof value === "object") Object.values(value as Record<string, unknown>).forEach((item) => collect(item, out));
}
const unique = (items: string[]) => [...new Set(items)];

export async function GET(request: NextRequest) {
  const key = process.env.SCRIPTURE_EARTH_API_KEY;
  if (!key) return NextResponse.json({ ok: false, error: "SCRIPTURE_EARTH_API_KEY no está configurada." }, { status: 503 });

  const targets = await Promise.all(TARGETS.map(async (target) => {
    const responses = await Promise.all(ENDPOINTS.map(async (endpoint) => [endpoint, await safeRequest(endpoint, key, target.query)] as const));
    const endpointStatus = Object.fromEntries(responses.map(([endpoint, result]) => [endpoint, result.ok]));
    const payloads = responses.filter(([, result]) => result.ok).map(([, result]) => result.ok ? result.data : null);
    const found = { audio: [] as string[], video: [] as string[], pdf: [] as string[], bibleIs: [] as string[], grn: [] as string[], rvr1960: [] as string[] };
    payloads.forEach((payload) => collect(payload, found));
    const resources = { audio: unique(found.audio), video: unique(found.video), pdf: unique(found.pdf), bibleIs: unique(found.bibleIs), grn: unique(found.grn), rvr1960: unique(found.rvr1960) };
    return {
      iso: target.iso, idx: target.idx, label: target.label,
      counts: Object.fromEntries(Object.entries(resources).map(([name, values]) => [name, values.length])),
      resources, endpointStatus,
      raw: Object.fromEntries(responses),
    };
  }));

  const summary = request.nextUrl.searchParams.get("view") === "summary";
  return NextResponse.json({
    ok: true,
    source: "Scripture Earth",
    targets: summary ? targets.map(({ raw, ...target }) => target) : targets,
    note: "Prueba Q’eqchi’ (idx 264) y español (idx 240), incluyendo detección de audio y referencias RVR1960.",
    attribution: {
      name: "Scripture Earth",
      qeqchiPage: "https://www.scriptureearth.org/00spa.php?idx=264&iso=kek",
      spanishPage: "https://www.scriptureearth.org/00spa.php?idx=240&iso=spa"
    },
  });
}
