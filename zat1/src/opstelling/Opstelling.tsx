import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EindBumperZat1, EINDBUMPER_FRAMES } from "../bumpers/EindBumperZat1";
import { EIND_START } from "./Lijst";
import { STORY } from "./maten";
import { OpstellingScene } from "./Scene";
import type { OpstellingProps } from "./schema";
import { EIND, UITGANG } from "./tijden";

// Reel "line-up" Zaterdag 1 (1080x1920, 30 fps), opbouw zoals opstelling-v4.mp4:
//   f0-f453    line-up bouwt op (11 spelers, bank, uitgelichte speler) en staat stil
//   f454-f465  lineaire overgang naar egaal blauw
//   f466-      harde knip naar de eindbumper
const UITGANG_START = EIND_START + EIND.crossfade + UITGANG.stil;
export const SCENE_FRAMES = UITGANG_START + UITGANG.overgang + UITGANG.egaal;
export const OPSTELLING_FRAMES = SCENE_FRAMES + EINDBUMPER_FRAMES;

const Scene: React.FC<OpstellingProps> = ({ opstelling, fotos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!opstelling) {
    return null;
  }
  const blauw = interpolate(frame, [UITGANG_START, UITGANG_START + UITGANG.overgang], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <OpstellingScene opstelling={opstelling} fotos={fotos} ind={STORY} frame={frame} fps={fps} />
      {blauw > 0 ? <AbsoluteFill style={{ backgroundColor: UITGANG.kleur, opacity: blauw }} /> : null}
    </AbsoluteFill>
  );
};

export const Opstelling: React.FC<OpstellingProps> = (props) => (
  <AbsoluteFill style={{ backgroundColor: UITGANG.kleur }}>
    <Sequence durationInFrames={SCENE_FRAMES} name="Line-up">
      <Scene {...props} />
    </Sequence>
    <Sequence from={SCENE_FRAMES} durationInFrames={EINDBUMPER_FRAMES} name="Eindbumper">
      <EindBumperZat1 />
    </Sequence>
  </AbsoluteFill>
);
