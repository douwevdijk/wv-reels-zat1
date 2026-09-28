import React from "react";
import { interpolate } from "remotion";
import { KLEUR, type Indeling } from "./maten";
import type { Basisspeler, Wissel } from "./schema";
import { Tekst, voortgang } from "./onderdelen";
import {
  BANK_LABEL,
  EIND,
  GEDIMD,
  REGEL_IN,
  STAP,
  STAP_START,
  WISSEL_IN,
  WISSEL_STAP_NA,
  WISSEL_START,
} from "./tijden";

// Startframe van stap k (0..10 = basisspelers, 11 = eindshot).
export const stapStart = (k: number) => STAP_START + k * STAP;
export const EIND_START = stapStart(11);

// De 11 basisregels. frame null = eindshot (alles vol wit).
export const Basis: React.FC<{ basis: Basisspeler[]; ind: Indeling; frame: number | null }> = ({
  basis,
  ind,
  frame,
}) => {
  const { regels } = ind;
  const schaal = ind.breedte / 1080;
  // Na stap 11 lineair terug naar vol wit (12 frames).
  const opfris = voortgang(frame, EIND_START, EIND.opfris);
  return (
    <>
      {basis.map((s, k) => {
        const start = stapStart(k);
        const x = REGEL_IN.afstand * schaal * (1 - voortgang(frame, start, REGEL_IN.duur, REGEL_IN.easing));
        const inDekking = voortgang(
          frame,
          start + REGEL_IN.dekkingStart,
          REGEL_IN.dekkingDuur,
          REGEL_IN.dekkingEasing,
        );
        // Gedimd zodra de volgende speler start (binnen 1 frame).
        const gedimd = frame !== null && frame >= stapStart(k + 1) && k < 10;
        const dimNaam = gedimd ? interpolate(opfris, [0, 1], [GEDIMD.naam, 1]) : 1;
        const dimNummer = gedimd ? interpolate(opfris, [0, 1], [GEDIMD.nummer, 1]) : 1;
        const y = regels.y + k * regels.stap;
        if (inDekking <= 0) {
          return null;
        }
        return (
          <div
            key={`${s.nummer}-${k}`}
            style={{ position: "absolute", inset: 0, transform: `translateX(${x}px)`, opacity: inDekking }}
          >
            <Tekst
              maat={regels.nummer}
              font="anton"
              x={regels.nummerRechts}
              y={y}
              uitlijning="rechts"
              kleur={KLEUR.wit}
              dekking={dimNummer}
            >
              {String(s.nummer)}
            </Tekst>
            <Tekst
              maat={regels.naam}
              font="bs"
              x={regels.naamLinks}
              y={y + regels.naamDy}
              uitlijning="links"
              kleur={KLEUR.wit}
              dekking={dimNaam}
            >
              {s.naam}
            </Tekst>
          </div>
        );
      })}
    </>
  );
};

// Volgorde van de wissels op het scherm: linkerkolom = eerste helft (naar boven
// afgerond), rechterkolom = rest. Ze komen in leesvolgorde in beeld.
const bankIndeling = (bank: Wissel[]) => {
  const links = Math.ceil(bank.length / 2);
  return bank.map((w, i) => {
    const kolom = i < links ? 0 : 1;
    const rij = kolom === 0 ? i : i - links;
    return { w, kolom, rij, lees: rij * 2 + kolom };
  });
};

const wisselStart = (lees: number) =>
  lees < WISSEL_START.length
    ? WISSEL_START[lees]
    : WISSEL_START[WISSEL_START.length - 1] + (lees - WISSEL_START.length + 1) * WISSEL_STAP_NA;

export const Bank: React.FC<{ bank: Wissel[]; ind: Indeling; frame: number | null }> = ({
  bank,
  ind,
  frame,
}) => {
  const { bankLabel, bank: b } = ind;
  const schaal = ind.breedte / 1080;
  const start = EIND_START - BANK_LABEL.voorEind;
  const labelDekking = voortgang(frame, start, BANK_LABEL.duur, BANK_LABEL.easing);
  if (bank.length === 0) {
    return null;
  }
  return (
    <>
      <Tekst
        maat={bankLabel}
        font="bs"
        x={bankLabel.x}
        y={bankLabel.y}
        uitlijning="links"
        kleur={KLEUR.bankLabel}
        dekking={labelDekking}
      >
        BANK
      </Tekst>
      {bankIndeling(bank).map(({ w, kolom, rij, lees }) => {
        const s = start + wisselStart(lees);
        const dekking = voortgang(frame, s, WISSEL_IN.dekkingDuur, WISSEL_IN.dekkingEasing);
        const dy =
          WISSEL_IN.afstand *
          schaal *
          (1 - voortgang(frame, s + WISSEL_IN.start, WISSEL_IN.duur, WISSEL_IN.easing));
        const k = b.kolommen[kolom];
        const y = b.y + rij * b.stap;
        if (dekking <= 0) {
          return null;
        }
        return (
          <div
            key={`${w.nummer}-${lees}`}
            style={{ position: "absolute", inset: 0, transform: `translateY(${dy}px)`, opacity: dekking }}
          >
            <Tekst maat={b.nummer} font="anton" x={k.nummerRechts} y={y + b.nummerDy} uitlijning="rechts" kleur={KLEUR.bankNummer}>
              {String(w.nummer)}
            </Tekst>
            <Tekst maat={b.naam} font="bs" x={k.naamLinks} y={y} uitlijning="links" kleur={KLEUR.bankNaam}>
              {w.naam}
            </Tekst>
          </div>
        );
      })}
    </>
  );
};
