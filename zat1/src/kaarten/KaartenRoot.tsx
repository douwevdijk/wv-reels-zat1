import React from "react";
import { Still } from "remotion";
import { ACTIEVE_WEDSTRIJD } from "../actief";
import { metWedstrijd, type AankondigingData } from "../aankondiging/laden";
import { AankondigingPost, AankondigingStory } from "../aankondiging/Stills";
import { metOpstelling } from "../opstelling/laden";
import { OpstellingPost, OpstellingStory } from "../opstelling/OpstellingKaart";
import type { OpstellingProps } from "../opstelling/schema";

// Stills (jpg's) per wedstrijd. Zelfde gegevens als de reel: calculateMetadata
// leest wedstrijden/<map>/wedstrijd.json. Andere map: --props='{"map":"..."}'.
const aankondigingProps: AankondigingData = {
  map: ACTIEVE_WEDSTRIJD,
  wedstrijd: null,
  fotoAfmetingen: [],
};

// Line-up: leest wedstrijden/<map>/opstelling.json (zelfde map als hierboven).
const opstellingProps: OpstellingProps = {
  map: ACTIEVE_WEDSTRIJD,
  opstelling: null,
  fotos: [],
};

export const KaartenRoot: React.FC = () => {
  return (
    <>
      <Still
        id="AankondigingPost"
        component={AankondigingPost}
        width={1080}
        height={1350}
        defaultProps={aankondigingProps}
        calculateMetadata={metWedstrijd()}
      />
      <Still
        id="AankondigingStory"
        component={AankondigingStory}
        width={1080}
        height={1920}
        defaultProps={aankondigingProps}
        calculateMetadata={metWedstrijd()}
      />
      <Still
        id="OpstellingPost"
        component={OpstellingPost}
        width={1080}
        height={1350}
        defaultProps={opstellingProps}
        calculateMetadata={metOpstelling()}
      />
      <Still
        id="OpstellingStory"
        component={OpstellingStory}
        width={1080}
        height={1920}
        defaultProps={opstellingProps}
        calculateMetadata={metOpstelling()}
      />
    </>
  );
};
