import { staticFile, type CalculateMetadataFunction } from "remotion";
import type { FotoAfmeting } from "./Kaart";
import { wedstrijdSchema, type AankondigingProps } from "./schema";

export type AankondigingData = AankondigingProps & {
  fotoAfmetingen: FotoAfmeting[];
};

const afmeting = (src: string) =>
  new Promise<FotoAfmeting>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ breedte: img.naturalWidth, hoogte: img.naturalHeight });
    img.onerror = () => reject(new Error(`Foto niet gevonden: ${src}`));
    img.src = src;
  });

// Laadt wedstrijden/<map>/wedstrijd.json, controleert het met het zod-schema
// en zoekt de afmetingen van de foto's op (nodig voor het focuspunt).
export const laadWedstrijd = async (
  map: string,
  signal?: AbortSignal,
): Promise<Omit<AankondigingData, "map">> => {
  const res = await fetch(staticFile(`wedstrijden/${map}/wedstrijd.json`), { signal });
  if (!res.ok) {
    throw new Error(`wedstrijden/${map}/wedstrijd.json niet gevonden`);
  }
  const wedstrijd = wedstrijdSchema.parse(await res.json());
  const fotoAfmetingen = await Promise.all(
    wedstrijd.fotos.map((f) => afmeting(staticFile(`wedstrijden/${map}/${f.bestand}`))),
  );
  return { wedstrijd, fotoAfmetingen };
};

// calculateMetadata voor alle aankondigingscomposities; `duur` zet de lengte
// (voor de reel: scenes + eindbumper), weglaten = duur uit de Composition.
export const metWedstrijd =
  (duur?: number): CalculateMetadataFunction<AankondigingData> =>
  async ({ props, abortSignal }) => {
    const geladen = await laadWedstrijd(props.map, abortSignal);
    return {
      props: { ...props, ...geladen },
      ...(duur !== undefined ? { durationInFrames: duur } : {}),
    };
  };
