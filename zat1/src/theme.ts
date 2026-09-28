import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadBigShoulders } from "@remotion/google-fonts/BigShoulders";

// Grote kop ("NEXT MATCH"): Anton 400. Gemeten tegen kaart-story.jpg:
// zelfde breedte/hoogte-verhouding (5,16) en inktdichtheid, letterspatiering 0.
const anton = loadAnton("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// Alle overige tekst: Big Shoulders (voorheen "Big Shoulders Display").
// Herkenbaar aan de M met gesplitste middenpoot en de W met platte onderkant.
// - info ("ZATERDAG 19 SEPTEMBER", "14:30 UUR", locatie): 700
// - labels met grote spatiering ("VIERDE DIVISIE A", "SPEELRONDE 4",
//   teamnamen onder de logo's): 600
const bigShoulders = loadBigShoulders("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
});

export const fonts = {
  heading: anton.fontFamily,
  info: bigShoulders.fontFamily,
  label: bigShoulders.fontFamily,
};

export const fontWeights = {
  heading: 400,
  info: 700,
  label: 600,
};

// Letterspatiering, gemeten tegen de referentiekaarten.
export const letterSpacing = {
  heading: "0em",
  info: "0.02em",
  // "VIERDE DIVISIE A", "SPEELRONDE 4" (wit op blauw)
  labelWide: "0.24em",
  // Teamnamen onder de logo's ("WV-HEDW", "BARNEVELD")
  labelTeam: "0.13em",
};

// Gemeten uit kaart-post.jpg en kaart-story.jpg (beide identiek).
export const colors = {
  // Blauw vlak bovenaan, hoekdriehoek, icoonrondjes en infotekst
  blue: "#143dc9",
  // Donkere tekst (teamnamen onder de logo's)
  ink: "#0e1531",
  // Dunne scheidingslijn boven de logo's (2 px)
  line: "#d7dae3",
  // Streepje tussen de twee logo's
  dash: "#d6d9e5",
  // Onderste vlak, koptekst en icoontjes in de rondjes
  white: "#ffffff",
};

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
};
