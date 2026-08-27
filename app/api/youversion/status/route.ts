import { NextResponse } from 'next/server'
import {checkNkjvAccess,youVersionCatalogUrl} from '@/lib/nkjv-access'

export async function GET(request:Request) {
  const appKey = process.env.YOUVERSION_API_KEY

  if (new URL(request.url).searchParams.get('check') === 'nkjv') {
    return NextResponse.json(await checkNkjvAccess('youversion',appKey),{
      headers:{'Cache-Control':'public, s-maxage=3600'},
    })
  }

  if (!appKey) {
    return NextResponse.json(
      { ok: false, error: 'YOUVERSION_API_KEY no está configurada.' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(youVersionCatalogUrl('es'), {
      headers: {
        'X-YVP-App-Key': appKey,
        Accept: 'application/json',
      },
      next: {revalidate:3600},
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, authenticated: response.status === 401 ? false : null, status: response.status },
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
