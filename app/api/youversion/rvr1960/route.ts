import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE = "https://api.youversion.com/v1";

async function probe(path: string, key: string) {
  const response = await fetch(`${BASE}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "X-YV-API-Key": key,
    },
  });
  const text = await response.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text.slice(0, 1000); }
  return { ok: response.ok, status: response.status, data };
}

function containsAudio(value: unknown): boolean {
  if (typeof value === "string") return /audio|mp3|m4a|aac|stream/i.test(value);
  if (Array.isArray(value)) return value.some(containsAudio);
  if (value && typeof value === "object") return Object.entries(value as Record<string, unknown>)
    .some(([k,v]) => /audio|mp3|m4a|aac|stream/i.test(k) || containsAudio(v));
  return false;
}

export async function GET() {
  const key = process.env.YOUVERSION_API_KEY || "";
  if (!key) return NextResponse.json({ ok:false, error:"YOUVERSION_API_KEY no está configurada." }, {status:503});

  // RVR1960 is version 149 on Bible.com. Probe only documented-style read endpoints;
  // never return the API key or forward it to the browser.
  const candidates = [
    "/bibles/149",
    "/bibles/149/books",
    "/bibles/149/passages/JHN.3",
  ];

  const results = [];
  for (const path of candidates) {
    const r = await probe(path, key);
    results.push({ path, ok:r.ok, status:r.status, hasAudioFields:containsAudio(r.data), data:r.data });
  }

  return NextResponse.json({
    ok: results.some(r=>r.ok),
    version: "RVR1960",
    versionId: 149,
    audioFieldsDetected: results.some(r=>r.hasAudioFields),
    results,
    note: "Prueba segura de la clave YouVersion. La clave nunca se devuelve al navegador."
  }, { headers: { "Cache-Control":"no-store" } });
}
