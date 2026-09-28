// Alle maten en tijdlijnen van de eindbumper Zaterdag 1, gemeten aan de referentie:
// het laatste deel van zat1/aankondiging.mp4 (bumper = frames 262-459) en
// zat1/opstelling-v4.mp4 (bumper = frames 466-663). Beide bumpers zijn frame voor
// frame identiek (gemiddeld pixelverschil max 0,19 op 255, alleen compressieruis).
// Bumperframe 0 = aankondiging frame 262. Totaal 198 frames (6,6 s).
//
// Coördinaten: 1080 x 1920, continu (pixel i beslaat i..i+1).
// Tabellen zijn per frame gemeten; tussen twee frames wordt lineair geïnterpoleerd.

// --- Kleuren (gemiddelden over vlakke stukken, eindframe) ---
export const KLEUR = {
  // Achtergrond: overal rgb(253,253,253)
  achtergrond: "#fdfdfd",
  // Ring, halve schijf, cijfers en dagtekst: rgb(12,65,207)
  blauw: "#0c41cf",
  wit: "#fdfdfd",
  // Horizontale lijn (2 px): rgb(211,217,219)
  lijn: "#d3d9db",
  // Verticale hulplijnen naast de dag (3 px): donkerste kolom rgb(210,215,225)
  hulplijn: "#d2d7e1",
};

// --- Logo-geometrie (eindframe, subpixel gemeten langs stralen) ---
export const LOGO = {
  cx: 540,
  cy: 1060,
  // Blauwe ring: buitenrand 330, binnenrand 258,75
  ringBuiten: 330,
  ringBinnen: 258.75,
  // Binnenschijf (halve blauwe schijf en cijfervlak): straal 233,5
  schijf: 233.5,
  // Stippen links/rechts: wit 234..260 en 820..846 op de middenrij -> 293 van het midden, straal 13
  stipAfstand: 293,
  stipStraal: 13,
  // De W is het logo-onderdeel "W" (onderdelen.json, viewBox 512) geschaald met
  // 330 / 254,9 om (256,256). Gemeten W-kader 400..715 x 964..1196: klopt op 1 px.
  wSchaal: 330 / 254.9,
};

// --- Horizontale lijn: groeit lineair vanuit het midden, frame 0 -> 22 volle breedte ---
// Gemeten halve breedte: frame 1 = 26, frame 10 = 249, frame 21 = 516 (24,5 px/frame).
export const LIJN = { y: 1059, dikte: 2, eindFrame: 22 };

// --- Blauwe ring tekent zich rond vanaf 12 uur, met de klok mee ---
// Eindhoek in graden per frame (gemeten op straal 294, 0,25 graad nauwkeurig).
// Snelle aanloop (max 30,5 graad/frame rond frame 16) en een lange uitloop;
// de laatste spleet op 12 uur sluit pas rond frame 56.
export const RING_START = 12;
export const RING_HOEK = [
  0, 8.1, 28.4, 55.1, 84.9, 115.4, 145.1, 172.9, 198.4, 221.4, 241.6, 259.6,
  275.1, 288.4, 299.9, 309.9, 318.1, 325.1, 331.1, 335.9, 340.1, 343.6, 346.6,
  349.1, 350.9, 352.6, 353.9, 355.0, 355.9, 356.7, 357.3, 357.8, 358.3, 358.6,
  358.9, 359.2, 359.45, 359.6, 359.75, 359.85, 359.9, 359.95, 359.97, 359.99,
  360,
];

// --- Binnenkant van het logo verschijnt (frame 30-52) ---
// Eén curve e(t) voor: dekking van de W, dekking + schaal van de halve blauwe
// schijf (om het logomidden) en dekking van de witte binnenschijf (r 258,75) die
// de horizontale lijn binnen de ring wegneemt. Gemeten via de dekking van de W:
// 31: 0,06  34: 0,39  36: 0,60  40: 0,85  44: 0,95  52: 1. Schijfstraal volgt
// dezelfde curve (36: 138 px, 40: 196,5 px, 44: 221 px van 233,5).
export const BINNEN_START = 30;
export const BINNEN = [
  0, 0.058, 0.15, 0.269, 0.389, 0.495, 0.596, 0.68, 0.747, 0.804, 0.85, 0.884,
  0.908, 0.926, 0.947, 0.96, 0.968, 0.982, 0.987, 0.99, 0.995, 0.997, 1,
];

// --- Stippen: schalen op vanuit hun middelpunt ---
// Straal 44: 0,42  45: 0,78  46: 0,94  47: 1 -> ease-out cubic, start 43,4, 4 frames.
export const STIP = { start: 43.4, duur: 4 };

// --- Ringletters ---
// Letter: Arial Narrow Bold-achtig. De breedteverhoudingen van de letters
// (E/H 0,95, D/H 1,08, R/H 1,11, W/H 1,59, M/H 1,22) zijn die van Arial Bold;
// alles 0,82 smaller (H: breedte/kaphoogte 0,70). Dus Arimo 700 (metrisch gelijk
// aan Arial) horizontaal geschaald met 0,82. Kaphoogte 52,5 px -> 75,9 px letter.
// Boven "WV-HEDW" met 15,7 graad per teken (W op -47,1 ... W op +47,1),
// onder "AMSTERDAM" met 13,25 graad per letter (A op 233, M op 127), rechtop.
// Elke letter schuift radiaal van buiten naar binnen (60 px) en faded in, beide
// ease-out cubic over 9,5 frames. Start W: 36,95, daarna elke 2,18 frame een teken.
// Onder: start A 49,05, daarna elke 2,21 frame.
export const RINGTEKST = {
  lettergrootte: 75.9,
  smal: 0.82,
  kaphoogte: 52.5,
  // Lettermidden: boven op straal 292, onder op 293,5 (per letter gefit).
  straalBoven: 292,
  straalOnder: 293.5,
  boven: "WV-HEDW",
  bovenStap: 15.7,
  onder: "AMSTERDAM",
  onderStart: 233,
  onderStap: -13.25,
  schuif: 60,
  duur: 9.5,
  bovenBegin: 36.95,
  bovenInterval: 2.18,
  onderBegin: 49.05,
  onderInterval: 2.21,
  // Het streepje staat in de referentie 1,5 px verder naar buiten.
  streepjeExtra: 1.5,
};

// --- Cijferrol (frame 57-138) ---
// Het binnenvlak (halve blauwe schijf + teken) draait om de verticale as door het
// midden: breedte = |cos(hoek)|. Elke halve slag verschijnt een nieuw vlak:
// W, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 9, ..., 2, 1 (20 halve slagen = 3600 graden).
// Het blauwe halfvlak wisselt per vlak van kant (W links, 0 rechts, 9 links, ...,
// laatste 1 links). Teken wit op het blauwe deel, blauw op het witte deel.
// Hoek per frame gereconstrueerd uit de gemeten breedte van de blauwe halve ellips
// (daarna bijgesteld waar de render meer dan 0,01 in breedte afweek).
export const ROL_START = 57;
export const ROL_HOEK = [
  0.0, 16.9, 37.7, 68.4, 110.1, 163.1, 219.9, 284.3, 353.7, 417.7, 485.2, 549.0,
  618.8, 685.9, 752.2, 819.8, 889.0, 953.8, 1020.6, 1080.0, 1154.7, 1221.7,
  1287.9, 1356.0, 1424.4, 1489.0, 1555.8, 1629.0, 1688.8, 1754.9, 1819.1,
  1885.1, 1951.3, 2014.7, 2079.0, 2143.1, 2204.6, 2266.5, 2329.0, 2386.6,
  2445.9, 2504.4, 2559.4, 2616.0, 2669.9, 2721.2, 2773.6, 2823.5, 2873.7,
  2918.3, 2963.0, 3007.8, 3051.0, 3089.4, 3128.4, 3165.7, 3201.2, 3240.0,
  3266.4, 3295.6, 3323.5, 3351.2, 3376.4, 3400.9, 3429.0, 3440.2, 3459.4,
  3476.9, 3492.9, 3505.8, 3520.2, 3532.0, 3542.7, 3552.0, 3560.1, 3567.8,
  3574.4, 3579.8, 3585.8, 3589.0, 3593.7, 3600.0,
];
// Horizontale bewegingsblur van het vlak (Gauss-sigma in px, schermruimte),
// gefit op de vervaagde middenrand. Max ~28 bij ~67 graad/frame.
export const ROL_BLUR = [
  3.3, 5.4, 8.8, 12.3, 16.8, 22.3, 25.0, 26.9, 27.6, 27.7, 27.7, 28.4, 28.4,
  28.4, 28.4, 28.4, 28.4, 27.7, 27.7, 27.7, 28.2, 28.2, 28.2, 28.4, 27.8, 27.8,
  27.8, 27.6, 27.7, 27.7, 27.7, 27.3, 27.3, 27.3, 27.3, 26.9, 26.7, 26.0, 25.4,
  24.8, 24.8, 24.4, 24.1, 23.9, 23.0, 22.8, 21.1, 20.8, 20.5, 19.7, 19.4, 18.5,
  17.8, 17.4, 15.9, 15.1, 14.7, 14.7, 13.5, 12.6, 11.5, 10.7, 10.5, 10.5, 9.8,
  9.1, 7.9, 6.9, 5.1, 3.6, 3.5, 2.7, 2.6, 2.7, 3.1, 3.1, 2.5, 2.5, 2.5, 2.3,
  2.2, 1.8, 1.8, 0,
];
// Cijfers: Anton 400. "1" gemeten 492..582 x 923..1190 -> 310,5 px letter,
// tekstanker midden op x 540, basislijn 1190.
export const CIJFER = { grootte: 310.5, x: 540, basislijn: 1190 };

// --- Dagenrij boven het logo ---
// Big Shoulders 800, 91,8 px, letterafstand 8,2 px, basislijn 595,8: alle
// letterranden van MAANDAG (frame 54) en ZATERDAG (eind) binnen 1 px, kap 522..595.
// Woordmiddens op vaste afstand 620,19 px; MAANDAG begint op midden 536,2.
// Volgorde MA DI WO DO VR ZA ZO MA DI WO DO VR ZA ZO; landt op de tweede ZATERDAG
// (index 12) met midden 536,5. Verschuiving per frame gefit met een woordmodel
// (fout < 0,0001 per kolom): aanloop 57-62, ~156 px/frame tot 88, uitloop tot ~128.
export const DAG = {
  woorden: [
    "MAANDAG",
    "DINSDAG",
    "WOENSDAG",
    "DONDERDAG",
    "VRIJDAG",
    "ZATERDAG",
    "ZONDAG",
  ],
  aantal: 14,
  doel: 12,
  grootte: 91.8,
  letterafstand: 8.2,
  basislijn: 595.8,
  eersteMidden: 536.2,
  afstand: 620.19,
  // Masker: volledig zichtbaar binnen 281 px van het midden, lineair naar 0 aan de rand.
  maskerRand: 259,
  // Bewegingsblur: sigma = 0,205 x snelheid (px/frame), gefit.
  blurFactor: 0.205,
};
export const DAG_START = 54;
export const DAG_VERSCHUIVING = [
  0.2, 1.0, 6.2, 26.2, 69.0, 141.0, 244.2, 373.0, 520.2, 677.0, 833.0, 988.2,
  1143.0, 1302.2, 1457.0, 1613.0, 1768.2, 1929.0, 2084.2, 2239.0, 2396.2,
  2553.0, 2710.2, 2865.0, 3021.0, 3179.0, 3336.2, 3491.0, 3647.0, 3804.2,
  3961.0, 4114.2, 4269.0, 4426.2, 4578.2, 4729.0, 4880.2, 5028.2, 5174.2,
  5316.2, 5454.2, 5592.2, 5725.0, 5853.0, 5977.0, 6097.0, 6213.0, 6324.2,
  6427.0, 6527.0, 6621.0, 6710.2, 6791.0, 6868.2, 6939.0, 7005.0, 7065.0,
  7119.0, 7169.0, 7213.0, 7252.2, 7286.2, 7316.2, 7342.2, 7364.2, 7382.2,
  7397.0, 7410.2, 7419.0, 7426.2, 7432.2, 7436.2, 7438.2, 7440.2, 7441.0,
  7441.5, 7442.0,
];
// Dekking van de dagtekst (0..1, vóór het masker).
// Intro (alle woorden gelijk), frame 41 -> 54: faden in én schuiven omhoog.
// Gemeten op de linkerpoot van de M: piekdekking t.o.v. frame 52 en bovenkant.
export const DAG_INTRO_START = 41;
export const DAG_INTRO_NIVEAU = 0.51;
export const DAG_INTRO = [
  0.05, 0.2, 0.325, 0.47, 0.585, 0.675, 0.756, 0.82, 0.837, 0.878, 0.95, 1, 1,
  1,
];
// Verticale verschuiving omlaag (px) tijdens de intro: bovenkant 554 -> 522.
export const DAG_INTRO_Y = [32, 28, 22, 18, 14, 10, 8, 6, 4, 3, 2, 1, 0.5, 0];
// Tijdens het rollen 0,562; vanaf ~110 gaat ZATERDAG naar 1 en de rest naar 0.
export const DAG_ROL_DEKKING = 0.562;
export const DAG_FOCUS_START = 110;
// Per 2 frames: 110, 112, ..., 134.
export const DAG_FOCUS_MIDDEN = [
  0.572, 0.597, 0.646, 0.693, 0.727, 0.739, 0.77, 0.831, 0.854, 0.886, 0.924,
  0.969, 1,
];
export const DAG_FOCUS_ANDER = [
  0.562, 0.521, 0.486, 0.46, 0.411, 0.355, 0.289, 0.28, 0.197, 0.149, 0.113,
  0.048, 0,
];

// --- Verticale hulplijnen links en rechts van de dag ---
// x = 540 -/+ 161,25 (3 px breed). Twee stukken per kant: boven 482..520 en onder
// 600..638; daartussen (de tekstband) geen lijn. Het bovenstuk groeit omhoog vanaf
// 520, het onderstuk omlaag vanaf 600. Lengte per frame vanaf 38 (gemeten):
export const HULPLIJN = { dx: 161.25, breed: 3, boven: 520, onder: 600 };
export const HULPLIJN_START = 38;
export const HULPLIJN_LENGTE = [0, 8, 16, 24, 26, 29, 32, 34, 35, 36, 37, 38];
// Vooraf (frame 35-37) staat er kort een lijnstuk in de tekstband zelf (520..600),
// dekking 35: 0,05  36: 0,15  37: 0,29; op frame 38 is het weg.
export const HULPLIJN_BAND_START = 34;
export const HULPLIJN_BAND = [0, 0.05, 0.15, 0.29, 0];
// Dekking per frame vanaf 38.
export const HULPLIJN_DEKKING = [
  0.3, 0.5, 0.6, 0.87, 0.88, 0.9, 0.92, 0.95, 0.97, 0.99, 1,
];

// Na frame 143 staat alles stil tot het einde (frame 197). Geen zwart eindframe.
export const EINDBUMPER_LENGTE = 198;
