export type HighlightRange = {start: number; end: number};
export type HighlightEntry = {text: string; ranges: HighlightRange[]};
export type ChapterHighlights = Record<string, HighlightEntry>;

export function mergeRanges(ranges: HighlightRange[]): HighlightRange[] {
  const result: HighlightRange[] = [];
  for (const range of [...ranges].sort((a,b)=>a.start-b.start)) {
    const last = result[result.length-1];
    if (last && range.start <= last.end) last.end = Math.max(last.end,range.end);
    else result.push({...range});
  }
  return result;
}

export function subtractRange(ranges: HighlightRange[], removed: HighlightRange): HighlightRange[] {
  return ranges.flatMap(range => {
    if (removed.end <= range.start || removed.start >= range.end) return [range];
    const parts: HighlightRange[] = [];
    if (removed.start > range.start) parts.push({start:range.start,end:removed.start});
    if (removed.end < range.end) parts.push({start:removed.end,end:range.end});
    return parts;
  });
}

// Validate persisted data and never apply offsets to a changed translation/text.
export function parseHighlights(raw: string | null): ChapterHighlights {
  if (!raw) return {};
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid highlights");
  const result: ChapterHighlights = {};
  for (const [number,value] of Object.entries(parsed)) {
    if (!/^\d+$/.test(number) || !value || typeof value !== "object") continue;
    const entry = value as HighlightEntry;
    if (typeof entry.text !== "string" || !Array.isArray(entry.ranges)) continue;
    const ranges = entry.ranges.filter(r => r && Number.isInteger(r.start) && Number.isInteger(r.end)
      && r.start >= 0 && r.end > r.start && r.end <= entry.text.length);
    result[number] = {text:entry.text,ranges:mergeRanges(ranges)};
  }
  return result;
}

export function textSegments(text: string, entry?: HighlightEntry) {
  const ranges = entry?.text === text ? entry.ranges : [];
  const segments: Array<{text:string;start:number;end:number;marked:boolean}> = [];
  let cursor = 0;
  for (const range of ranges) {
    if (range.start > cursor) segments.push({text:text.slice(cursor,range.start),start:cursor,end:range.start,marked:false});
    segments.push({text:text.slice(range.start,range.end),...range,marked:true});
    cursor = range.end;
  }
  if (cursor < text.length) segments.push({text:text.slice(cursor),start:cursor,end:text.length,marked:false});
  return segments;
}
