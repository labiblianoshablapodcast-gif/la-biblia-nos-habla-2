import timingData from "../data/rvr60-verse-timing.json";

type RecordingTiming = {
  duration: number;
  starts: readonly number[];
};

const recordings: Record<string, RecordingTiming | undefined> = timingData;

/** Marks are seconds on the site's MP3, including the recording's introduction. */
export function getRvr60VerseStarts(
  audioUrl: string | null,
  duration: number,
  verses: readonly { number: number }[],
): readonly number[] | null {
  const recording = audioUrl ? recordings[audioUrl] : undefined;
  // Browsers can round MP3 duration differently. Reject a materially different file.
  if (!recording || !Number.isFinite(duration) || Math.abs(recording.duration - duration) > 0.5) {
    return null;
  }

  const { starts } = recording;
  if (starts.length === 0 || starts.length !== verses.length) return null;
  const valid = starts.every((start, index) =>
    verses[index].number === index + 1 &&
    Number.isFinite(start) && start >= 0 && start < duration &&
    (index === 0 || start > starts[index - 1]),
  );
  return valid ? starts : null;
}

export function verseAtAudioTime(starts: readonly number[], time: number): number | null {
  let index = starts.length - 1;
  while (index >= 0 && !(starts[index] <= time)) index--;
  return index >= 0 ? index + 1 : null;
}
