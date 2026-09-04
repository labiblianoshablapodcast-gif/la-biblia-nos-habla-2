import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = "https://4.dbt.io/api";
const BIBLE_ID = "SPAR60";

function getApiKey() {
  return (
    process.env.BIBLE_BRAIN_API_KEY ||
    process.env.BIBLEBRAIN_API_KEY ||
    process.env.DBP_API_KEY ||
    process.env.FCBH_API_KEY ||
    ""
  );
}

async function requestBibleBrain(path: string, key: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("v", "4");
  url.searchParams.set("key", key);
  Object.entries(params).forEach(([name, value]) => url.searchParams.set(name, value));

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text.slice(0, 1000);
  }

  return { ok: response.ok, status: response.status, data };
}

function unwrapData(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    if (Array.isArray(object.data)) return object.data;
  }
  return [];
}

function stringsFrom(value: unknown, result: string[] = []): string[] {
  if (typeof value === "string") result.push(value);
  else if (Array.isArray(value)) value.forEach((item) => stringsFrom(item, result));
  else if (value && typeof value === "object") {
    Object.values(value as Record<string, unknown>).forEach((item) => stringsFrom(item, result));
  }
  return result;
}

function filesetIdsFrom(value: unknown): string[] {
  const ids = new Set<string>();
  const visit = (item: unknown) => {
    if (Array.isArray(item)) return item.forEach(visit);
    if (!item || typeof item !== "object") return;
    const object = item as Record<string, unknown>;
    for (const [key, raw] of Object.entries(object)) {
      if (
        typeof raw === "string" &&
        /fileset|fileset_id|id/i.test(key) &&
        /^SPAR60/i.test(raw) &&
        /(DA|SA)(-|$)/i.test(raw)
      ) {
        ids.add(raw);
      }
      visit(raw);
    }
  };
  visit(value);
  return [...ids];
}

function findMediaItem(value: unknown, book: string, chapter: number) {
  const candidates = unwrapData(value);
  return candidates.find((raw) => {
    if (!raw || typeof raw !== "object") return false;
    const item = raw as Record<string, unknown>;
    const bookId = String(item.book_id ?? item.book ?? "").toUpperCase();
    const start = Number(item.chapter_start ?? item.chapter ?? item.chapter_id ?? chapter);
    const end = Number(item.chapter_end ?? item.chapter ?? item.chapter_id ?? start);
    return (!bookId || bookId === book) && chapter >= start && chapter <= end;
  }) as Record<string, unknown> | undefined;
}

function mediaUrlFrom(item: Record<string, unknown> | undefined) {
  if (!item) return "";
  const direct = [
    item.path,
    item.url,
    item.file,
    item.download_url,
    item.audio,
    item.audio_url,
  ].find((value) => typeof value === "string" && /^https?:\/\//i.test(value as string));
  if (typeof direct === "string") return direct;

  const strings = stringsFrom(item);
  return strings.find((value) => /^https?:\/\//i.test(value) && /audio|mp3|m4a|aac|opus|cloudfront|amazonaws/i.test(value)) ?? "";
}

function normalizeTimings(value: unknown) {
  const rows = unwrapData(value);
  return rows
    .map((raw) => {
      if (!raw || typeof raw !== "object") return null;
      const item = raw as Record<string, unknown>;
      const verse = Number(item.verse_start ?? item.verse ?? item.verse_id ?? item.verse_num);
      const start = Number(item.timestamp ?? item.start ?? item.start_time ?? item.begin ?? item.begin_ts);
      if (!Number.isFinite(verse) || !Number.isFinite(start)) return null;
      return { verse, start };
    })
    .filter((item): item is { verse: number; start: number } => Boolean(item))
    .sort((a, b) => a.start - b.start);
}

export async function GET(request: NextRequest) {
  const key = getApiKey();
  const book = (request.nextUrl.searchParams.get("book") || "").trim().toUpperCase();
  const chapter = Number(request.nextUrl.searchParams.get("chapter"));

  if (!key) {
    return NextResponse.json(
      { ok: false, error: "Bible Brain no está configurado en el servidor." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!/^[1-3A-Z]{3}$/.test(book) || !Number.isInteger(chapter) || chapter < 1 || chapter > 150) {
    return NextResponse.json(
      { ok: false, error: "Libro o capítulo inválido." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const [bible, filesets] = await Promise.all([
    requestBibleBrain(`/bibles/${BIBLE_ID}`, key),
    requestBibleBrain("/filesets", key, { bible_id: BIBLE_ID }),
  ]);

  const discovered = [
    ...filesetIdsFrom(bible.data),
    ...filesetIdsFrom(filesets.data),
  ];

  const testament = ["MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD","REV"].includes(book) ? "N" : "O";

  const fallback = [
    `SPAR60${testament}1DA`,
    `SPAR60${testament}2DA`,
    `SPAR60${testament}1DA-opus16`,
    `SPAR60${testament}2DA-opus16`,
  ];

  const filesetIds = [...new Set([...discovered, ...fallback])];

  for (const filesetId of filesetIds) {
    const media = await requestBibleBrain(
      `/bibles/filesets/${encodeURIComponent(filesetId)}/${book}/${chapter}`,
      key,
    );

    if (!media.ok) continue;
    const mediaItem = findMediaItem(media.data, book, chapter) ?? (unwrapData(media.data)[0] as Record<string, unknown> | undefined);
    const audioUrl = mediaUrlFrom(mediaItem);
    if (!audioUrl) continue;

    const timingResponse = await requestBibleBrain(
      `/timestamps/${encodeURIComponent(filesetId)}/${book}/${chapter}`,
      key,
    );

    return NextResponse.json(
      {
        ok: true,
        bibleId: BIBLE_ID,
        filesetId,
        book,
        chapter,
        audioUrl,
        timings: timingResponse.ok ? normalizeTimings(timingResponse.data) : [],
        duration: Number(mediaItem?.duration ?? 0) || null,
        source: "Bible Brain · Faith Comes By Hearing",
      },
      { headers: { "Cache-Control": "private, max-age=300" } },
    );
  }

  return NextResponse.json(
    {
      ok: false,
      error: "No encontré un archivo de audio autorizado para este capítulo con la clave configurada.",
      bibleId: BIBLE_ID,
      book,
      chapter,
    },
    { status: 404, headers: { "Cache-Control": "no-store" } },
  );
}
