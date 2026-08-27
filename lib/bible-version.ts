export type ReaderVersion = "rvr60" | "qeqchi" | "asv";

export function readerVersion(value:unknown):ReaderVersion {
  return value === "qeqchi" || value === "asv" ? value : "rvr60";
}

export function versionQuery(version:ReaderVersion):string {
  return version === "rvr60" ? "" : `?version=${version}`;
}
