import React from "react";
import { Easing, interpolate } from "remotion";
import { loadFont as loadBigShoulders } from "@remotion/google-fonts/BigShoulders";
import { fonts } from "../theme";
import type { ChevronMaat, TekstMaat } from "./maten";

// theme.ts laadt Big Shoulders 600 en 700. Gemeten (letterposities + kaphoogte):
// de teamnamen onder de logo's zijn 900.
loadBigShoulders("normal", { weights: ["900"], subsets: ["latin"] });

// Gedeelde easing van alle animaties in de referentie. Elke gemeten beweging
// (logo, NEXT, balk, lijn, kop, foto, inforegels, logo-rij) past op deze ene
// curve met alleen een eigen start en duur (rms-fout < 0,005).
export const EASE = Easing.bezier(0.29, 0.72, 0.25, 1.0);

// Voortgang 0..1 met de gedeelde easing. frame === null betekent: eindstand.
export const voortgang = (frame: number | null, start: number, duur: number) => {
  if (frame === null) {
    return 1;
  }
  return interpolate(frame, [start, start + duur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const lineair = (frame: number | null, start: number, eind: number) => {
  if (frame === null) {
    return 1;
  }
  return interpolate(frame, [start, eind], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// Fontmetrieken (hhea) uit de fontbestanden, voor exacte basislijnplaatsing.
const METRIEK = {
  anton: { asc: 2409 / 2048, desc: 674 / 2048 },
  bs: { asc: 1971 / 2000, desc: 429 / 2000 },
};

export type FontSoort = keyof typeof METRIEK;

// Afstand van de bovenkant van het regelvak tot de basislijn bij line-height = grootte.
const basislijnOffset = (font: FontSoort, grootte: number) => {
  const m = METRIEK[font];
  return (grootte - (m.asc + m.desc) * grootte) / 2 + m.asc * grootte;
};

// Tekst geplaatst op pen-x en basislijn, zoals gemeten in de referentie.
// Met `midden` wordt de inkt exact gecentreerd op die x (de spatiering na de
// laatste letter wordt gecompenseerd).
export const Tekst: React.FC<{
  maat: Omit<TekstMaat, "x"> & { x?: number };
  font: FontSoort;
  kleur: string;
  children: string;
  midden?: number;
  style?: React.CSSProperties;
}> = ({ maat, font, kleur, children, midden, style }) => {
  const top = maat.basislijn - basislijnOffset(font, maat.grootte);
  const gecentreerd = midden !== undefined;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: gecentreerd ? midden : maat.x,
        transform: gecentreerd ? "translateX(-50%)" : undefined,
        paddingLeft: gecentreerd ? maat.spatiering : 0,
        fontFamily: font === "anton" ? fonts.heading : fonts.info,
        fontWeight: maat.gewicht,
        fontSize: maat.grootte,
        lineHeight: `${maat.grootte}px`,
        letterSpacing: maat.spatiering,
        color: kleur,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Drie chevrons (">>>"). Elke chevron: punt linksboven, punt rechts in het
// midden, punt linksonder en een inkeping links in het midden.
export const Chevrons: React.FC<{
  maat: ChevronMaat;
  kleur: string;
  // per chevron (0..2): verschuiving in x en dekking
  stand?: (i: number) => { dx: number; opacity: number };
}> = ({ maat, kleur, stand }) => {
  const { x, y, hoogte, breedte, inkeping, stap } = maat;
  const marge = 40;
  const w = breedte + 2 * stap + 2 * marge;
  // svg op hele pixels plaatsen en de subpixel-rest in de coordinaten stoppen
  // (anders rondt de browser de positie van het svg-element af).
  const top = Math.floor(y);
  const oy = y - top;
  return (
    <svg
      width={w}
      height={hoogte + 2}
      viewBox={`0 ${-oy} ${w} ${hoogte + 2}`}
      style={{ position: "absolute", left: x - marge, top, overflow: "visible" }}
    >
      {[0, 1, 2].map((i) => {
        const s = stand ? stand(i) : { dx: 0, opacity: 1 };
        const x0 = marge + i * stap + s.dx;
        const pts = [
          [x0, 0],
          [x0 + breedte, hoogte / 2],
          [x0, hoogte],
          [x0 + inkeping, hoogte / 2],
        ]
          .map((p) => p.join(","))
          .join(" ");
        return <polygon key={i} points={pts} fill={kleur} opacity={s.opacity} />;
      })}
    </svg>
  );
};

// Icoontjes (24-raster, lijndikte 2,3; nagetekend naar de referentie), wit in een blauw rondje.
const ICOON_PADEN: Record<"datum" | "tijd" | "locatie", React.ReactNode> = {
  datum: (
    <>
      <rect x={4} y={5} width={16} height={16} rx={2.5} />
      <path d="M8 3v4M16 3v4M4 9.5h16" />
      <rect x={6.6} y={12} width={5.2} height={3.2} rx={1.2} fill="#ffffff" stroke="none" />
      <rect x={12.2} y={12} width={5.2} height={3.2} rx={1.2} fill="#ffffff" stroke="none" />
      <rect x={6.6} y={16.2} width={3.8} height={3} rx={1.2} fill="#ffffff" stroke="none" />
    </>
  ),
  tijd: (
    <>
      <circle cx={12} cy={12} r={9} />
      <path d="M12 7v5l3.5 3.5" />
    </>
  ),
  locatie: (
    <>
      <circle cx={12} cy={9.8} r={2.8} />
      <path d="M12 21.6c0 0 -6.6 -6.6 -6.6 -11.4a6.6 6.6 0 0 1 13.2 0c0 4.8 -6.6 11.4 -6.6 11.4z" />
    </>
  ),
};

export const Icoon: React.FC<{
  soort: keyof typeof ICOON_PADEN;
  cx: number;
  cy: number;
  diameter: number;
  glyph: number;
  kleur: string;
  schaal?: number;
  opacity?: number;
  glyphOpacity?: number;
}> = ({ soort, cx, cy, diameter, glyph, kleur, schaal = 1, opacity = 1, glyphOpacity = 1 }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: cx - diameter / 2,
        top: cy - diameter / 2,
        width: diameter,
        height: diameter,
        borderRadius: "50%",
        backgroundColor: kleur,
        transform: `scale(${schaal})`,
        opacity,
      }}
    >
      <svg
        width={glyph}
        height={glyph}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth={2.3}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: "absolute",
          left: (diameter - glyph) / 2,
          top: (diameter - glyph) / 2,
          opacity: glyphOpacity,
        }}
      >
        {ICOON_PADEN[soort]}
      </svg>
    </div>
  );
};
