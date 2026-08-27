import { NextResponse } from "next/server";
import {checkNkjvAccess} from "@/lib/nkjv-access";

const API_BIBLE_BASE = "https://rest.api.bible/v1";

type AudioBible = {
  id?: string;
  abbreviation?: string;
  abbreviationLocal?: string;
  name?: string;
  nameLocal?: string;
  description?: string;
  descriptionLocal?: string;
  language?: {
    id?: string;
    name?: string;
    nameLocal?: string;
  };
};

async function fetchAudioBibles(language: "spa" | "kek", apiKey: string) {
  const response = await fetch(
    `${API_BIBLE_BASE}/audio-bibles?language=${language}&include-full-details=true`,
    {
      headers: {
        "api-key": apiKey,
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    return {
      ok: false as const,
      status: response.status,
      bibles: [] as AudioBible[],
    };
  }

  const payload = await response.json();
  return {
    ok: true as const,
    status: response.status,
    bibles: Array.isArray(payload?.data) ? payload.data : [],
  };
}

function publicAudioDetails(bible: AudioBible) {
  return {
    id: bible.id,
    abbreviation: bible.abbreviationLocal ?? bible.abbreviation,
    name: bible.nameLocal ?? bible.name,
    description: bible.descriptionLocal ?? bible.description,
    language: bible.language?.nameLocal ?? bible.language?.name,
  };
}

export async function GET(request:Request) {
  const apiKey = process.env.API_BIBLE_KEY;

  if (new URL(request.url).searchParams.get("check") === "nkjv") {
    return NextResponse.json(await checkNkjvAccess("api-bible",apiKey),{
      headers:{"Cache-Control":"public, s-maxage=3600"},
    });
  }

  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "API_BIBLE_KEY no está configurada." },
      { status: 500 }
    );
  }

  try {
    const [spanish, qeqchi] = await Promise.all([
      fetchAudioBibles("spa", apiKey),
      fetchAudioBibles("kek", apiKey),
    ]);

    const authenticated = spanish.ok || qeqchi.ok ? true
      : spanish.status === 401 || qeqchi.status === 401 ? false : null;

    return NextResponse.json(
      {
        ok: spanish.ok || qeqchi.ok,
        authenticated,
        audio: {
          spanish: spanish.bibles.map(publicAudioDetails),
          qeqchi: qeqchi.bibles.map(publicAudioDetails),
        },
        counts: {
          spanish: spanish.bibles.length,
          qeqchi: qeqchi.bibles.length,
        },
        status: {
          spanish: spanish.status,
          qeqchi: qeqchi.status,
        },
        note:
          "La llave permanece solamente en el servidor. Los resultados se almacenan en caché durante una hora para reducir llamadas.",
      },
      { status: authenticated === false ? 401 : 200 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo conectar con API.Bible." },
      { status: 502 }
    );
  }
}
