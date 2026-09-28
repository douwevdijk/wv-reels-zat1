import React from "react";
import { Img, interpolate, spring, staticFile, type EasingFunction } from "remotion";
import { loadFont as loadBigShoulders } from "@remotion/google-fonts/BigShoulders";
import { fonts } from "../theme";
import { KLEUR, type Indeling, type TekstMaat } from "./maten";
import type { OpstellingTeam } from "./schema";
import { GLOED, KOP_IN, LOGO_IN, VS_IN } from "./tijden";

// theme.ts laadt Big Shoulders 600/700; de line-up gebruikt 800 (gefit op
// kaphoogte, streekdikte en breedte van de namen).
loadBigShoulders("normal", { weights: ["800"], subsets: ["latin"] });

// Voortgang 0..1 tussen start en start+duur met easing. frame null = eindstand.
export const voortgang = (
  frame: number | null,
  start: number,
  duur: number,
  easing?: EasingFunction,
) => {
  if (frame === null) {
    return 1;
  }
  return interpolate(frame, [start, start + duur], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// Afstand van de bovenkant van het regelvak (line-height = grootte) tot de
// bovenkant van de hoofdletters, als fractie van de grootte. Uit de fontbestanden:
// Anton hhea 2409/-674, kap 1760 (upm 2048); Big Shoulders 1971/-429, kap 1600 (upm 2000).
const KAP_BOVEN = {
  anton: (1 - (2409 + 674) / 2048) / 2 + 2409 / 2048 - 1760 / 2048,
  bs: (1 - (1971 + 429) / 2000) / 2 + 1971 / 2000 - 1600 / 2000,
};

export type FontSoort = keyof typeof KAP_BOVEN;

const FAMILIE: Record<FontSoort, { fontFamily: string; fontWeight: number }> = {
  anton: { fontFamily: fonts.heading, fontWeight: 400 },
  bs: { fontFamily: fonts.label, fontWeight: 800 },
};

// Tekst op kaphoogte `y`. Uitlijning: `links` (x = linkerrand), `rechts`
// (x = rechterrand) of `midden` (x = midden; de spatiering na de laatste letter
// wordt gecompenseerd).
export const Tekst: React.FC<{
  maat: TekstMaat;
  font: FontSoort;
  x: number;
  y: number;
  uitlijning: "links" | "rechts" | "midden";
  kleur: string;
  dekking?: number;
  children: string;
}> = ({ maat, font, x, y, uitlijning, kleur, dekking = 1, children }) => {
  const boven = y - KAP_BOVEN[font] * maat.grootte;
  const basis: React.CSSProperties = {
    position: "absolute",
    top: boven,
    ...FAMILIE[font],
    fontSize: maat.grootte,
    lineHeight: `${maat.grootte}px`,
    letterSpacing: maat.spatie,
    color: kleur,
    opacity: dekking,
    whiteSpace: "pre",
  };
  if (uitlijning === "links") {
    return <div style={{ ...basis, left: x }}>{children}</div>;
  }
  if (uitlijning === "rechts") {
    // Chrome zet de letterspatiering ook achter de laatste letter: die valt buiten x.
    return (
      <div style={{ ...basis, left: x + maat.spatie, transform: "translateX(-100%)" }}>
        {children}
      </div>
    );
  }
  return (
    <div
      style={{
        ...basis,
        left: x - 1000,
        width: 2000,
        textAlign: "center",
        paddingLeft: maat.spatie,
      }}
    >
      {children}
    </div>
  );
};

// Logo in een rond vak van `maat` px, met de gemeten slagschaduw.
const Logo: React.FC<{ team: OpstellingTeam; x: number; y: number; maat: number }> = ({
  team,
  x,
  y,
  maat,
}) => {
  const m = maat * team.logoSchaal;
  return (
    <Img
      src={staticFile(team.logo)}
      style={{
        position: "absolute",
        left: x - m / 2,
        top: y - m / 2,
        width: m,
        height: m,
        objectFit: "contain",
        // Slagschaduw: 6 varianten gerenderd en vergeleken in de ring r 88-150 px
        // rond beide logo's; deze geeft het kleinste verschil (1,7 op 255).
        filter: "drop-shadow(2px 8px 16px rgba(0, 0, 0, 0.6))",
      }}
    />
  );
};

// Dekking van de logogloed op dit frame (0 in het eindshot).
const gloedDekking = (frame: number | null, start: number) => {
  if (frame === null) {
    return 0;
  }
  const op = interpolate(frame, [start, start + GLOED.op], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const t = interpolate(
    frame,
    [start + GLOED.op + GLOED.vast, start + GLOED.op + GLOED.vast + GLOED.af],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return op * (1 - t) * (1 - t);
};

// Witte halo achter een logo. Straalprofiel gemeten op de piek (verschil met het
// eindshot, rood kanaal, omgerekend naar witte dekking op de achtergrond):
// r 90: 0,079 / 100: 0,072 / 110: 0,061 / 120: 0,044 / 130: 0,026 / 140: 0,008 / 148: 0.
const Gloed: React.FC<{ x: number; y: number; schaal: number; dekking: number }> = ({
  x,
  y,
  schaal,
  dekking,
}) => {
  if (dekking <= 0) {
    return null;
  }
  const r = 150 * schaal;
  const w = (a: number) => `rgba(255,255,255,${a})`;
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: 2 * r,
        height: 2 * r,
        opacity: dekking,
        background: `radial-gradient(circle closest-side, ${w(0.085)} 0%, ${w(0.079)} 60%, ${w(0.072)} 66.7%, ${w(0.061)} 73.3%, ${w(0.044)} 80%, ${w(0.026)} 86.7%, ${w(0.008)} 93.3%, ${w(0)} 98.7%)`,
      }}
    />
  );
};

// Bovenste deel: logo's met teamnamen, "VS" en de kop "LINE UP".
export const Kop: React.FC<{
  thuis: OpstellingTeam;
  uit: OpstellingTeam;
  ind: Indeling;
  frame: number | null;
  fps: number;
}> = ({ thuis, uit, ind, frame, fps }) => {
  const { logo, teamLabel, vs, kop } = ind;
  const schaal = ind.breedte / 1080;
  const dxThuis =
    -LOGO_IN.afstand *
    schaal *
    (1 - voortgang(frame, LOGO_IN.startThuis, LOGO_IN.duur, LOGO_IN.easing));
  const dxUit =
    LOGO_IN.afstand * schaal * (1 - voortgang(frame, LOGO_IN.startUit, LOGO_IN.duur, LOGO_IN.easing));
  const vsDekking = voortgang(frame, VS_IN.start, VS_IN.duur, VS_IN.easing);
  const rol = (start: number) =>
    frame === null
      ? 0
      : KOP_IN.afstand * (1 - spring({ frame: frame - start, fps, config: KOP_IN.spring }));
  const kopMaat = { grootte: kop.grootte, spatie: kop.spatie };

  return (
    <>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${dxThuis}px)` }}>
        <Gloed x={logo.thuisX} y={logo.y} schaal={logo.maat / 167} dekking={gloedDekking(frame, GLOED.thuis)} />
        <Logo team={thuis} x={logo.thuisX} y={logo.y} maat={logo.maat} />
        <Tekst maat={teamLabel} font="bs" x={logo.thuisX} y={teamLabel.y} uitlijning="midden" kleur={KLEUR.wit}>
          {thuis.label}
        </Tekst>
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${dxUit}px)` }}>
        <Gloed x={logo.uitX} y={logo.y} schaal={logo.maat / 167} dekking={gloedDekking(frame, GLOED.uit)} />
        <Logo team={uit} x={logo.uitX} y={logo.y} maat={logo.maat} />
        <Tekst maat={teamLabel} font="bs" x={logo.uitX} y={teamLabel.y} uitlijning="midden" kleur={KLEUR.wit}>
          {uit.label}
        </Tekst>
      </div>
      <Tekst maat={vs} font="anton" x={vs.x} y={vs.y} uitlijning="midden" kleur={KLEUR.vs} dekking={vsDekking}>
        VS
      </Tekst>
      {/* Rolmasker: alles onder maskerOnder is onzichtbaar tijdens het rollen */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: ind.breedte,
          height: kop.maskerOnder,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${rol(KOP_IN.startLine)}px)` }}>
          <Tekst maat={kopMaat} font="anton" x={kop.lineX} y={kop.y} uitlijning="links" kleur={KLEUR.wit}>
            LINE
          </Tekst>
        </div>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${rol(KOP_IN.startUp)}px)` }}>
          <Tekst maat={kopMaat} font="anton" x={kop.upX} y={kop.y} uitlijning="links" kleur={KLEUR.wit}>
            UP
          </Tekst>
        </div>
      </div>
    </>
  );
};

// Neutraal silhouet zolang er geen spelersfoto is (hoofd + romp, subtiel wit).
const Silhouet: React.FC = () => (
  <svg viewBox="0 0 300 1000" preserveAspectRatio="xMidYMin meet" style={{ width: "100%", height: "100%" }}>
    <g fill="#ffffff" fillOpacity={0.1}>
      <circle cx="150" cy="95" r="72" />
      <path d="M150 180 C 70 180 40 215 30 290 L 12 560 C 10 600 55 605 60 565 L 80 360 L 88 620 L 84 990 L 140 990 L 150 650 L 160 990 L 216 990 L 212 620 L 220 360 L 240 565 C 245 605 290 600 288 560 L 270 290 C 260 215 230 180 150 180 Z" />
    </g>
  </svg>
);

// Spelersfoto (of silhouet) in het fotovak, met de gemeten fade onderaan.
export const Foto: React.FC<{
  src: string | null;
  ind: Indeling;
  dy?: number;
  dekking?: number;
}> = ({ src, ind, dy = 0, dekking = 1 }) => {
  const { foto } = ind;
  const masker = `linear-gradient(180deg, ${foto.fade
    .map(([y, a]) => `rgba(0,0,0,${a}) ${y - foto.boven}px`)
    .join(", ")})`;
  return (
    <div
      style={{
        position: "absolute",
        left: foto.links,
        top: foto.boven,
        width: foto.breedte,
        height: foto.hoogte,
        transform: `translateY(${dy}px)`,
        opacity: dekking,
        WebkitMaskImage: masker,
        maskImage: masker,
      }}
    >
      {src ? (
        <Img
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "50% 0%" }}
        />
      ) : (
        <Silhouet />
      )}
    </div>
  );
};
