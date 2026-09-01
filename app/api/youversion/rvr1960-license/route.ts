import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = "https://api.youversion.com/v1";
const RVR1960_ID = 149;

export async function GET() {
  const key = process.env.YOUVERSION_API_KEY;
  if (!key) {
    return NextResponse.json({ ok: false, error: "YOUVERSION_API_KEY no está configurada." }, { status: 500 });
  }

  try {
    const url = new URL(`${BASE_URL}/licenses`);
    url.searchParams.set("bible_id", String(RVR1960_ID));

    const response = await fetch(url, {
      headers: {
        "X-YVP-App-Key": key,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const text = await response.text();
    let body: unknown = text;
    try { body = JSON.parse(text); } catch {}

    if (!response.ok) {
      return NextResponse.json({
        ok: false,
        status: response.status,
        bibleId: RVR1960_ID,
        expectedVersion: "RVR1960",
        error: "YouVersion rechazó la consulta de licencia para Bible ID 149.",
        response: body,
      });
    }

    const data = body && typeof body === "object" && Array.isArray((body as { data?: unknown[] }).data)
      ? (body as { data: Record<string, unknown>[] }).data
      : [];

    const licenses = data.map((license) => ({
      id: license.id ?? null,
      name: license.name ?? null,
      version: license.version ?? null,
      organization_id: license.organization_id ?? null,
      bible_ids: license.bible_ids ?? [],
      uri: license.uri ?? null,
      agreed_dt: license.agreed_dt ?? null,
      agreed: Boolean(license.agreed_dt),
    }));

    return NextResponse.json({
      ok: true,
      source: "YouVersion Platform API",
      bibleId: RVR1960_ID,
      expectedVersion: "RVR1960",
      licenseFound: licenses.length > 0,
      licenses,
      nextStep: licenses.length === 0
        ? "No se encontró una licencia para Bible ID 149 mediante esta App Key."
        : licenses.some((item) => item.agreed)
          ? "La licencia aparece como aceptada; habría que revisar por qué la Biblia no está en /v1/bibles."
          : "La licencia existe pero no aparece aceptada para esta consulta. Revísala en el portal de YouVersion antes de usar RVR1960.",
      note: "No se muestra ni se expone la App Key. Esta prueba consulta únicamente metadatos de licencia.",
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: "No se pudo consultar la licencia de YouVersion.",
      detail: error instanceof Error ? error.message : "Error desconocido",
    }, { status: 500 });
  }
}
