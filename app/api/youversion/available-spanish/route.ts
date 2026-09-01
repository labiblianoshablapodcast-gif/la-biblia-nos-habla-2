import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = "https://api.youversion.com/v1";

function looksLikeRvr1960(value: unknown) {
  const text = JSON.stringify(value ?? {}).toLowerCase();
  return (
    text.includes("rvr1960") ||
    text.includes("rvr 1960") ||
    text.includes("reina-valera 1960") ||
    text.includes("reina valera 1960")
  );
}

export async function GET() {
  const key = process.env.YOUVERSION_API_KEY;

  if (!key) {
    return NextResponse.json(
      { ok: false, error: "YOUVERSION_API_KEY no está configurada." },
      { status: 500 }
    );
  }

  try {
    const url = new URL(`${BASE_URL}/bibles`);
    url.searchParams.set("language_ranges", "es");
    url.searchParams.set("page_size", "99");

    const response = await fetch(url, {
      headers: {
        "X-YVP-App-Key": key,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const text = await response.text();
    let body: unknown = text;
    try {
      body = JSON.parse(text);
    } catch {}

    if (!response.ok) {
      return NextResponse.json({
        ok: false,
        status: response.status,
        error: "YouVersion rechazó la consulta de Biblias disponibles.",
        response: body,
      });
    }

    const data =
      body && typeof body === "object" && Array.isArray((body as { data?: unknown[] }).data)
        ? (body as { data: unknown[] }).data
        : [];

    const rvr1960 = data.filter(looksLikeRvr1960);

    const compact = data.map((item) => {
      const bible = item as Record<string, unknown>;
      return {
        id: bible.id ?? null,
        abbreviation: bible.abbreviation ?? bible.localized_abbreviation ?? null,
        title: bible.title ?? bible.localized_title ?? null,
        language_tag: bible.language_tag ?? null,
      };
    });

    return NextResponse.json({
      ok: true,
      source: "YouVersion Platform API",
      language: "es",
      totalReturned: data.length,
      rvr1960Found: rvr1960.length > 0,
      rvr1960,
      bibles: compact,
      note: "Esta ruta solo comprueba las Biblias de texto disponibles para esta App Key; no afirma disponibilidad de audio.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "No se pudo consultar YouVersion.",
        detail: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
