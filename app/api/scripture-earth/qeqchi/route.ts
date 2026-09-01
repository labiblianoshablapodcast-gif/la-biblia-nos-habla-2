import { NextResponse } from "next/server";

const BASE_URL = "https://www.scriptureearth.org/api";
const ISO = "kek";

async function scriptureEarthRequest(endpoint: string, key: string) {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set("v", "1");
  url.searchParams.set("key", key);
  url.searchParams.set("iso", ISO);

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`${endpoint} respondió ${response.status}`);
  }

  return response.json();
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
    const [record, media, downloads] = await Promise.all([
      scriptureEarthRequest("records.php", key),
      scriptureEarthRequest("media_se.php", key),
      scriptureEarthRequest("download_media.php", key),
    ]);

    return NextResponse.json({
      ok: true,
      iso: ISO,
      source: "Scripture Earth",
      record,
      media,
      downloads,
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
