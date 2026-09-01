import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = "https://api.youversion.com/v1";
const RVR1960_ID = 149;

function containsRvr1960(value: unknown) {
  const text = JSON.stringify(value ?? {}).toLowerCase();
  return text.includes("rvr1960") || text.includes("rvr 1960") || text.includes("reina-valera 1960") || text.includes("reina valera 1960");
}

export async function GET() {
  const key = process.env.YOUVERSION_API_KEY;
  const developerId = process.env.YOUVERSION_DEVELOPER_ID;

  if (!key) {
    return NextResponse.json({ ok: false, error: "YOUVERSION_API_KEY no está configurada." }, { status: 500 });
  }

  // The documented all_available license view requires developer_id.
  if (!developerId) {
    return NextResponse.json({
      ok: false,
      needsDeveloperId: true,
      error: "Falta YOUVERSION_DEVELOPER_ID en Vercel.",
      nextStep: "Añade en Vercel el Developer ID (UUID) de tu cuenta de YouVersion Platform con el nombre YOUVERSION_DEVELOPER_ID. No es una clave secreta. Después vuelve a abrir esta ruta.",
      note: "No se muestra ni se expone la App Key.",
    }, { status: 503 });
  }

  try {
    const url = new URL(`${BASE_URL}/licenses`);
    url.searchParams.set("developer_id", developerId);
    url.searchParams.set("all_available", "true");

    const response = await fetch(url, {
      headers: { "X-YVP-App-Key": key, Accept: "application/json" },
      cache: "no-store",
    });

    const text = await response.text();
    let body: unknown = text;
    try { body = JSON.parse(text); } catch {}

    if (!response.ok) {
      return NextResponse.json({ ok: false, status: response.status, error: "YouVersion rechazó la consulta de todas las licencias disponibles.", response: body });
    }

    const data = body && typeof body === "object" && Array.isArray((body as { data?: unknown[] }).data)
      ? (body as { data: Record<string, unknown>[] }).data
      : [];

    const matches = data.filter((license) => {
      const ids = Array.isArray(license.bible_ids) ? license.bible_ids : [];
      return ids.some((id) => Number(id) === RVR1960_ID) || containsRvr1960(license);
    });

    const compact = (license: Record<string, unknown>) => ({
      id: license.id ?? null,
      name: license.name ?? null,
      version: license.version ?? null,
      organization_id: license.organization_id ?? null,
      bible_ids: license.bible_ids ?? [],
      uri: license.uri ?? null,
      agreed_dt: license.agreed_dt ?? null,
      agreed: Boolean(license.agreed_dt),
    });

    return NextResponse.json({
      ok: true,
      source: "YouVersion Platform API",
      allAvailable: true,
      totalLicenses: data.length,
      rvr1960Found: matches.length > 0,
      rvr1960Licenses: matches.map(compact),
      nextStep: matches.length === 0
        ? "RVR1960 no apareció entre las licencias disponibles para este desarrollador."
        : matches.some((item) => Boolean(item.agreed_dt))
          ? "RVR1960 aparece y su licencia figura aceptada."
          : "RVR1960 aparece entre las licencias disponibles, pero no figura aceptada; revísala en YouVersion Platform Portal.",
      note: "La respuesta está reducida a la información necesaria y no expone la App Key ni el Developer ID.",
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "No se pudo consultar YouVersion.", detail: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 });
  }
}
