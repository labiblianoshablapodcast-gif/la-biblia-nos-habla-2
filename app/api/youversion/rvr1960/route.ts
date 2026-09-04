import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE = "https://api.youversion.com/v1";

async function probe(path: string, key: string) {
  const response = await fetch(`${BASE}${path}`, {
    cache: "no-store",
    headers: { Accept: "application/json", "X-YVP-App-Key": key },
  });
  const text = await response.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text.slice(0, 1200); }
  return { ok: response.ok, status: response.status, data };
}

function rows(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value.filter(v => v && typeof v === "object") as Record<string, unknown>[];
  if (value && typeof value === "object") {
    const d = (value as Record<string, unknown>).data;
    if (Array.isArray(d)) return d.filter(v => v && typeof v === "object") as Record<string, unknown>[];
  }
  return [];
}

function isRvr1960(item: Record<string, unknown>) {
  const s = JSON.stringify(item).toLowerCase();
  return /rvr\s*1960|rv1960|reina[^"]*valera[^"]*1960/.test(s);
}

export async function GET() {
  const key = process.env.YOUVERSION_API_KEY || "";
  if (!key) return NextResponse.json({ ok:false, error:"YOUVERSION_API_KEY no está configurada." }, {status:503});

  const [licensed, catalog] = await Promise.all([
    probe("/bibles?language_ranges[]=es&page_size=99", key),
    probe("/bibles?all_available=true&language_ranges[]=es&page_size=99", key),
  ]);

  const licensedRows = rows(licensed.data);
  const catalogRows = rows(catalog.data);
  const licensedMatches = licensedRows.filter(isRvr1960);
  const catalogMatches = catalogRows.filter(isRvr1960);

  return NextResponse.json({
    ok: licensed.ok || catalog.ok,
    authenticated: licensed.status !== 401 && catalog.status !== 401,
    licensedStatus: licensed.status,
    catalogStatus: catalog.status,
    rvr1960Licensed: licensedMatches,
    rvr1960Catalog: catalogMatches,
    licensedSpanishCount: licensedRows.length,
    catalogSpanishCount: catalogRows.length,
    note: "Busca RVR1960 por nombre/abreviatura en el catálogo real de YouVersion Platform; no usa el ID público de Bible.com."
  }, { headers: { "Cache-Control":"no-store" } });
}
