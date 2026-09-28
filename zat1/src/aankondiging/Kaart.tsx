import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors } from "../theme";
import { MATEN, STROOK_LIJN, type Formaat, type KaartMaten } from "./maten";
import { Chevrons, Icoon, Tekst, lineair, voortgang } from "./onderdelen";
import type { Foto, Wedstrijd } from "./schema";

export type FotoAfmeting = { breedte: number; hoogte: number };

// Animatie van de kaart in de reel. Frames relatief aan het begin van de kaart
// (in aankondiging.mp4 is dat frame 92). Gemeten per frame in de referentie en
// gefit op de gedeelde easing (EASE); tussen haakjes de absolute frames.
export const KAART_TIJD = {
  // Blauw vlak groeit van boven naar beneden: onderrand = min(h, schuine rand),
  // h = kopRechts * E. Gemeten h: 17, 59, 113, 171, ... 499 (f104), 608 (f128).
  kop: { start: 0.76, duur: 30.2 },
  // "VIERDE DIVISIE A": schuift 50 px van links in en komt op (f100,5, 22,4 fr).
  competitie: { start: 8.5, duur: 22.4, dx: -50 },
  // "NEXT MATCH": 63 px van links (f105, 21,5 fr).
  nextMatch: { start: 13, duur: 21.5, dx: -63 },
  // Chevrons een voor een, elk ~30 px van links (f108,5 / 113 / 118).
  chevrons: { start: 16.5, stap: 4.75, duur: 16, dx: -30 },
  // "SPEELRONDE 4": alleen opkomen (f120,6, 21,9 fr).
  speelronde: { start: 28.6, duur: 21.9 },
  // Foto wordt van boven naar beneden onthuld: onderrand = kopLinks + (fotoOnder - kopLinks) * E
  // (gemeten 549 (f107) ... 1339 (f146); start f106,9, duur 34,1).
  // Bij meer foto's komt elke strook fotoStap frames later.
  foto: { start: 14.6, duur: 34.1, stap: 6 },
  // Inforegels, 7 frames na elkaar (f126,5 / 133,5 / 140,5): tekst 34 px van rechts
  // en opkomen in 22 fr; rondje groeit lineair in ~4 fr; icoontje komt daarna op.
  rij: { start: 34.5, stap: 7, duur: 22.2, dx: 34, rondjeVan: 35.3, rondjeTot: 39.1, glyphStart: 38, glyphDuur: 14 },
  // Thuisploeg (logo + naam) komt op vanaf f150,5 (22 fr).
  thuis: { start: 58.5, duur: 22 },
  // Uitploeg, streepje en hoekdriehoek vanaf f158,5 (22 fr); de lijn komt
  // lineair op tussen f158,5 en f167.
  uit: { start: 66.5, duur: 22 },
  lijn: { van: 66.5, tot: 75 },
} as const;

// Duur van de kaart in de reel (f92 t/m f261, daarna harde knip naar de bumper).
export const KAART_FRAMES = 170;

const Logo: React.FC<{
  src: string;
  vak: number;
  schaal: number;
  cx: number;
  cy: number;
  opacity: number;
}> = ({ src, vak, schaal, cx, cy, opacity }) => {
  const zijde = vak * schaal;
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        left: cx - zijde / 2,
        top: cy - zijde / 2,
        width: zijde,
        height: zijde,
        objectFit: "contain",
        opacity,
      }}
    />
  );
};

// Plaatsing van een foto (cover) in een vak, met het focuspunt zo dicht
// mogelijk bij het midden van het vak.
const coverMetFocus = (
  vakB: number,
  vakH: number,
  foto: Foto,
  afm: FotoAfmeting | undefined,
): React.CSSProperties => {
  if (!afm) {
    return {
      width: vakB,
      height: vakH,
      objectFit: "cover",
      objectPosition: `${foto.focus.x * 100}% ${foto.focus.y * 100}%`,
    };
  }
  const s = Math.max(vakB / afm.breedte, vakH / afm.hoogte);
  const b = afm.breedte * s;
  const h = afm.hoogte * s;
  const left = Math.min(0, Math.max(vakB - b, vakB / 2 - foto.focus.x * b));
  const top = Math.min(0, Math.max(vakH - h, vakH / 2 - foto.focus.y * h));
  return { position: "absolute", left, top, width: b, height: h, maxWidth: "none" };
};

// Fotoband: 1 foto over de volle breedte, of 2/3 schuine stroken met een witte
// lijn ertussen. De scheidingslijnen staan loodrecht op de schuine bovenrand
// (dus dezelfde hoek, gedraaid naar de staande richting).
const FotoBand: React.FC<{
  m: KaartMaten;
  map: string;
  fotos: Foto[];
  afmetingen: FotoAfmeting[];
  frame: number | null;
}> = ({ m, map, fotos, afmetingen, frame }) => {
  const n = fotos.length;
  const boven = m.fotoBoven;
  const onder = m.fotoOnder;
  const hoogte = onder - boven;
  const helling = (m.kopRechts - m.kopLinks) / m.breedte;
  // Middenhoogte van het zichtbare deel (onder de schuine rand)
  const yMidden = ((m.kopLinks + m.kopRechts) / 2 + onder) / 2;
  // x van scheidingslijn i (1..n-1) op hoogte y (pagina-coordinaten)
  const lijnX = (i: number, y: number) => (i * m.breedte) / n - helling * (y - yMidden);
  const halveLijn = (STROOK_LIJN / 2) * Math.sqrt(1 + helling * helling);

  return (
    <>
      {fotos.map((foto, j) => {
        const t = KAART_TIJD.foto;
        const p = voortgang(frame, t.start + j * t.stap, t.duur);
        // Voor de start niets tonen (anders piept de strook boven de schuine rand uit)
        const zichtbaarTot = p > 0 ? m.kopLinks + (onder - m.kopLinks) * p : 0;
        // Strookgrenzen op boven- en onderrand
        const lb = j === 0 ? 0 : lijnX(j, boven) + halveLijn;
        const lo = j === 0 ? 0 : lijnX(j, onder) + halveLijn;
        const rb = j === n - 1 ? m.breedte : lijnX(j + 1, boven) - halveLijn;
        const ro = j === n - 1 ? m.breedte : lijnX(j + 1, onder) - halveLijn;
        const x0 = Math.floor(Math.min(lb, lo));
        const x1 = Math.ceil(Math.max(rb, ro));
        const b = x1 - x0;
        const clip =
          n === 1
            ? undefined
            : `polygon(${lb - x0}px 0px, ${rb - x0}px 0px, ${ro - x0}px ${hoogte}px, ${lo - x0}px ${hoogte}px)`;
        return (
          <div
            key={j}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: m.breedte,
              height: Math.max(0, zichtbaarTot),
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: x0,
                top: boven,
                width: b,
                height: hoogte,
                overflow: "hidden",
                clipPath: clip,
              }}
            >
              <Img
                src={staticFile(`wedstrijden/${map}/${foto.bestand}`)}
                style={coverMetFocus(b, hoogte, foto, afmetingen[j])}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

export const Kaart: React.FC<{
  formaat: Formaat;
  wedstrijd: Wedstrijd;
  map: string;
  fotoAfmetingen: FotoAfmeting[];
  // Frame binnen de kaartanimatie; null of weglaten = eindstand (stills).
  frame?: number | null;
}> = ({ formaat, wedstrijd, map, fotoAfmetingen, frame = null }) => {
  const m = MATEN[formaat];
  const T = KAART_TIJD;

  const kop = voortgang(frame, T.kop.start, T.kop.duur);
  const kopH = m.kopRechts * kop;
  const comp = voortgang(frame, T.competitie.start, T.competitie.duur);
  const nm = voortgang(frame, T.nextMatch.start, T.nextMatch.duur);
  const sr = voortgang(frame, T.speelronde.start, T.speelronde.duur);
  const thuis = voortgang(frame, T.thuis.start, T.thuis.duur);
  const uit = voortgang(frame, T.uit.start, T.uit.duur);
  const lijn = lineair(frame, T.lijn.van, T.lijn.tot);

  const rijen = [
    { soort: "datum" as const, regels: [{ maat: m.datum, tekst: wedstrijd.datum }] },
    { soort: "tijd" as const, regels: [{ maat: m.tijd, tekst: wedstrijd.tijd }] },
    {
      soort: "locatie" as const,
      regels: [
        { maat: m.locatie, tekst: wedstrijd.locatie },
        { maat: m.plaats, tekst: wedstrijd.plaats },
      ],
    },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: colors.white, overflow: "hidden" }}>
      <FotoBand
        m={m}
        map={map}
        fotos={wedstrijd.fotos}
        afmetingen={fotoAfmetingen}
        frame={frame}
      />

      {/* Blauw vlak met schuine onderrand, onthuld van boven naar beneden */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: m.breedte,
          height: kopH,
          overflow: "hidden",
        }}
      >
        <svg
          width={m.breedte}
          height={m.kopRechts}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <polygon
            points={`0,0 ${m.breedte},0 ${m.breedte},${m.kopRechts} 0,${m.kopLinks}`}
            fill={colors.blue}
          />
        </svg>
      </div>

      <Tekst
        maat={m.competitie}
        font="bs"
        kleur={colors.white}
        style={{
          opacity: comp,
          transform: `translateX(${T.competitie.dx * (1 - comp)}px)`,
        }}
      >
        {wedstrijd.competitie}
      </Tekst>
      <Tekst
        maat={m.nextMatch}
        font="anton"
        kleur={colors.white}
        style={{
          opacity: nm,
          transform: `translateX(${T.nextMatch.dx * (1 - nm)}px)`,
        }}
      >
        NEXT MATCH
      </Tekst>
      <Chevrons
        maat={m.chevrons}
        kleur={colors.white}
        stand={(i) => {
          const p = voortgang(frame, T.chevrons.start + i * T.chevrons.stap, T.chevrons.duur);
          return { dx: T.chevrons.dx * (1 - p), opacity: p };
        }}
      />
      <Tekst maat={m.speelronde} font="bs" kleur={colors.white} style={{ opacity: sr }}>
        {wedstrijd.speelronde}
      </Tekst>

      {rijen.map((rij, i) => {
        const t = T.rij;
        const p = voortgang(frame, t.start + i * t.stap, t.duur);
        const rondje = lineair(frame, t.rondjeVan + i * t.stap, t.rondjeTot + i * t.stap);
        const glyph = voortgang(frame, t.glyphStart + i * t.stap, t.glyphDuur);
        return (
          <React.Fragment key={rij.soort}>
            <Icoon
              soort={rij.soort}
              cx={m.icoonX}
              cy={m.icoonY[i]}
              diameter={m.icoonDiameter}
              glyph={m.icoonGlyph}
              kleur={colors.blue}
              schaal={rondje}
              opacity={p}
              glyphOpacity={glyph}
            />
            {rij.regels.map((r) => (
              <Tekst
                key={r.tekst}
                maat={r.maat}
                font="bs"
                kleur={colors.blue}
                style={{ opacity: p, transform: `translateX(${t.dx * (1 - p)}px)` }}
              >
                {r.tekst}
              </Tekst>
            ))}
          </React.Fragment>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: m.lijnX,
          top: m.lijnY,
          width: m.lijnBreedte,
          height: m.lijnDikte,
          backgroundColor: colors.line,
          opacity: lijn,
        }}
      />

      {/* Logo-rij: vaste vakken, naam exact gecentreerd onder het logomidden */}
      <Logo
        src={wedstrijd.thuis.logo}
        vak={m.logoVak}
        schaal={wedstrijd.thuis.logoSchaal}
        cx={m.logoThuisX}
        cy={m.logoMiddenY}
        opacity={thuis}
      />
      <Tekst maat={m.naam} font="bs" kleur={colors.ink} midden={m.logoThuisX} style={{ opacity: thuis }}>
        {wedstrijd.thuis.label}
      </Tekst>
      <div
        style={{
          position: "absolute",
          left: m.streepje.x,
          top: m.streepje.y,
          width: m.streepje.breedte,
          height: m.streepje.hoogte,
          backgroundColor: colors.dash,
          opacity: uit,
        }}
      />
      <Logo
        src={wedstrijd.uit.logo}
        vak={m.logoVak}
        schaal={wedstrijd.uit.logoSchaal}
        cx={m.logoUitX}
        cy={m.logoMiddenY}
        opacity={uit}
      />
      <Tekst maat={m.naam} font="bs" kleur={colors.ink} midden={m.logoUitX} style={{ opacity: uit }}>
        {wedstrijd.uit.label}
      </Tekst>

      <svg
        width={m.breedte}
        height={m.hoogte}
        style={{ position: "absolute", left: 0, top: 0, opacity: uit }}
      >
        <polygon
          points={`${m.breedte},${m.driehoekBoven} ${m.breedte},${m.hoogte} ${m.driehoekLinks},${m.hoogte}`}
          fill={colors.blue}
        />
      </svg>
    </AbsoluteFill>
  );
};
