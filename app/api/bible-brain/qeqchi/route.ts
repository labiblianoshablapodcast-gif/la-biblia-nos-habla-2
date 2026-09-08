import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = "https://4.dbt.io/api";

function getApiKey() {
  return (
    process.env.BIBLE_BRAIN_API_KEY ||
    process.env.BIBLEBRAIN_API_KEY ||
    process.env.DBP_API_KEY ||
    process.env.FCBH_API_KEY ||
    ""
  );
}

async function bb(path: string, key: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("v", "4");
  url.searchParams.set("key", key);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text.slice(0, 2000);
  }

  return { ok: res.ok, status: res.status, data };
}

function unwrap(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    if (Array.isArray(o.data)) return o.data;
  }
  return [];
}

function allStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, out));
  else if (value && typeof value === "object") {
    Object.values(value as Record<string, unknown>).forEach((v) => allStrings(v, out));
  }
  return out;
}

function filesetIds(value: unknown): string[] {
  const ids = new Set<string>();
  const visit = (v: unknown) => {
    if (Array.isArray(v)) return v.forEach(visit);
    if (!v || typeof v !== "object") return;
    const o = v as Record<string, unknown>;
    for (const raw of [o.fileset_id, o.filesetId, o.id, o.fileset]) {
      if (typeof raw === "string" && raw.length >= 6) ids.add(raw);
    }
    Object.values(o).forEach(visit);
  };
  visit(value);
  return [...ids];
}

function audioFilesets(value: unknown): string[] {
  const ids = new Set<string>();
  const visit = (v: unknown) => {
    if (Array.isArray(v)) return v.forEach(visit);
    if (!v || typeof v !== "object") return;
    const o = v as Record<string, unknown>;
    const id = String(o.fileset_id ?? o.filesetId ?? o.id ?? o.fileset ?? "");
    const haystack = allStrings(o).join(" ").toLowerCase();
    if (id && /audio|mp3|opus|aac|streaming audio|digital audio/.test(haystack)) ids.add(id);
    Object.values(o).forEach(visit);
  };
  visit(value);
  return [...ids];
}

export async function GET() {
  const key = getApiKey();

  if (!key) {
    return NextResponse.json(
      { ok: false, error: "Bible Brain no está configurado en el servidor." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const [lower, upper, knownBible, knownFilesets] = await Promise.all([
    bb("/bibles", key, { language_code: "kek", media: "audio" }),
    bb("/bibles", key, { language_code: "KEK", media: "audio" }),
    bb("/bibles/KEKIBS", key),
    bb("/filesets", key, { bible_id: "KEKIBS" }),
  ]);

  const candidates = [
    ...unwrap(lower.data),
    ...unwrap(upper.data),
  ];

  const allCandidateFilesets = [
    ...audioFilesets(lower.data),
    ...audioFilesets(upper.data),
    ...audioFilesets(knownBible.data),
    ...audioFilesets(knownFilesets.data),
  ];

  const allKnownFilesets = [
    ...filesetIds(lower.data),
    ...filesetIds(upper.data),
    ...filesetIds(knownBible.data),
    ...filesetIds(knownFilesets.data),
  ];

  return NextResponse.json(
    {
      ok: lower.ok || upper.ok || knownBible.ok || knownFilesets.ok,
      language: "Q'eqchi'",
      iso639_3: "kek",
      expectedBibleId: "KEKIBS",
      expectedNtAudioFileset: "KEKIBSN2DA",
      candidateBibles: candidates,
      audioFilesets: [...new Set(allCandidateFilesets)],
      filesets: [...new Set(allKnownFilesets)],
      rawStatus: {
        lower: lower.status,
        upper: upper.status,
        knownBible: knownBible.status,
        knownFilesets: knownFilesets.status,
      },
      knownBible: knownBible.data,
      knownFilesets: knownFilesets.data,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
