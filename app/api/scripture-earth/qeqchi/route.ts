import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://www.scriptureearth.org/api";

const LANGUAGES = [
  { iso: "kek", label: "Q’eqchi’" },
  { iso: "spa", label: "Español" },
  { iso: "eng", label: "English" },
] as const;

async function scriptureEarthRequest(endpoint: string, key: string, iso: string) {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set("v", "1");
  url.searchParams.set("key", key);
  url.searchParams.set("iso", iso);

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error(`${endpoint} (${iso}) respondió ${response.status}`);
  return response.json();
}

async function safeRequest(endpoint: string, key: string, iso: string) {
  try {
    return { ok: true as const, data: await scriptureEarthRequest(endpoint, key, iso) };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : `No se pudo consultar ${endpoint}` };
  }
}

function hasAsv(value: unknown) {
  const text = JSON.stringify(value ?? {}).toLowerCase();
  return text.includes("american standard version") || /(^|[^a-z])asv([^a-z]|$)/i.test(text);
}

function collectMedia(value: unknown, result: { audio: string[]; video: string[]; pdf: string[] }) {
  if (typeof value === "string") {
    const text = value.trim();
    if (/\.(mp3|m4a|wav|ogg)(\?|$)/i.test(text)) result.audio.push(text);
    else if (/\.(mp4|webm|mov)(\?|$)/i.test(text)) result.video.push(text);
    else if (/\.pdf(\?|$)/i.test(text)) result.pdf.push(text);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectMedia(item, result));
    return;
  }
  if (value && typeof value === "object") {
    Object.values(value as Record<string, unknown>).forEach((item) => collectMedia(item, result));
  }
}

function unique(items: string[]) {
  return [...new Set(items)];
}

export async function GET(request: NextRequest) {
  const key = process.env.SCRIPTURE_EARTH_API_KEY;
  if (!key) return NextResponse.json({ ok: false, error: "SCRIPTURE_EARTH_API_KEY no está configurada." }, { status: 503 });

  const languages = await Promise.all(
    LANGUAGES.map(async ({ iso, label }) => {
      const [record, media, downloads, generalLinks] = await Promise.all([
        safeRequest("records.php", key, iso),
        safeRequest("media_se.php", key, iso),
        safeRequest("download_media.php", key, iso),
        safeRequest("general_links.php", key, iso),
      ]);
      const payloads = [record, media, downloads, generalLinks].filter((x) => x.ok).map((x) => x.ok ? x.data : null);
      const resources = { audio: [] as string[], video: [] as string[], pdf: [] as string[] };
      payloads.forEach((payload) => collectMedia(payload, resources));
      const cleanResources = {
        audio: unique(resources.audio),
        video: unique(resources.video),
        pdf: unique(resources.pdf),
      };
      return {
        iso,
        label,
        available: payloads.length > 0,
        counts: { audio: cleanResources.audio.length, video: cleanResources.video.length, pdf: cleanResources.pdf.length },
        resources: cleanResources,
        asvDetected: iso === "eng" ? hasAsv(payloads) : undefined,
        endpointStatus: {
          records: record.ok,
          media: media.ok,
          downloads: downloads.ok,
          generalLinks: generalLinks.ok,
        },
        raw: { record, media, downloads, generalLinks },
      };
    }),
  );

  const summary = request.nextUrl.searchParams.get("view") === "summary";
  return NextResponse.json({
    ok: languages.some((language) => language.available),
    source: "Scripture Earth",
    languages: summary ? languages.map(({ raw, ...language }) => language) : languages,
    attribution: { name: "Scripture Earth", qeqchiPage: "https://www.scriptureearth.org/00spa.php?iso=kek" },
  });
}
