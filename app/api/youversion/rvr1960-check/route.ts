import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = "https://api.youversion.com/v1";
const RVR1960_ID = 149;

async function yv(path: string, key: string) {
  const response = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "X-YVP-App-Key": key,
    },
  });

  let body: unknown = null;
  try { body = await response.json(); } catch { body = null; }
  return { ok: response.ok, status: response.status, body };
}

export async function GET() {
  const key = process.env.YOUVERSION_API_KEY;
  if (!key) {
    return NextResponse.json({
      ok: false,
      error: "YOUVERSION_API_KEY no está configurada.",
    }, { status: 503 });
  }

  const [bible, books, john3] = await Promise.all([
    yv(`/bibles/${RVR1960_ID}`, key),
    yv(`/bibles/${RVR1960_ID}/books`, key),
    yv(`/bibles/${RVR1960_ID}/books/JHN/chapters/3/verses`, key),
  ]);

  const bibleData = bible.ok && bible.body && typeof bible.body === "object" ? bible.body as Record<string, unknown> : null;

  return NextResponse.json({
    ok: bible.ok,
    source: "YouVersion Platform",
    bibleId: RVR1960_ID,
    expectedVersion: "RVR1960",
    checks: {
      bible: { ok: bible.ok, status: bible.status },
      books: { ok: books.ok, status: books.status },
      john3Verses: { ok: john3.ok, status: john3.status },
    },
    bible: bibleData,
    note: "Esta prueba verifica acceso autorizado a RVR1960 con la App Key. La API pública documentada expone texto/metadatos; no asumimos que incluya audio.",
  }, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
