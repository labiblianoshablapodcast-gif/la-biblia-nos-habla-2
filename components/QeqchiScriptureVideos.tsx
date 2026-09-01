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

export default function QeqchiScriptureVideos() {
  const [videos, setVideos] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <section style={{ margin: "30px 0 34px" }}>
      <div style={{ marginBottom: 14 }}>
        <p style={{ margin: "0 0 6px", color: "#e0aa37", fontWeight: 800, letterSpacing: 1.1, textTransform: "uppercase", fontSize: 12 }}>
          Videos bíblicos en Q’eqchi’
        </p>
        <h2 style={{ margin: 0, fontSize: "clamp(1.55rem,5vw,2.35rem)" }}>Escuchar y ver la Palabra</h2>
        <p style={{ margin: "9px 0 0", color: "rgba(255,255,255,.74)", lineHeight: 1.55 }}>
          Recursos de Scripture Earth para el idioma Q’eqchi’ (kek). Los videos se reproducen aquí mismo dentro del sitio.
        </p>
      </div>

      {loading && <p style={{ color: "rgba(255,255,255,.7)" }}>Cargando videos…</p>}
      {error && <p style={{ color: "#ffd7d7" }}>{error}</p>}

      {!loading && !error && videos.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(240px,.8fr)", gap: 16, alignItems: "start" }}>
          <div style={{ border: "1px solid rgba(215,170,75,.45)", borderRadius: 18, overflow: "hidden", background: "#02080d" }}>
            <video key={current} controls playsInline preload="metadata" style={{ display: "block", width: "100%", aspectRatio: "16 / 9", background: "#000" }}>
              <source src={current} />
              Su navegador no puede reproducir este video.
            </video>
            <div style={{ padding: "13px 15px" }}>
              <strong style={{ display: "block", lineHeight: 1.35 }}>{title}</strong>
              <span style={{ display: "block", marginTop: 5, color: "rgba(255,255,255,.58)", fontSize: 12 }}>Fuente: Scripture Earth</span>
            </div>
          </div>

          <div style={{ maxHeight: 430, overflowY: "auto", border: "1px solid rgba(255,255,255,.12)", borderRadius: 16, padding: 8, background: "rgba(255,255,255,.035)" }}>
            {videos.map((video, index) => {
              const active = index === selected;
              return (
                <button
                  key={video}
                  type="button"
                  onClick={() => setSelected(index)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: active ? "1px solid #d7aa4b" : "1px solid transparent",
                    background: active ? "rgba(215,170,75,.13)" : "transparent",
                    color: "#fff",
                    borderRadius: 12,
                    padding: "11px 12px",
                    marginBottom: 5,
                    cursor: "pointer",
                    lineHeight: 1.35,
                  }}
                >
                  <span style={{ color: "#e0aa37", fontWeight: 800, marginRight: 8 }}>{index + 1}.</span>
                  {prettyTitle(video, index)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <p style={{ color: "rgba(255,255,255,.7)" }}>Scripture Earth no devolvió videos para esta consulta.</p>
      )}

      <style jsx>{`
        @media (max-width: 780px) {
          section > div:nth-of-type(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
