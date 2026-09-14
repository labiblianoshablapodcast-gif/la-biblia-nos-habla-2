import manifest from "@/data/rvr60-audio-manifest.json";

const chapters: Record<string, Record<string, string>> = manifest;
const base = "https://audio.labiblianoshabla.org";

export function getRvr60Audio(bookCode: string, chapter: number): string | null {
  if (!Number.isInteger(chapter) || chapter < 1) return null;
  const path = chapters[bookCode]?.[String(chapter)];
  if (!path) return null;
  // R2 contains chapters at the bucket root and under rvr1960/.
  return `${base}/${path.split("/").map(encodeURIComponent).join("/")}`;
}
