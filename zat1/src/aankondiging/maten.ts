// Maten van de eindkaart per formaat.
//
// Alle waarden zijn gemeten in de referenties zat1/kaart-story.jpg (1080x1920)
// en zat1/kaart-post.jpg (1080x1350). Tekstmaten zijn bepaald door de
// letterposities (linker- en rechterrand van elke letter) te fitten met de
// echte fontbestanden (harfbuzz): fontgrootte, letterspatiering en pen-x.
// "basislijn" is de onderrand van de platte letters (eerste lege pixelrij).

export type Formaat = "story" | "post";

export type TekstMaat = {
  // fontgrootte in px
  grootte: number;
  // letterspatiering in px
  spatiering: number;
  // pen-x (begin van de eerste letter incl. zijdrager)
  x: number;
  // basislijn (y)
  basislijn: number;
  gewicht: number;
};

export type ChevronMaat = {
  // linkerpunt van de eerste chevron
  x: number;
  // bovenkant (punt linksboven)
  y: number;
  // hoogte van een chevron
  hoogte: number;
  // breedte (linkerpunt tot rechterpunt)
  breedte: number;
  // diepte van de inkeping aan de linkerkant
  inkeping: number;
  // afstand tussen twee chevrons
  stap: number;
};

export type KaartMaten = {
  breedte: number;
  hoogte: number;
  // Blauw vlak bovenin: rechthoek met schuine onderrand van (0,kopLinks) naar (1080,kopRechts)
  kopLinks: number;
  kopRechts: number;
  competitie: TekstMaat;
  nextMatch: TekstMaat;
  chevrons: ChevronMaat;
  speelronde: TekstMaat;
  // Fotovak: volle breedte, van fotoBoven tot fotoOnder (object-fit cover)
  fotoBoven: number;
  fotoOnder: number;
  // Icoonrondjes
  icoonX: number;
  icoonDiameter: number;
  icoonGlyph: number;
  icoonY: [number, number, number];
  datum: TekstMaat;
  tijd: TekstMaat;
  locatie: TekstMaat;
  plaats: TekstMaat;
  // Scheidingslijn boven de logo's
  lijnY: number;
  lijnX: number;
  lijnBreedte: number;
  lijnDikte: number;
  // Logo-rij
  logoVak: number;
  logoMiddenY: number;
  logoThuisX: number;
  logoUitX: number;
  streepje: { x: number; y: number; breedte: number; hoogte: number };
  naam: Omit<TekstMaat, "x">;
  // Hoekdriehoek rechtsonder: (1080,driehoekBoven) - (1080,hoogte) - (driehoekLinks,hoogte)
  driehoekBoven: number;
  driehoekLinks: number;
};

export const MATEN: Record<Formaat, KaartMaten> = {
  story: {
    breedte: 1080,
    hoogte: 1920,
    // Onderrand blauw vlak: x=0 -> y=500, x=1080 -> y=608 (helling 0,1).
    kopLinks: 500,
    kopRechts: 608,
    // "VIERDE DIVISIE A": Big Shoulders 600, 45,5 px, spatiering 11,2 px,
    // letters x 80-506, rijen 131-167 (500 / 47,25 px getest: slechter).
    competitie: { grootte: 45.5, spatiering: 11.2, x: 78.04, basislijn: 168, gewicht: 600 },
    // "NEXT MATCH": Anton 131,75 px, spatiering 0, letters x 83-681, rijen 197-312.
    nextMatch: { grootte: 131.75, spatiering: 0.1, x: 78.1, basislijn: 313, gewicht: 400 },
    // Chevrons: x 105-186, rijen 391-439, drie stuks met stap 25.
    chevrons: { x: 105, y: 391.5, hoogte: 49, breedte: 32, inkeping: 12.5, stap: 25 },
    // "SPEELRONDE 4": Big Shoulders 600, 54 px, spatiering 9,0 px, x 280-652, rijen 393-437.
    speelronde: { grootte: 54, spatiering: 9.0, x: 277.97, basislijn: 438, gewicht: 600 },
    // Foto: onderrand y=1340. Bovenrand 473 (verborgen onder het blauwe vlak):
    // hiermee staat de foto zowel in story (hoogte past) als in post (breedte past)
    // precies in het midden, wat beide referenties exact verklaart.
    fotoBoven: 473,
    fotoOnder: 1340,
    // Rondjes: x 78-145 (diameter 68), midden y 1404 / 1488 / 1572 (stap 84).
    icoonX: 112,
    icoonDiameter: 68,
    // Icoontjes op een 24-raster, 34 px groot (kalender 26x28, klok 28x28, pin 23x30 inkt).
    icoonGlyph: 34,
    icoonY: [1404, 1488, 1572],
    // Info: Big Shoulders 700, gefit op letterposities + kaphoogte (45,35 subpixel).
    // "ZATERDAG 19 SEPTEMBER" x 185-729 rijen 1380-1425; "14:30 UUR" rijen 1464-1509.
    // Basislijn 1 px lager opgegeven dan gemeten: Chrome rondt bij 56 px naar boven af.
    datum: { grootte: 56, spatiering: 2.0, x: 183.95, basislijn: 1427, gewicht: 700 },
    tijd: { grootte: 56, spatiering: 2.0, x: 183.95, basislijn: 1511, gewicht: 700 },
    // "SPORTPARK MIDDENMEER" rijen 1536-1571, "AMSTERDAM" rijen 1578-1613.
    locatie: { grootte: 44.25, spatiering: 1.9, x: 183.7, basislijn: 1572, gewicht: 700 },
    plaats: { grootte: 44.25, spatiering: 1.9, x: 183.7, basislijn: 1614, gewicht: 700 },
    // Lijn: rijen 1623-1624 (2 px), x 78-1002, kleur #d7dae3.
    lijnY: 1623,
    lijnX: 78,
    lijnBreedte: 924,
    lijnDikte: 2,
    // Logo's: WV-logo 190x190 (x 218-407, y 1655-1844), midden (313,1750).
    // SDV-logo 183x100, midden (767,1750). Kolommen 540 -/+ 227.
    logoVak: 190,
    logoMiddenY: 1750,
    logoThuisX: 313,
    logoUitX: 767,
    // Streepje: x 532-547, y 1753-1756.
    streepje: { x: 532, y: 1753, breedte: 16, hoogte: 4 },
    // Teamnamen: letters WV-HEDW x 237-384, BARNEVELD x 683-846, rijen 1872-1897,
    // kaphoogte 26,0 -> Big Shoulders 900, 31,5 px, spatiering 3,2 px, basislijn 1898.
    naam: { grootte: 31.5, spatiering: 3.2, basislijn: 1899, gewicht: 900 },
    // Driehoek: schuine zijde gefit op anti-aliasing: x = -1,2736*y + 3311,4
    // -> rechterrand vanaf y=1752, onderrand vanaf x=866.
    driehoekBoven: 1752,
    driehoekLinks: 866,
  },
  post: {
    breedte: 1080,
    hoogte: 1350,
    // Onderrand blauw vlak: x=0 -> y=318, x=1080 -> y=392.
    kopLinks: 318,
    kopRechts: 392,
    // "VIERDE DIVISIE A": 37,25 px, spatiering 9,3, x 79-430, rijen 81-111.
    competitie: { grootte: 37.25, spatiering: 9.3, x: 77.99, basislijn: 112, gewicht: 600 },
    // "NEXT MATCH": Anton 106 px, x 82-562, rijen 140-231.
    nextMatch: { grootte: 106, spatiering: 0, x: 78.12, basislijn: 232, gewicht: 400 },
    // Chevrons: x 100-163, rijen 272-310, stap 20 (schaal 0,8 van story).
    chevrons: { x: 100, y: 272.5, hoogte: 39, breedte: 25.6, inkeping: 10, stap: 20 },
    // "SPEELRONDE 4": 43,75 px, spatiering 9,1, x 248-569, rijen 273-309.
    speelronde: { grootte: 43.75, spatiering: 9.1, x: 246.02, basislijn: 310, gewicht: 600 },
    // Foto: y 318-858 (540 hoog), breedte past, verticaal gecentreerd.
    fotoBoven: 318,
    fotoOnder: 858,
    // Rondjes: x 80-135 (diameter 56), midden y 914 / 988 / 1062 (stap 74).
    icoonX: 108,
    icoonDiameter: 56,
    icoonGlyph: 28,
    icoonY: [914, 988, 1062],
    // Info: rijen 894-932 / 968-1006 / 1031-1061 / 1067-1097.
    datum: { grootte: 48.25, spatiering: 1.9, x: 169.9, basislijn: 933, gewicht: 700 },
    tijd: { grootte: 48.25, spatiering: 1.9, x: 169.9, basislijn: 1007, gewicht: 700 },
    locatie: { grootte: 38, spatiering: 2.0, x: 170, basislijn: 1063, gewicht: 700 },
    plaats: { grootte: 38, spatiering: 2.0, x: 170, basislijn: 1099, gewicht: 700 },
    // Lijn: rijen 1131-1132, x 78-1001.
    lijnY: 1131,
    lijnX: 78,
    lijnBreedte: 924,
    lijnDikte: 2,
    // Logo's: WV 128x128 (x 249-376, y 1144-1271), midden (313,1208).
    // SDV 123x68, midden (767,1208).
    logoVak: 128,
    logoMiddenY: 1208,
    logoThuisX: 313,
    logoUitX: 767,
    // Streepje: x 534-545, y 1210-1213.
    streepje: { x: 534, y: 1210, breedte: 12, hoogte: 4 },
    // Teamnamen: rijen 1282-1303 -> Big Shoulders 900, 26 px, spatiering 3,15 px, basislijn 1304.
    naam: { grootte: 26, spatiering: 3.15, basislijn: 1304, gewicht: 900 },
    // Driehoek: x = -1,2707*y + 2645,4 -> rechterrand vanaf y=1232, onderrand vanaf x=930.
    driehoekBoven: 1232,
    driehoekLinks: 930,
  },
};

// Witte scheidingslijn tussen fotostroken (bij 2 of 3 foto's), in px.
export const STROOK_LIJN = 7;
