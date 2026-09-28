import { z } from "zod";

// Gegevens van een wedstrijdaankondiging. Staat per wedstrijd in
// zat1/wedstrijden/<map>/wedstrijd.json (via public/wedstrijden bereikbaar).
// Alle teksten staan er precies zo in als ze op de kaart komen (hoofdletters).

const teamSchema = z.object({
  // Volledige clubnaam (alleen informatief)
  club: z.string(),
  // Tekst onder het logo, bv. "WV-HEDW" of "BARNEVELD"
  label: z.string(),
  // Pad binnen public/, bv. "logo/wv-hedw-blauw.svg" of "logos/tegenstanders/fc-uitgeest.png"
  logo: z.string(),
  // Optische correctie van de logogrootte binnen het vaste logovak (1 = contain).
  logoSchaal: z.number().positive().default(1),
});

const fotoSchema = z.object({
  // Bestandsnaam binnen de wedstrijdmap, bv. "foto-1.jpg"
  bestand: z.string(),
  // Focuspunt (0..1): dit punt van de foto komt zo goed mogelijk in het midden
  // van de strook (object-position).
  focus: z
    .object({
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
    })
    .default({ x: 0.5, y: 0.5 }),
});

export const wedstrijdSchema = z.object({
  // true = alleen testset (niet publiceren)
  test: z.boolean().default(false),
  competitie: z.string(),
  speelronde: z.string(),
  datum: z.string(),
  tijd: z.string(),
  locatie: z.string(),
  plaats: z.string(),
  // Thuisploeg staat links, uitploeg rechts
  thuis: teamSchema,
  uit: teamSchema,
  fotos: z.array(fotoSchema).min(1).max(3),
});

export type Wedstrijd = z.infer<typeof wedstrijdSchema>;
export type Team = Wedstrijd["thuis"];
export type Foto = Wedstrijd["fotos"][number];

// Props van de composities: de map kies je in src/actief.ts (of via --props),
// de gegevens laadt calculateMetadata uit wedstrijd.json.
export type AankondigingProps = {
  map: string;
  wedstrijd: Wedstrijd | null;
};
