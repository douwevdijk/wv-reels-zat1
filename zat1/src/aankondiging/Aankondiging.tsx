import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { EindBumperZat1, EINDBUMPER_FRAMES } from "../bumpers/EindBumperZat1";
import { colors } from "../theme";
import { Intro, INTRO_FRAMES } from "./Intro";
import { Kaart, KAART_FRAMES } from "./Kaart";
import type { AankondigingData } from "./laden";

// Reel "wedstrijdaankondiging" Zaterdag 1 (1080x1920, 30 fps), opbouw zoals
// aankondiging.mp4:
//   f0-f91    intro (NEXT / MATCH / competitie)
//   f92-f261  eindkaart bouwt op en blijft staan
//   f262-     harde knip naar de eindbumper
export const SCENE_FRAMES = INTRO_FRAMES + KAART_FRAMES;
export const AANKONDIGING_FRAMES = SCENE_FRAMES + EINDBUMPER_FRAMES;

const KaartScene: React.FC<{ data: AankondigingData }> = ({ data }) => {
  const frame = useCurrentFrame();
  if (!data.wedstrijd) {
    return null;
  }
  return (
    <Kaart
      formaat="story"
      wedstrijd={data.wedstrijd}
      map={data.map}
      fotoAfmetingen={data.fotoAfmetingen}
      frame={frame}
    />
  );
};

export const Aankondiging: React.FC<AankondigingData> = (props) => {
  if (!props.wedstrijd) {
    return <AbsoluteFill style={{ backgroundColor: colors.white }} />;
  }
  return (
    <AbsoluteFill style={{ backgroundColor: colors.white }}>
      <Sequence durationInFrames={INTRO_FRAMES} name="Intro">
        <Intro competitie={props.wedstrijd.competitie} />
      </Sequence>
      <Sequence from={INTRO_FRAMES} durationInFrames={KAART_FRAMES} name="Kaart">
        <KaartScene data={props} />
      </Sequence>
      <Sequence from={SCENE_FRAMES} durationInFrames={EINDBUMPER_FRAMES} name="Eindbumper">
        <EindBumperZat1 />
      </Sequence>
    </AbsoluteFill>
  );
};
