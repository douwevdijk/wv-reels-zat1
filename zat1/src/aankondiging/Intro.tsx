import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { Chevrons, Tekst, lineair, voortgang } from "./onderdelen";

// Intro van de reel (frame 0 t/m 91): wit scherm, WV-logo bovenin, "NEXT",
// blauwe balk met "MATCH", lijn en ">>> VIERDE DIVISIE A".
// Alles gemeten in aankondiging.mp4 (frame voor frame, template-tracking op
// frame 60 als eindstand) en gefit op de gedeelde easing EASE.

export const INTRO_FRAMES = 92;

// Posities (gemeten op frame 60)
const M = {
  // WV-logo: inkt x 464-617, y 176-327 -> vak 153 px, midden (539,5, 251,5)
  // (na template-uitlijning tegen frame 16-80)
  logo: { cx: 539.5, cy: 251.5, zijde: 153 },
  // Lijn: rijen 570-571, x 78-1001 (zelfde lijn als op de kaart)
  lijn: { x: 78, y: 570, breedte: 924, dikte: 2 },
  // "NEXT": Anton 234,75 px, spatiering -1,4 px, letters x 86-490, rijen 681-884
  next: { grootte: 234.75, spatiering: -1.4, x: 77.6, basislijn: 886, gewicht: 400 },
  // Blauwe balk: rijen 903-1139, volle breedte in eindstand
  balk: { y: 903, hoogte: 237 },
  // "MATCH": wit in de balk, letters x 86-669, rijen 917-1120
  match: { grootte: 234.75, spatiering: -1.4, x: 77.2, basislijn: 1121, gewicht: 400 },
  // Chevrons: x 104-182, rijen 1244-1293
  chevrons: { x: 104, y: 1244, hoogte: 50, breedte: 31, inkeping: 12.5, stap: 24 },
  // "VIERDE DIVISIE A": Big Shoulders 700, 57,75 px, spatiering 7,6 px, x 274-730, rijen 1244-1290
  label: { grootte: 57.75, spatiering: 7.6, x: 273, basislijn: 1290, gewicht: 700 },
};

// Timing (frames), gemeten:
const T = {
  // Logo: opkomen + 26 px zakken; alpha 0,06 (f1) .. 0,99 (f21)
  logo: { start: 0.5, duur: 24.6, dy: -26 },
  // NEXT: 90 px van links (dx -87 op f5, -42 op f10, -12 op f16) en opkomen
  next: { start: 4.6, duur: 27.1, dx: -90 },
  // Balk groeit vanaf de rechterrand: linkerrand 1050 (f13), 506 (f19), 94 (f28), 0 (f52)
  balk: { start: 12.8, duur: 31.2 },
  // MATCH schuift van rechts: linkerrand 468 (f22), 186 (f29), 104 (f37), 87 (f50);
  // wit komt lineair op tussen f21 en f33
  match: { start: 17.7, duur: 28.7, dx: 629, alphaVan: 21, alphaTot: 33 },
  // Lijn groeit naar rechts: rechterrand 124 (f35), 564 (f39), 910 (f45), 1000 (f59)
  lijn: { start: 34.6, duur: 22.3 },
  // Labeltekst komt op (f34,5, 22,6 fr)
  label: { start: 34.5, duur: 22.6 },
  // Chevrons een voor een van links (f41 / f46 / f51)
  chevrons: { start: 40.5, stap: 5, duur: 14, dx: -25 },
  // Uitgang vanaf f76: balk-rechterrand en MATCH lineair 67,5 px per frame naar
  // links (1013 f77 ... 607 f83 ... 67 f91); logo en label lineair weg in 16 fr.
  uit: { start: 76, snelheid: 67.5, vervaag: 16 },
};

// Dekking van de hele intro-laag. Gemeten: tot en met f83 volledig, f84 is een
// wit frame, f85-f91 komt de laag nog kort terug met dekking 0,09 .. 0,59
// (zo zit het in de referentie), vanaf f92 begint de kaart op wit.
const laagDekking = (f: number) => {
  if (f <= 83) {
    return 1;
  }
  if (f < 85) {
    return 0;
  }
  return Math.min(0.59, 0.09 + (f - 85) * (0.5 / 6));
};

export const Intro: React.FC<{ competitie: string }> = ({ competitie }) => {
  const f = useCurrentFrame();
  const uitT = Math.max(0, f - T.uit.start);
  const uitVerschuiving = uitT * T.uit.snelheid;
  const uitDekking = 1 - Math.min(1, uitT / T.uit.vervaag);

  const logo = voortgang(f, T.logo.start, T.logo.duur);
  const next = voortgang(f, T.next.start, T.next.duur);
  const balk = voortgang(f, T.balk.start, T.balk.duur);
  const matchX = voortgang(f, T.match.start, T.match.duur);
  const matchA = lineair(f, T.match.alphaVan, T.match.alphaTot);
  const lijn = voortgang(f, T.lijn.start, T.lijn.duur);
  const label = voortgang(f, T.label.start, T.label.duur);

  // Balk: groeit vanaf rechts (breedte 1080*E), krimpt bij de uitgang vanaf rechts.
  const balkLinks = 1080 * (1 - balk);
  const balkRechts = Math.max(0, 1080 - uitVerschuiving);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.white }}>
      <AbsoluteFill style={{ opacity: laagDekking(f) }}>
        <Img
          src={staticFile("logo/wv-hedw-blauw.svg")}
          style={{
            position: "absolute",
            left: M.logo.cx - M.logo.zijde / 2,
            top: M.logo.cy - M.logo.zijde / 2 + T.logo.dy * (1 - logo),
            width: M.logo.zijde,
            height: M.logo.zijde,
            opacity: logo * uitDekking,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: M.lijn.x,
            top: M.lijn.y,
            width: M.lijn.breedte * lijn,
            height: M.lijn.dikte,
            backgroundColor: colors.line,
          }}
        />
        <Tekst
          maat={M.next}
          font="anton"
          kleur={colors.blue}
          style={{ opacity: next, transform: `translateX(${T.next.dx * (1 - next)}px)` }}
        >
          NEXT
        </Tekst>
        <div
          style={{
            position: "absolute",
            left: balkLinks,
            top: M.balk.y,
            width: Math.max(0, balkRechts - balkLinks),
            height: M.balk.hoogte,
            backgroundColor: colors.blue,
          }}
        />
        <Tekst
          maat={M.match}
          font="anton"
          kleur={colors.white}
          style={{
            opacity: matchA,
            transform: `translateX(${T.match.dx * (1 - matchX) - uitVerschuiving}px)`,
          }}
        >
          MATCH
        </Tekst>
        <Chevrons
          maat={M.chevrons}
          kleur={colors.blue}
          stand={(i) => {
            const p = voortgang(f, T.chevrons.start + i * T.chevrons.stap, T.chevrons.duur);
            return { dx: T.chevrons.dx * (1 - p), opacity: p * uitDekking };
          }}
        />
        <Tekst maat={M.label} font="bs" kleur={colors.blue} style={{ opacity: label * uitDekking }}>
          {competitie}
        </Tekst>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
