import teamJson from "../team.json";

export type Team = {
  team: string;
  club: string;
  clubregel: string;
  kort: string;
  seizoen: string;
};

// Teamteksten komen uit team.json in de projectmap (wordt meegebundeld bij build/studio).
export const team: Team = teamJson;
