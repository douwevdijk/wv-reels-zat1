// Maten en kleuren van de line-up. Story/reel gemeten aan het eindshot van
// zat1/opstelling-v4.mp4 (frame 331-454, identiek aan opstelling-v4-story.jpg);
// post gemeten aan opstelling-v4-post.jpg (Drive, map zo-13-sep-hoofddorp).
// Alle y-waarden van tekst zijn de BOVENKANT VAN DE HOOFDLETTERS (kaphoogte),
// x-waarden de rand van de inkt. Fontgroottes zijn gefit op kaphoogte + breedte.

export type TekstMaat = {
  // px
  grootte: number;
  // letterspatiering in px
  spatie: number;
};

export type Indeling = {
  breedte: number;
  hoogte: number;
  achtergrond: AchtergrondMaat;
  logo: {
    // middelpunten van de logovakken
    thuisX: number;
    uitX: number;
    y: number;
    // diameter logovak
    maat: number;
  };
  teamLabel: TekstMaat & { y: number };
  vs: TekstMaat & { x: number; y: number };
  kop: TekstMaat & { lineX: number; upX: number; y: number; maskerOnder: number };
  regels: {
    y: number;
    stap: number;
    nummerRechts: number;
    naamLinks: number;
    // extra verschuiving (px) van de namen t.o.v. y (Chrome rondt de kaphoogte
    // per font anders af; gecorrigeerd op het verschilbeeld)
    naamDy: number;
    nummer: TekstMaat;
    naam: TekstMaat;
  };
  bankLabel: TekstMaat & { x: number; y: number };
  bank: {
    y: number;
    stap: number;
    kolommen: { nummerRechts: number; naamLinks: number }[];
    nummerDy: number;
    nummer: TekstMaat;
    naam: TekstMaat;
  };
  // Vak waarin de spelersfoto met object-fit: contain staat (onderkant fadet uit)
  foto: {
    links: number;
    boven: number;
    breedte: number;
    hoogte: number;
    // fade onderaan: [y, dekking]-punten (absolute y)
    fade: [number, number][];
  };
};

// Achtergrond: radiale gloed + diagonale lichtbanen + raster + donkere verloop-
// laag. Parametrisch model, gefit op het lege achtergrondframe (f0) van de
// referentie met kleinste kwadraten: rms-fout 1,2 op 255 over het hele beeld.
export type AchtergrondMaat = {
  gloed: { cx: number; cy: number; rx: number; ry: number; kleuren: string[] };
  // Banen: afwisselend licht/donker, periode horizontaal 346,7 px, helling
  // -0,25 (x schuift 0,25 px naar links per px omlaag), lichte baan begint op
  // x = fase bij y = 0. Additief (plus-lighter) +8/+8/+9.
  banen: { periode: number; fase: number; helling: number; kleur: string };
  // Raster 60 px, 1 px lijnen, additief +5, alleen in het midden (radiaal masker)
  raster: { stap: number; kleur: string; masker: string };
  // Donkere verlooplaag (normaal): kleur met dekking per y
  laag: { kleur: string; stops: [number, number][] };
};

export const KLEUR = {
  wit: "#ffffff",
  // "VS": rgb(113,146,236)
  vs: "#7192ec",
  // "BANK": rgb(148,171,240)
  bankLabel: "#94abf0",
  // Rugnummers bank: rgb(117,140,207)
  bankNummer: "#758ccf",
  // Namen bank: rgb(202,207,228)
  bankNaam: "#cacfe4",
};

// Tekstfonts: rugnummers, "LINE UP" en "VS" zijn Anton (de 1 heeft een voet),
// namen, teamnamen en "BANK" zijn Big Shoulders 800 (M met gesplitste middenpoot).
export const STORY: Indeling = {
  breedte: 1080,
  hoogte: 1920,
  achtergrond: {
    gloed: {
      cx: 560.1,
      cy: 666,
      rx: 828.3,
      ry: 977.8,
      // stops op 0/20/40/60/80/100 %
      kleuren: ["#205bec", "#1b50e1", "#1448d6", "#0e3bb5", "#082d92", "#031b57"],
    },
    banen: { periode: 346.7, fase: 345.4, helling: -0.25, kleur: "rgb(8,8,9)" },
    raster: {
      stap: 60,
      kleur: "rgb(5,5,5)",
      masker: "radial-gradient(ellipse 760px 700px at 540px 800px, #000 35%, transparent 100%)",
    },
    laag: {
      kleur: "1,14,50",
      stops: [
        [0, 0.327],
        [192, 0.201],
        [480, 0],
        [864, 0],
        [1152, 0.019],
        [1344, 0.266],
        [1536, 0.47],
        [1728, 0.76],
        [1920, 1],
      ],
    },
  },
  // Logo's: linker- en bovenrand (schaduwvrij) 267 / 74, straal ~83,5.
  logo: { thuisX: 349, uitX: 728, y: 158, maat: 167 },
  // Teamnamen: kap 263-287 (25 px), HOOFDDORP 265-431, WV-HEDW 654-798.
  teamLabel: { grootte: 30.25, spatie: 4.2, y: 264 },
  // "VS": inkt 509-569 x 127-185, Anton 68,5.
  vs: { grootte: 68.5, spatie: 0, x: 540.5, y: 128 },
  // "LINE UP": kap 373-475 (103 px), LINE 524-698, UP 740-845, Anton 118,5.
  // Het rolmasker ligt op y 484 (onderkant van de letters tijdens het rollen).
  kop: { grootte: 118.5, spatie: 0, lineX: 519.5, upX: 735.5, y: 374, maskerOnder: 484 },
  // Basis: kap 551 + 68 k (39 px), nummers rechts uitgelijnd op 603, namen vanaf 619.
  regels: {
    y: 552,
    stap: 68,
    nummerRechts: 604.5,
    naamLinks: 619,
    naamDy: 1,
    nummer: { grootte: 45, spatie: 0 },
    naam: { grootte: 45, spatie: -0.6 },
  },
  // "BANK": inkt 79-152 x 1517-1539.
  bankLabel: { grootte: 28.5, spatie: 5.75, x: 79, y: 1517 },
  // Wissels: kap 1572 + 71,33 k (33 px), kolom 1 nummers tot 137 / namen vanaf 154,
  // kolom 2 nummers tot 627 / namen vanaf 643.
  bank: {
    y: 1573,
    stap: 71.33,
    kolommen: [
      { nummerRechts: 138, naamLinks: 152.5 },
      { nummerRechts: 628, naamLinks: 642 },
    ],
    nummerDy: -1.5,
    nummer: { grootte: 40, spatie: 0 },
    naam: { grootte: 40.5, spatie: -1.05 },
  },
  // Foto's: kruin op y 380 bij alle spelers; onderkant fadet uit tussen
  // y 1370 en 1540 (gemeten over 11 spelers).
  foto: {
    links: 0,
    boven: 378,
    breedte: 505,
    hoogte: 1167,
    fade: [
      [1370, 1],
      [1418, 0.5],
      [1470, 0.2],
      [1525, 0.05],
      [1540, 0],
    ],
  },
};

// Post 1080x1350: 4:5-herschikking van het eindshot, gemeten aan
// opstelling-v4-post.jpg. Achtergrond: zelfde model als de story; banen en
// raster op dezelfde pixels (randen gemeten op y 200 en 1030: identiek), gloed en
// donkere laag verticaal geschaald met 1350/1920 (gefit op de post: middelpunt
// y 468, straal y 684, laagstops op dezelfde relatieve hoogtes; rms 0,9).
// Kop, logo's en lijst geschaald rond 0,78-0,82, bank 0,72, foto 0,73.
const PY = 1350 / 1920;
export const POST: Indeling = {
  breedte: 1080,
  hoogte: 1350,
  achtergrond: {
    ...STORY.achtergrond,
    gloed: { ...STORY.achtergrond.gloed, cy: 468, ry: 684 },
    raster: {
      ...STORY.achtergrond.raster,
      masker: "radial-gradient(ellipse 760px 492px at 540px 562px, #000 35%, transparent 100%)",
    },
    laag: {
      ...STORY.achtergrond.laag,
      stops: STORY.achtergrond.laag.stops.map(([y, a]) => [y * PY, a] as [number, number]),
    },
  },
  // Hoofddorp-logo inkt 325-455 x 57-186 (131 px); middelpunten 390 / 686.
  logo: { thuisX: 390, uitX: 686, y: 121.5, maat: 131 },
  // Teamnamen: kap 209-229, HOOFDDORP 314-463, WV-HEDW 621-750 (bs800 25,25 / spatie 5).
  teamLabel: { grootte: 25.25, spatie: 5, y: 210 },
  // "VS": inkt 516-563 x 98-143.
  vs: { grootte: 53.4, spatie: 0, x: 539.5, y: 98 },
  // "LINE UP": kap 287-367, LINE vanaf 453, UP vanaf 621.
  kop: { grootte: 93.2, spatie: 0, lineX: 449.5, upX: 617.5, y: 287, maskerOnder: 376 },
  // Basis: kap 414 + 54 k, nummers tot 519, namen vanaf 535 (breedte x 0,82).
  regels: {
    y: 416.5,
    stap: 54,
    nummerRechts: 520,
    naamLinks: 535,
    naamDy: 0,
    nummer: { grootte: 36.9, spatie: 0 },
    naam: { grootte: 36.9, spatie: -0.5 },
  },
  // "BANK": inkt 79-134 x 1079-1094.
  bankLabel: { grootte: 20, spatie: 5, x: 79, y: 1079 },
  // Wissels: kap 1119 + 49 k (24 px), kolom 1 nummers tot 117 / namen vanaf 129,
  // kolom 2 nummers tot 598 / namen vanaf 609.
  bank: {
    y: 1121,
    stap: 49,
    kolommen: [
      { nummerRechts: 118, naamLinks: 128.5 },
      { nummerRechts: 599, naamLinks: 609 },
    ],
    nummerDy: -1.5,
    nummer: { grootte: 29, spatie: 0 },
    naam: { grootte: 27.5, spatie: -0.75 },
  },
  // Foto: story-vak x 0,69 (kruin-knie 904 -> 628 px, breedte huid 285 -> 195 px);
  // kruin op y 301, linkerarm op x 97.
  foto: {
    links: 37.7,
    boven: 299,
    breedte: 348.5,
    hoogte: 805,
    fade: STORY.foto.fade.map(
      ([y, a]) => [299 + (y - STORY.foto.boven) * 0.69, a] as [number, number],
    ),
  },
};
