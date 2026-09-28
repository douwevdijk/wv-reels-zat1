import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Achtergrond } from "./Achtergrond";
import { Bank, Basis, EIND_START, stapStart } from "./Lijst";
import type { Indeling } from "./maten";
import { Foto, Kop, voortgang } from "./onderdelen";
import type { Opstelling } from "./schema";
import { EIND, FOTO_IN, FOTO_UIT } from "./tijden";

// Spelersfoto's: per stap de foto van die speler (schuift omhoog in, ligt
// boven de vorige; de vorige fadet uit). Op stap 11 een crossfade naar de
// uitgelichte speler (die ligt ONDER de laatste foto, zie tijden.ts).
const Fotos: React.FC<{
  opstelling: Opstelling;
  fotos: (string | null)[];
  ind: Indeling;
  frame: number | null;
  uitgelicht: number;
}> = ({ opstelling, fotos, ind, frame, uitgelicht }) => {
  const eindIndex = opstelling.basis.findIndex((s) => s.nummer === uitgelicht);
  const eindFoto = eindIndex >= 0 ? fotos[eindIndex] : null;
  if (frame === null) {
    return <Foto src={eindFoto} ind={ind} />;
  }
  const crossfade = interpolate(frame, [EIND_START, EIND_START + EIND.crossfade], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const laatste = opstelling.basis.length - 1;
  return (
    <>
      {crossfade > 0 ? <Foto src={eindFoto} ind={ind} dekking={crossfade} /> : null}
      {opstelling.basis.map((s, k) => {
        const start = stapStart(k);
        if (frame < start) {
          return null;
        }
        const inDekking = voortgang(
          frame,
          start + FOTO_IN.dekkingStart,
          FOTO_IN.dekkingDuur,
          FOTO_IN.dekkingEasing,
        );
        const dy =
          FOTO_IN.afstand *
          (ind.breedte / 1080) *
          (1 - voortgang(frame, start + FOTO_IN.start, FOTO_IN.duur, FOTO_IN.easing));
        const uit =
          k < laatste
            ? 1 - voortgang(frame, stapStart(k + 1) + FOTO_UIT.start, FOTO_UIT.duur, FOTO_UIT.easing)
            : 1 - crossfade;
        const dekking = inDekking * uit;
        if (dekking <= 0) {
          return null;
        }
        return <Foto key={`${s.nummer}-${k}`} src={fotos[k]} ind={ind} dy={dy} dekking={dekking} />;
      })}
    </>
  );
};

// De hele line-up (achtergrond, kop, foto's, lijst, bank). frame null = eindshot.
// `uitgelicht`: rugnummer van de speler op het eindshot (standaard de eindspeler;
// de jpg's geven de kaartspeler mee).
export const OpstellingScene: React.FC<{
  opstelling: Opstelling;
  fotos: (string | null)[];
  ind: Indeling;
  frame: number | null;
  fps: number;
  uitgelicht?: number;
}> = ({ opstelling, fotos, ind, frame, fps, uitgelicht }) => (
  <AbsoluteFill style={{ width: ind.breedte, height: ind.hoogte }}>
    <Achtergrond maat={ind.achtergrond} breedte={ind.breedte} hoogte={ind.hoogte} />
    <Fotos
      opstelling={opstelling}
      fotos={fotos}
      ind={ind}
      frame={frame}
      uitgelicht={uitgelicht ?? opstelling.eindspeler}
    />
    <Kop thuis={opstelling.thuis} uit={opstelling.uit} ind={ind} frame={frame} fps={fps} />
    <Basis basis={opstelling.basis} ind={ind} frame={frame} />
    <Bank bank={opstelling.bank} ind={ind} frame={frame} />
  </AbsoluteFill>
);
