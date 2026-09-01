import { NextResponse } from "next/server";

const BASE_URL = "https://www.scriptureearth.org/api";
const LANGUAGES = [
  { iso: "kek", label: "Q’eqchi’" },
  { iso: "spa", label: "Español" },
  { iso: "eng", label: "English / ASV check" },
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

  if (!response.ok) {
    throw new Error(`${endpoint} (${iso}) respondió ${response.status}`);
  }

  return response.json();
}

function containsAsv(value: unknown): boolean {
  if (typeof value === "string") {
    return /\bASV\b|American Standard Version/i.test(value);
  }
  if (Array.isArray(value)) return value.some(containsAsv);
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).some(
      ([key, item]) => containsAsv(key) || containsAsv(item),
    );
  }
  return false;
}

async function loadLanguage(key: string, iso: string, label: string) {
  const [record, media, downloads, links] = await Promise.all([
    scriptureEarthRequest("records.php", key, iso),
    scriptureEarthRequest("media_se.php", key, iso),
    scriptureEarthRequest("download_media.php", key, iso),
    scriptureEarthRequest("general_links.php", key, iso),
  ]);

  return {
    iso,
    label,
    record,
    media,
    downloads,
    links,
    asvFound:
      iso === "eng"
        ? [record, media, downloads, links].some(containsAsv)
        : undefined,
  };
}

export async function GET() {
  const key = process.env.SCRIPTURE_EARTH_API_KEY;

  if (!key) {
    return NextResponse.json(
      { ok: false, error: "SCRIPTURE_EARTH_API_KEY no está configurada." },
      { status: 503 },
    );
  }

  try {
    const languages = await Promise.all(
      LANGUAGES.map(({ iso, label }) => loadLanguage(key, iso, label)),
    );

    return NextResponse.json({
      ok: true,
      source: "Scripture Earth",
      languages,
      note: "ASV se marca solamente si Scripture Earth la identifica explícitamente como ASV o American Standard Version.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "No se pudo consultar Scripture Earth.",
      },
      { status: 502 },
    );
  }
}
