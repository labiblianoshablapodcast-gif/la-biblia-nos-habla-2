import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = "https://4.dbt.io";
const BIBLE_ID = "SPAR60";

function getApiKey() {
  return (
    process.env.BIBLE_BRAIN_API_KEY ||
    process.env.BIBLEBRAIN_API_KEY ||
    process.env.DBP_API_KEY ||
    process.env.FCBH_API_KEY ||
    ""
  );
}

async function requestBibleBrain(path: string, key: string, params: Record<string, string> = {}) {
  const url = new URL(path, BASE_URL);
  url.searchParams.set("v", "4");
  url.searchParams.set("key", key);
  Object.entries(params).forEach(([name, value]) => url.searchParams.set(name, value));

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text.slice(0, 1000);
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

function collectStrings(value: unknown, out: string[]) {
  if (typeof value === "string") {
    out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, out));
    return;
  }
  if (value && typeof value === "object") {
    Object.values(value as Record<string, unknown>).forEach((item) => collectStrings(item, out));
  }
}

export async function GET() {
  const key = getApiKey();

  if (!key) {
    return NextResponse.json(
      {
        ok: false,
        error: "No encontré la variable de entorno de Bible Brain.",
        acceptedEnvNames: ["BIBLE_BRAIN_API_KEY", "BIBLEBRAIN_API_KEY", "DBP_API_KEY", "FCBH_API_KEY"],
        note: "No se muestra ni se expone ninguna clave.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const [bibleById, biblesSearch, filesets] = await Promise.all([
    requestBibleBrain(`/bibles/${BIBLE_ID}`, key),
    requestBibleBrain("/bibles", key, { bible_id: BIBLE_ID, language_code: "spa" }),
    requestBibleBrain("/filesets", key, { bible_id: BIBLE_ID }),
  ]);

  const strings: string[] = [];
  [bibleById.data, biblesSearch.data, filesets.data].forEach((value) => collectStrings(value, strings));
  const unique = [...new Set(strings)];
  const audioHints = unique.filter((value) => /audio|mp3|m4a|aac|opus|hls|m3u8/i.test(value));
  const rvrHints = unique.filter((value) => /SPAR60|reina[- ]?valera|rvr\s*1960/i.test(value));

  return NextResponse.json(
    {
      ok: bibleById.ok || biblesSearch.ok || filesets.ok,
      source: "Bible Brain / Faith Comes By Hearing",
      bibleId: BIBLE_ID,
      language: "spa",
      checks: {
        bibleById: { ok: bibleById.ok, status: bibleById.status },
        biblesSearch: { ok: biblesSearch.ok, status: biblesSearch.status },
        filesets: { ok: filesets.ok, status: filesets.status },
      },
      found: {
        rvr1960References: rvrHints.slice(0, 30),
        audioReferences: audioHints.slice(0, 30),
      },
      data: {
        bibleById: bibleById.data,
        biblesSearch: biblesSearch.data,
        filesets: filesets.data,
      },
      note: "Prueba segura para confirmar SPAR60 y localizar sus filesets de audio. La clave permanece solo en el servidor.",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
