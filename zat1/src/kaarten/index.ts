import { registerRoot } from "remotion";
import { KaartenRoot } from "./KaartenRoot";

// Apart entrypoint voor de jpg's (niet in de studio, daar staan alleen video's).
// Maken: `npm run kaarten` (alle jpg's voor de actieve wedstrijd uit src/actief.ts).
registerRoot(KaartenRoot);
