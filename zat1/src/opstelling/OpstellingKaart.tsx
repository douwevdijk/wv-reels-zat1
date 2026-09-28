import React from "react";
import { AbsoluteFill } from "remotion";
import { POST, STORY } from "./maten";
import { OpstellingScene } from "./Scene";
import type { OpstellingProps } from "./schema";

// Stills van het eindshot: story (1080x1920, zelfde indeling als het eindshot van
// de reel) en post (1080x1350, 4:5-herschikking, zie POST in maten.ts).
// Uitgelicht is de `kaartspeler` (zonder dat veld de `eindspeler`); de reel zelf
// toont altijd de eindspeler.
export const OpstellingKaart: React.FC<OpstellingProps & { formaat: "story" | "post" }> = ({
  opstelling,
  fotos,
  formaat,
}) => {
  if (!opstelling) {
    return null;
  }
  return (
    <AbsoluteFill>
      <OpstellingScene
        opstelling={opstelling}
        fotos={fotos}
        ind={formaat === "story" ? STORY : POST}
        frame={null}
        fps={30}
        uitgelicht={opstelling.kaartspeler ?? opstelling.eindspeler}
      />
    </AbsoluteFill>
  );
};

export const OpstellingStory: React.FC<OpstellingProps> = (props) => (
  <OpstellingKaart {...props} formaat="story" />
);

export const OpstellingPost: React.FC<OpstellingProps> = (props) => (
  <OpstellingKaart {...props} formaat="post" />
);
