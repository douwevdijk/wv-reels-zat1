import { z } from "zod";

// Gegevens van een line-up (opstelling) Zaterdag 1. Staat per wedstrijd in
// zat1/wedstrijden/<map>/opstelling.json, naast wedstrijd.json van de
// aankondiging (via public/wedstrijden bereikbaar). Alle teksten staan er
// precies zo in als ze in beeld komen (hoofdletters).
//
// Rugnummers verschillen per wedstrijd en komen alleen uit opstelling.json.
// Spelersfoto's: `foto` is een pad binnen public/ (net als logo's), bv.
// "spelers/paul-agne.png" (zat1/spelers/, via public/spelers). Zonder `foto`
// zoekt de compositie de NAAM op in zat1/spelers.json (hoofdletters, accenten,
// spaties, streepjes en punten tellen niet mee); staat daar geen foto (of is
// het bestand er nog niet), dan komt er een neutraal silhouet.

const teamSchema = z.object({
  // Volledige clubnaam (alleen informatief)
  naam: z.string(),
  // Tekst onder het logo, bv. "HOOFDDORP" of "WV-HEDW"
  label: z.string(),
  // Pad binnen public/, bv. "logo/wv-hedw-blauw.svg" of "logos/tegenstanders/hoofddorp.svg"
  logo: z.string(),
  // Optische correctie van de logogrootte binnen het vaste logovak (1 = contain).
  logoSchaal: z.number().positive().default(1),
});

const spelerSchema = z.object({
  nummer: z.number().int().min(0).max(99),
  naam: z.string(),
  foto: z.string().optional(),
});

const wisselSchema = z.object({
  nummer: z.number().int().min(0).max(99),
  naam: z.string(),
});

export const opstellingSchema = z
  .object({
    // true = alleen testset (niet publiceren)
    test: z.boolean().default(false),
    // Thuisploeg staat links, uitploeg rechts
    thuis: teamSchema,
    uit: teamSchema,
    // Basisspelers in de volgorde waarin ze in beeld komen
    basis: z.array(spelerSchema).length(11),
    // Wissels; in beeld in 2 kolommen, eerst de linkerkolom van boven naar beneden
    bank: z.array(wisselSchema).max(10),
    // Rugnummer van de uitgelichte speler op het eindshot (per wedstrijd een andere)
    eindspeler: z.number().int(),
    // Rugnummer van de speler op de post- en story-jpg (optioneel; zonder dit
    // veld tonen de jpg's de eindspeler). Liefst een andere dan de eindspeler.
    kaartspeler: z.number().int().optional(),
  })
  .refine((o) => o.basis.some((s) => s.nummer === o.eindspeler), {
    message: "eindspeler moet het rugnummer van een basisspeler zijn",
    path: ["eindspeler"],
  })
  .refine(
    (o) => o.kaartspeler === undefined || o.basis.some((s) => s.nummer === o.kaartspeler),
    {
      message: "kaartspeler moet het rugnummer van een basisspeler zijn",
      path: ["kaartspeler"],
    },
  );

export type Opstelling = z.infer<typeof opstellingSchema>;
export type OpstellingTeam = Opstelling["thuis"];
export type Basisspeler = Opstelling["basis"][number];
export type Wissel = Opstelling["bank"][number];

// zat1/spelers.json: vaste selectie op naam met (optioneel) de uitgesneden
// foto. Geen rugnummers: die staan per wedstrijd in opstelling.json.
export const spelersSchema = z.array(
  z.object({
    // Naam zoals in beeld (hoofdletters), bv. "PAUL AGNE"
    naam: z.string(),
    // Pad binnen public/, bv. "spelers/paul-agne.png"; null = nog geen foto
    foto: z.string().nullable(),
  }),
);

export type Spelers = z.infer<typeof spelersSchema>;

// Props van de composities: de map kies je in src/actief.ts (of via --props),
// de gegevens laadt calculateMetadata uit opstelling.json.
export type OpstellingProps = {
  map: string;
  opstelling: Opstelling | null;
  // Per basisspeler (zelfde volgorde) de te tonen foto (pad binnen public/) of null
  fotos: (string | null)[];
};
