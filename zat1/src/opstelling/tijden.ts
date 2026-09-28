import { Easing } from "remotion";

// Tijdlijn van de line-up, frame voor frame gemeten aan zat1/opstelling-v4.mp4
// (1080x1920, 30 fps). Alle waarden in frames. Easing-curves zijn gefit op de
// gemeten posities/dekking per frame (rms-fout tussen haakjes).
//
// Grof verloop referentie:
//   f0-f5      alleen achtergrond
//   f5-f35     logo thuis schuift van links in, f10-f40 logo uit van rechts
//   f6 / f13   "LINE" / "UP" rollen omhoog uit een masker (spring)
//   f22-f46    "VS" fade in
//   f30+26k    basisspeler k (k = 0..10) komt in beeld, met foto
//   f306       "BANK" + wissels (gestaffeld)
//   f316-f330  alle regels weer fel, crossfade naar de uitgelichte speler
//   f331-f454  eindshot staat stil
//   f454-f464  lineaire overgang naar egaal blauw (#0c41cf), f465 egaal blauw
//   f466       harde knip naar de eindbumper (bumperframe 0 = wit)

// --- Kop ---
// Logo thuis: x-verschuiving -471 px -> 0, start f5, 30 frames,
// bezier(0.2, 1, 0.3, 1) (rms 1,3 px). Logo uit: +471 px, 5 frames later.
export const LOGO_IN = {
  afstand: 471,
  startThuis: 5,
  startUit: 10,
  duur: 30,
  easing: Easing.bezier(0.2, 1, 0.3, 1),
};

// Gloed achter elk logo (witte radiale halo, straal 148 px): stijgt in 8 frames
// lineair naar 1, blijft 1,5 frame, zakt dan in 36 frames als (1 - t)^2 naar 0.
// Gemeten in de ring r 118-142 px aan de buitenkant van elk logo: piek f32-f35
// (thuis) en f45-f48 (uit), weg rond f70 / f83.
export const GLOED = { thuis: 23.5, uit: 37, op: 8, vast: 1.5, af: 36 };

// "VS": alleen dekking 0 -> 1, start f22,5, 24 frames, bezier(0.3, 0.7, 0.3, 1) (rms 0,006).
export const VS_IN = { start: 22.5, duur: 24, easing: Easing.bezier(0.3, 0.7, 0.3, 1) };

// "LINE" en "UP": elk woord schuift 120 px omhoog uit een masker dat vlak onder
// de letters ligt. Remotion-spring stiffness 60, damping 12, mass 1 (schiet ~3 px
// door en zakt terug; rms 0,7 px). LINE start f6, UP start f13.
export const KOP_IN = {
  afstand: 120,
  startLine: 6,
  startUp: 13,
  spring: { stiffness: 60, damping: 12, mass: 1 },
};

// --- Basisspelers ---
// Speler k (0..10) start op STAP_START + k * STAP.
export const STAP_START = 30;
export const STAP = 26;

// Regel: schuift 165 px van rechts in, 24 frames, bezier(0.3, 1, 0.3, 1) (rms 0,4 px);
// dekking vanaf +0,5 frame, 22 frames, bezier(0.3, 0.9, 0.2, 1) (rms 0,005).
export const REGEL_IN = {
  afstand: 165,
  duur: 24,
  easing: Easing.bezier(0.3, 1, 0.3, 1),
  dekkingStart: 0.5,
  dekkingDuur: 22,
  dekkingEasing: Easing.bezier(0.3, 0.9, 0.2, 1),
};

// Zodra de volgende speler start, dimmen alle vorige regels in 1 frame:
// naam naar dekking 0,68, rugnummer naar 0,31 (gemeten per kleurkanaal t.o.v.
// het eindshot, 10 regels).
export const GEDIMD = { naam: 0.68, nummer: 0.31 };

// Foto van speler k: schuift 70 px omhoog in, start +0,5, 28 frames,
// bezier(0.3, 1, 0.3, 1) (rms 0,2 px); dekking start +0, 20 frames,
// bezier(0.3, 0.4, 0.2, 1) (rms 0,007). Nieuwe foto ligt boven de vorige.
export const FOTO_IN = {
  afstand: 70,
  start: 0.5,
  duur: 28,
  easing: Easing.bezier(0.3, 1, 0.3, 1),
  dekkingStart: 0,
  dekkingDuur: 20,
  dekkingEasing: Easing.bezier(0.3, 0.4, 0.2, 1),
};
// Vorige foto: blijft staan en fadet uit vanaf -0,5, 12 frames, bezier(0.2, 0, 0.3, 1).
export const FOTO_UIT = { start: -0.5, duur: 12, easing: Easing.bezier(0.2, 0, 0.3, 1) };

// --- Eindshot ---
// Op stap 11 (f316): alle regels lineair terug naar vol wit in 12 frames, en een
// crossfade van 14 frames naar de uitgelichte speler: de laatste foto ligt
// bovenop en gaat lineair 1 -> 0, de uitgelichte foto eronder lineair 0 -> 1.
export const EIND = { opfris: 12, crossfade: 14 };

// --- Bank --- (hermeten met achtergrondaftrek, regressie per wissel)
// "BANK": alleen dekking, start 13,5 frames voor stap 11 (f302,5), 28 frames,
// bezier(0.3, 0.8, 0.2, 1) (rms 0,007).
export const BANK_LABEL = { voorEind: 13.5, duur: 28, easing: Easing.bezier(0.3, 0.8, 0.2, 1) };
// Wissels in leesvolgorde (links, rechts, links, ...), start t.o.v. het label:
// 0 / 1,8 / 4,5 / 7,5 / 10,5 / 13,5 / 16,5; daarna +3 per wissel.
// Dekking: 18 frames, bezier(0.3, 0, 0.1, 1) (rms 0,007). Beweging: 18,4 px
// omhoog, start +2,5, 16 frames, bezier(0.3, 0.4, 0.2, 1) (rms 0,3 px).
export const WISSEL_START = [0, 1.8, 4.5, 7.5, 10.5, 13.5, 16.5];
export const WISSEL_STAP_NA = 3;
export const WISSEL_IN = {
  afstand: 18.4,
  start: 2.5,
  duur: 16,
  easing: Easing.bezier(0.3, 0.4, 0.2, 1),
  dekkingDuur: 18,
  dekkingEasing: Easing.bezier(0.3, 0, 0.1, 1),
};

// --- Uitgang ---
// Eindshot staat stil tot f454; f454 -> f464 lineair naar egaal #0c41cf; f465 egaal.
export const UITGANG = { stil: 124, overgang: 10, egaal: 2, kleur: "#0c41cf" };
