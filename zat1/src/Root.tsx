import React from "react";
import { Composition } from "remotion";
import { ACTIEVE_WEDSTRIJD } from "./actief";
import { EindBumperZat1, EINDBUMPER_FRAMES } from "./bumpers/EindBumperZat1";
import { Aankondiging, AANKONDIGING_FRAMES } from "./aankondiging/Aankondiging";
import { metWedstrijd, type AankondigingData } from "./aankondiging/laden";
import { metOpstelling } from "./opstelling/laden";
import { Opstelling, OPSTELLING_FRAMES } from "./opstelling/Opstelling";
import type { OpstellingProps } from "./opstelling/schema";

// Aankondiging: de actieve wedstrijd staat in src/actief.ts (naam van de map in
// zat1/wedstrijden/). calculateMetadata leest wedstrijden/<map>/wedstrijd.json
// (via de symlink public/wedstrijden). Andere map eenmalig: --props='{"map":"..."}'.
// De jpg's (post/story) staan niet in de studio maar in src/kaarten/: `npm run kaarten`.
const aankondigingProps: AankondigingData = {
  map: ACTIEVE_WEDSTRIJD,
  wedstrijd: null,
  fotoAfmetingen: [],
};

// Line-up (opstelling): zelfde actieve map, leest wedstrijden/<map>/opstelling.json.
const opstellingProps: OpstellingProps = {
  map: ACTIEVE_WEDSTRIJD,
  opstelling: null,
  fotos: [],
};

// Hier komen de composities van Zaterdag 1 (aankondiging, opstelling, ...).
// Alleen video's krijgen een eigen <Composition>; eenmalige onderdelen niet.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Aankondiging"
        component={Aankondiging}
        durationInFrames={AANKONDIGING_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={aankondigingProps}
        calculateMetadata={metWedstrijd(AANKONDIGING_FRAMES)}
      />
      <Composition
        id="Opstelling"
        component={Opstelling}
        durationInFrames={OPSTELLING_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={opstellingProps}
        calculateMetadata={metOpstelling(OPSTELLING_FRAMES)}
      />
      {/* Eindbumper: blijvende compositie omdat hij hergebruikt wordt. */}
      <Composition
        id="EindBumper"
        component={EindBumperZat1}
        durationInFrames={EINDBUMPER_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
