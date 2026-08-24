import { NextResponse } from 'next/server'

const YVP_BASE = 'https://api.youversion.com/v1'

export async function GET() {
  const appKey = process.env.YOUVERSION_API_KEY

  if (!appKey) {
    return NextResponse.json(
      { ok: false, error: 'YOUVERSION_API_KEY no está configurada.' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(`${YVP_BASE}/bibles?language_ranges=es&page_size=99`, {
      headers: {
        'X-YVP-App-Key': appKey,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, authenticated: response.status !== 401, status: response.status },
        { status: response.status }
      )
    }

    const payload = await response.json()
    const bibles = Array.isArray(payload?.data) ? payload.data : []
    const rvr1960 = bibles.filter((bible: any) => {
      const haystack = `${bible?.abbreviation ?? ''} ${bible?.title ?? ''}`.toLowerCase()
      return haystack.includes('rvr1960') || haystack.includes('rvr60') || haystack.includes('reina-valera 1960') || haystack.includes('reina valera 1960')
    })

    return NextResponse.json({
      ok: true,
      authenticated: true,
      spanishBibleCount: bibles.length,
      rvr1960: rvr1960.map((bible: any) => ({
        id: bible.id,
        abbreviation: bible.abbreviation,
        title: bible.title,
        copyright: bible.copyright,
      })),
      note: 'La llave permanece solamente en el servidor y nunca se devuelve al navegador.',
    })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'No se pudo conectar con YouVersion.' },
      { status: 502 }
    )
  }
}
