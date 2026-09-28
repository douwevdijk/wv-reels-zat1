import React from "react";
import { AbsoluteFill } from "remotion";
import type { AchtergrondMaat } from "./maten";

// Achtergrond van de line-up (zie AchtergrondMaat in maten.ts):
//   1. radiale gloed (sRGB-verloop, 6 stops)
//   2. diagonale lichtbanen, additief (mix-blend-mode: plus-lighter)
//   3. raster van 60 px, additief, alleen in het midden
//   4. donkere verlooplaag van boven naar beneden (normaal)
// 2 en 3 liggen onder laag 4, zodat ze onderaan net zo wegvallen als in de referentie.
export const Achtergrond: React.FC<{ maat: AchtergrondMaat; breedte: number; hoogte: number }> = ({
  maat,
  breedte,
  hoogte,
}) => {
  const { gloed, banen, raster, laag } = maat;
  const stops = gloed.kleuren
    .map((k, i) => `${k} ${(i * 100) / (gloed.kleuren.length - 1)}%`)
    .join(", ");
  const half = banen.periode / 2;
  // Banen: een brede laag met verticale banen, scheef gezet met skewX om de
  // bovenrand. Bij y = 0 begint een lichte baan op x = fase (+ n * periode).
  const hoek = (Math.atan(banen.helling) * 180) / Math.PI;
  const extra = Math.ceil((Math.abs(banen.helling) * hoogte) / banen.periode + 2) * banen.periode;
  const links = banen.fase - Math.ceil((banen.fase + extra) / banen.periode) * banen.periode;
  const laagStops = laag.stops
    .map(([y, a]) => `rgba(${laag.kleur}, ${a}) ${y}px`)
    .join(", ");

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ isolation: "isolate" }}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse ${gloed.rx}px ${gloed.ry}px at ${gloed.cx}px ${gloed.cy}px, ${stops})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: links,
            width: breedte - links + extra,
            height: hoogte,
            transformOrigin: "0 0",
            transform: `skewX(${hoek}deg)`,
            backgroundImage: `repeating-linear-gradient(90deg, ${banen.kleur} 0px, ${banen.kleur} ${half}px, transparent ${half}px, transparent ${banen.periode}px)`,
            mixBlendMode: "plus-lighter",
          }}
        />
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(90deg, ${raster.kleur} 1px, transparent 1px), linear-gradient(180deg, ${raster.kleur} 1px, transparent 1px)`,
            backgroundSize: `${raster.stap}px ${raster.stap}px`,
            WebkitMaskImage: raster.masker,
            maskImage: raster.masker,
            mixBlendMode: "plus-lighter",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${laagStops})` }} />
    </AbsoluteFill>
  );
};
