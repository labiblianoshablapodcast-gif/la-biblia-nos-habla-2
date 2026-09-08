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
    data = text.slice(0, 2500);
  }

  return { ok: res.ok, status: res.status, data };
}

function allStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, out));
  else if (value && typeof value === "object") {
    Object.values(value as Record<string, unknown>).forEach((v) => allStrings(v, out));
  }
  return out;
}

function collectBibleIds(value: unknown): string[] {
  const ids = new Set<string>();
  const visit = (v: unknown) => {
    if (Array.isArray(v)) return v.forEach(visit);
    if (!v || typeof v !== "object") return;
    const o = v as Record<string, unknown>;
    for (const raw of [o.bible_id, o.bibleId, o.id]) {
      if (typeof raw === "string" && /^[A-Z0-9]{6}$/i.test(raw)) ids.add(raw.toUpperCase());
    }
    Object.values(o).forEach(visit);
  };
  visit(value);
  return [...ids];
}

function collectFilesets(value: unknown) {
  const rows: Array<{ id: string; audio: boolean; oldOrCompleteHint: boolean; sample: string }> = [];
  const seen = new Set<string>();

  const visit = (v: unknown) => {
    if (Array.isArray(v)) return v.forEach(visit);
    if (!v || typeof v !== "object") return;
    const o = v as Record<string, unknown>;
    const id = String(o.fileset_id ?? o.filesetId ?? o.fileset ?? "");
    if (id && !seen.has(id)) {
      const text = allStrings(o).join(" ");
      const lower = text.toLowerCase();
      const audio = /audio|mp3|opus|aac|streaming audio|digital audio/.test(lower) || /DA(?:-|$)/i.test(id);
      const oldOrCompleteHint =
        /old testament|antiguo testamento|complete bible|full bible|whole bible|entire bible/.test(lower) ||
        /(?:^|[A-Z0-9])O[12]D?A/i.test(id) ||
        /(?:^|[A-Z0-9])C[12]D?A/i.test(id);
      rows.push({ id, audio, oldOrCompleteHint, sample: text.slice(0, 300) });
      seen.add(id);
    }
    Object.values(o).forEach(visit);
  };

  visit(value);
  return rows;
}

export async function GET() {
  const key = getApiKey();

  if (!key) {
    return NextResponse.json(
      { ok: false, error: "Bible Brain no está configurado en el servidor." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const seedQueries = await Promise.all([
    bb("/bibles", key, { language_code: "kek" }),
    bb("/bibles", key, { language_code: "KEK" }),
    bb("/bibles", key, { language_code: "kek", media: "audio" }),
    bb("/bibles", key, { language: "kek" }),
    bb("/bibles", key, { search: "Q'eqchi'" }),
    bb("/bibles", key, { search: "Kekchi" }),
    bb("/bibles", key, { search: "Quecchi" }),
    bb("/languages", key, { language_code: "kek" }),
  ]);

  const ids = new Set<string>(["KEKIBS"]);
  for (const result of seedQueries) {
    for (const id of collectBibleIds(result.data)) ids.add(id);
  }

  const bibleIds = [...ids].slice(0, 25);
  const bibleDetails = await Promise.all(
    bibleIds.map(async (id) => {
      const detail = await bb(`/bibles/${id}`, key);
      return { bibleId: id, status: detail.status, data: detail.data };
    })
  );

  const filesets = bibleDetails.flatMap((item) => collectFilesets(item.data));
  const audioFilesets = filesets.filter((item) => item.audio);
  const possibleOtOrCompleteAudio = audioFilesets.filter((item) => item.oldOrCompleteHint);

  return NextResponse.json(
    {
      ok: seedQueries.some((r) => r.ok) || bibleDetails.some((r) => r.status === 200),
      language: "Q'eqchi'",
      iso639_3: "kek",
      bibleIds,
      audioFilesets,
      possibleOtOrCompleteAudio,
      seedStatuses: seedQueries.map((r) => r.status),
      bibleDetails,
      conclusionHint:
        possibleOtOrCompleteAudio.length > 0
          ? "Se encontraron candidatos de audio que podrían cubrir el AT o la Biblia completa."
          : "No apareció todavía un fileset de audio claramente identificado como AT o Biblia completa en las Biblias Q'eqchi' encontradas.",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
