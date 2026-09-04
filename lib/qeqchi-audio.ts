import manifest from "@/data/qeqchi-audio-manifest.json";

const chapters: Record<string, Record<string, string>> = manifest;

export function getQeqchiAudio(code: string, chapter: number): string | undefined {
  if (!Number.isInteger(chapter) || chapter < 1) return undefined;
  const path = chapters[code]?.[String(chapter)];
  if (!path) return undefined;
  // Original MP3 filenames are stored in the public audio bucket.
  const base = "https://janhkvbktitbjefncuvb.supabase.co/storage/v1/object/public/qeqchi-audio";
  return `${base}/${path.split("/").pop()}`;
}
