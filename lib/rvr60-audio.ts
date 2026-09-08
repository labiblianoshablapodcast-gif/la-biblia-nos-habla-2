import manifest from "@/data/rvr60-audio-manifest.json";

const chapters: Record<string, Record<string, string>> = manifest;

export function getRvr60Audio(bookCode: string, chapter: number): string | null {
  if (!Number.isInteger(chapter) || chapter < 1) return null;
  const filename = chapters[bookCode]?.[String(chapter)];
  // Original filenames in the approved public collection.
  const base = process.env.NEXT_PUBLIC_RVR60_AUDIO_BASE_URL?.replace(/\/+$/, "")
    || "https://janhkvbktitbjefncuvb.supabase.co/storage/v1/object/public/audio-biblia";
  if (!filename || !base) return null;
  return `${base}/${encodeURIComponent(filename)}`;
}
