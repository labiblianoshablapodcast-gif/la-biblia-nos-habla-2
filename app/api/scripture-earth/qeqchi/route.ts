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

async function safeScriptureEarthRequest(endpoint: string, key: string, iso: string) {
  try {
    const data = await scriptureEarthRequest(endpoint, key, iso);
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : `No se pudo consultar ${endpoint}`,
    };
  }
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

  const languages = await Promise.all(
    LANGUAGES.map(async ({ iso, label }) => {
      const [record, media, downloads, generalLinks] = await Promise.all([
        safeScriptureEarthRequest("records.php", key, iso),
        safeScriptureEarthRequest("media_se.php", key, iso),
        safeScriptureEarthRequest("download_media.php", key, iso),
        safeScriptureEarthRequest("general_links.php", key, iso),
      ]);

      const successfulPayloads = [record, media, downloads, generalLinks]
        .filter((item) => item.ok && "data" in item)
        .map((item) => ("data" in item ? item.data : null));

      return {
        iso,
        label,
        record,
        media,
        downloads,
        generalLinks,
        asvDetected: iso === "eng" ? hasAsv(successfulPayloads) : false,
      };
    }),
  );

  const hasAnySuccess = languages.some((language) =>
    [language.record, language.media, language.downloads, language.generalLinks].some(
      (endpoint) => endpoint.ok,
    ),
  );

  return NextResponse.json({
    ok: hasAnySuccess,
    partial: languages.some((language) =>
      [language.record, language.media, language.downloads, language.generalLinks].some(
        (endpoint) => !endpoint.ok,
      ),
    ),
    source: "Scripture Earth",
    languages,
    attribution: {
      name: "Scripture Earth",
      qeqchiPage: "https://www.scriptureearth.org/00spa.php?iso=kek",
    },
  });
}
