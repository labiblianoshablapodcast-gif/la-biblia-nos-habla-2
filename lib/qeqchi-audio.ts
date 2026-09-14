import manifest from "@/data/qeqchi-audio-manifest.json";

const chapters: Record<string, Record<string, string>> = manifest;
const base = "https://audio-qeqchi.labiblianoshabla.org";

export function getQeqchiAudio(code: string, chapter: number): string | undefined {
  if (!Number.isInteger(chapter) || chapter < 1) return undefined;
  const filename = chapters[code]?.[String(chapter)]?.split("/").pop();
  if (!filename) return undefined;
  // The Q’eqchi’ R2 bucket stores the original MP3 names at its root.
  return `${base}/${encodeURIComponent(filename)}`;
}
