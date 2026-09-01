import { NextResponse } from "next/server";

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

  if (!response.ok) {
    throw new Error(`${endpoint} (${iso}) respondió ${response.status}`);
  }

  return response.json();
}

function hasAsv(value: unknown) {
  const text = JSON.stringify(value ?? {}).toLowerCase();
  return text.includes("american standard version") || /(^|[^a-z])asv([^a-z]|$)/i.test(text);
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
      LANGUAGES.map(async ({ iso, label }) => {
        const [record, media, downloads, generalLinks] = await Promise.all([
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
          generalLinks,
          asvDetected: iso === "eng" ? hasAsv({ record, media, downloads, generalLinks }) : false,
        };
      }),
    );

    return NextResponse.json({
      ok: true,
      source: "Scripture Earth",
      languages,
      attribution: {
        name: "Scripture Earth",
        qeqchiPage: "https://www.scriptureearth.org/00spa.php?iso=kek",
      },
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
