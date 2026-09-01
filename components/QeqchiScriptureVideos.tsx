"use client";

import { useEffect, useMemo, useState } from "react";

type ApiTarget = {
  label?: string;
  resources?: { video?: string[] };
};

type ApiResponse = {
  ok?: boolean;
  targets?: ApiTarget[];
};

const SCRIPTURE_EARTH = "https://www.scriptureearth.org";

function normalizeVideoUrl(value: string) {
  try {
    return new URL(value, SCRIPTURE_EARTH).toString();
  } catch {
    return value;
  }
}

function prettyTitle(url: string, index: number) {
  try {
    const pathname = new URL(url).pathname;
    const file = decodeURIComponent(pathname.split("/").pop() || "");
    const withoutExt = file.replace(/\.(mp4|webm|mov)$/i, "");
    const cleaned = withoutExt
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return cleaned || `Video bíblico ${index + 1}`;
  } catch {
    return `Video bíblico ${index + 1}`;
  }
}

function videoGroup(title: string) {
  const value = title.toLowerCase();
  if (value.includes("luc") || value.includes("luke")) return "Lucas";
  if (value.includes("juan") || value.includes("john")) return "Juan";
  if (value.includes("jesus") || value.includes("jesús")) return "Jesús";
  if (value.includes("mat") || value.includes("mar") || value.includes("hech") || value.includes("act")) return "Historias bíblicas";
  return "Videos bíblicos";
}

export default function QeqchiScriptureVideos() {
  const [videos, setVideos] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/scripture-earth/qeqchi?lang=kek&view=summary", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return (await response.json()) as ApiResponse;
      })
      .then((body) => {
        if (!active) return;
        const all = (body.targets || []).flatMap((target) => target.resources?.video || []);
        const normalized = [...new Set(all.map(normalizeVideoUrl))];
        setVideos(normalized);
      })
      .catch(() => {
        if (active) setError("No se pudieron cargar los videos en este momento.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const current = videos[selected] || "";
  const title = useMemo(() => prettyTitle(current, selected), [current, selected]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return videos
      .map((video, index) => ({ video, index, title: prettyTitle(video, index) }))
      .filter((item) => !needle || item.title.toLowerCase().includes(needle));
  }, [videos, query]);

  return (
    <section style={{ margin: "30px 0 34px" }}>
      <div style={{ marginBottom: 14 }}>
        <p style={{ margin: "0 0 6px", color: "#e0aa37", fontWeight: 800, letterSpacing: 1.1, textTransform: "uppercase", fontSize: 12 }}>
          Videos bíblicos en Q’eqchi’
        </p>
        <h2 style={{ margin: 0, fontSize: "clamp(1.55rem,5vw,2.35rem)" }}>Escuchar y ver la Palabra</h2>
        <p style={{ margin: "9px 0 0", color: "rgba(255,255,255,.74)", lineHeight: 1.55 }}>
          Recursos de Scripture Earth para el idioma Q’eqchi’ (kek). Seleccione cualquier video y se reproducirá aquí mismo.
        </p>
      </div>

      {loading && <p style={{ color: "rgba(255,255,255,.7)" }}>Cargando videos…</p>}
      {error && <p style={{ color: "#ffd7d7" }}>{error}</p>}

      {!loading && !error && videos.length > 0 && (
        <>
          <div className="qeqchi-video-grid">
            <div style={{ border: "1px solid rgba(215,170,75,.45)", borderRadius: 18, overflow: "hidden", background: "#02080d", position: "sticky", top: 12 }}>
              <video key={current} controls playsInline preload="metadata" style={{ display: "block", width: "100%", aspectRatio: "16 / 9", background: "#000" }}>
                <source src={current} />
                Su navegador no puede reproducir este video.
              </video>
              <div style={{ padding: "13px 15px" }}>
                <span style={{ display: "inline-flex", marginBottom: 7, padding: "4px 8px", borderRadius: 999, background: "rgba(215,170,75,.13)", color: "#e0aa37", fontSize: 11, fontWeight: 800 }}>
                  {videoGroup(title)}
                </span>
                <strong style={{ display: "block", lineHeight: 1.35 }}>{title}</strong>
                <span style={{ display: "block", marginTop: 5, color: "rgba(255,255,255,.58)", fontSize: 12 }}>Fuente: Scripture Earth</span>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
                <strong style={{ color: "#fff" }}>{videos.length} videos disponibles</strong>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar video…"
                  aria-label="Buscar videos Q’eqchi’"
                  style={{ flex: "1 1 190px", minWidth: 0, borderRadius: 999, border: "1px solid rgba(255,255,255,.16)", background: "rgba(255,255,255,.06)", color: "#fff", padding: "10px 13px", outline: "none" }}
                />
              </div>

              <div className="qeqchi-video-list">
                {filtered.map((item) => {
                  const active = item.index === selected;
                  return (
                    <button
                      key={item.video}
                      type="button"
                      onClick={() => setSelected(item.index)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        border: active ? "1px solid #d7aa4b" : "1px solid rgba(255,255,255,.08)",
                        background: active ? "rgba(215,170,75,.13)" : "rgba(255,255,255,.025)",
                        color: "#fff",
                        borderRadius: 13,
                        padding: "11px 12px",
                        cursor: "pointer",
                        lineHeight: 1.35,
                      }}
                    >
                      <span style={{ display: "block", color: "#e0aa37", fontWeight: 800, fontSize: 11, marginBottom: 3 }}>{videoGroup(item.title)}</span>
                      <span><strong style={{ color: "#e0aa37", marginRight: 7 }}>{item.index + 1}.</strong>{item.title}</span>
                    </button>
                  );
                })}
              </div>

              {filtered.length === 0 && <p style={{ color: "rgba(255,255,255,.66)" }}>No encontramos un video con ese nombre.</p>}
            </div>
          </div>
        </>
      )}

      {!loading && !error && videos.length === 0 && (
        <p style={{ color: "rgba(255,255,255,.7)" }}>Scripture Earth no devolvió videos para esta consulta.</p>
      )}

      <style jsx>{`
        .qeqchi-video-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(280px, .9fr);
          gap: 16px;
          align-items: start;
        }
        .qeqchi-video-list {
          display: grid;
          gap: 7px;
          max-height: 560px;
          overflow-y: auto;
          padding-right: 4px;
        }
        @media (max-width: 780px) {
          .qeqchi-video-grid {
            grid-template-columns: 1fr;
          }
          .qeqchi-video-grid > div:first-child {
            position: static !important;
          }
          .qeqchi-video-list {
            max-height: none;
          }
        }
      `}</style>
    </section>
  );
}
