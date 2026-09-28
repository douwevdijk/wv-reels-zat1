import { staticFile, type CalculateMetadataFunction } from "remotion";
import spelersJson from "../../spelers.json";
import { opstellingSchema, spelersSchema, type OpstellingProps } from "./schema";

// Vaste selectie (zat1/spelers.json): naam en de uitgesneden foto.
const spelers = spelersSchema.parse(spelersJson);

// Naam als opzoeksleutel: hoofdletters, accenten, spaties, streepjes en punten
// tellen niet mee ("Midas Ploem-Kempkes" = "MIDAS PLOEMKEMPKES").
const sleutel = (naam: string) =>
  naam
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toUpperCase()
    .replace(/[\s.-]/g, "");

const fotoOpNaam = new Map(spelers.map((p) => [sleutel(p.naam), p.foto]));

const bestaat = (src: string) =>
  new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });

// Laadt wedstrijden/<map>/opstelling.json, controleert het met het zod-schema en
// bepaalt per basisspeler de foto: eerst `foto` uit opstelling.json, anders de
// foto bij die naam in spelers.json, anders null (neutraal silhouet).
// Een `foto` uit opstelling.json moet bestaan (anders een fout). Een foto uit
// spelers.json die (nog) niet in zat1/spelers/ staat, wordt het silhouet.
export const laadOpstelling = async (
  map: string,
  signal?: AbortSignal,
): Promise<Omit<OpstellingProps, "map">> => {
  const res = await fetch(staticFile(`wedstrijden/${map}/opstelling.json`), { signal });
  if (!res.ok) {
    throw new Error(
      `wedstrijden/${map}/opstelling.json niet gevonden (zet de opstelling in die map of kies een andere map)`,
    );
  }
  const opstelling = opstellingSchema.parse(await res.json());
  const fotos = await Promise.all(
    opstelling.basis.map(async (s) => {
      if (s.foto) {
        if (!(await bestaat(staticFile(s.foto)))) {
          throw new Error(`Spelersfoto niet gevonden: ${s.foto}`);
        }
        return s.foto;
      }
      const foto = fotoOpNaam.get(sleutel(s.naam)) ?? null;
      return foto !== null && (await bestaat(staticFile(foto))) ? foto : null;
    }),
  );
  return { opstelling, fotos };
};

// calculateMetadata voor alle opstellingscomposities; `duur` zet de lengte
// (voor de reel: scenes + eindbumper), weglaten = duur uit de compositie.
export const metOpstelling =
  (duur?: number): CalculateMetadataFunction<OpstellingProps> =>
  async ({ props, abortSignal }) => {
    const geladen = await laadOpstelling(props.map, abortSignal);
    return {
      props: { ...props, ...geladen },
      ...(duur !== undefined ? { durationInFrames: duur } : {}),
    };
  };
