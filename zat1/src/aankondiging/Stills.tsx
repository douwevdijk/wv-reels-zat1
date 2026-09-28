import React from "react";
import { Kaart } from "./Kaart";
import type { AankondigingData } from "./laden";

// Stills: de eindkaart in story- (1080x1920) en postformaat (1080x1350).
export const AankondigingStory: React.FC<AankondigingData> = (props) =>
  props.wedstrijd ? (
    <Kaart
      formaat="story"
      wedstrijd={props.wedstrijd}
      map={props.map}
      fotoAfmetingen={props.fotoAfmetingen}
    />
  ) : null;

export const AankondigingPost: React.FC<AankondigingData> = (props) =>
  props.wedstrijd ? (
    <Kaart
      formaat="post"
      wedstrijd={props.wedstrijd}
      map={props.map}
      fotoAfmetingen={props.fotoAfmetingen}
    />
  ) : null;
