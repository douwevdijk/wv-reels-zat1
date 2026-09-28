// Maakt alle jpg's (kaarten) voor de actieve wedstrijd uit src/actief.ts:
//   wedstrijden/<map>/aankondiging-post.jpg  (1080x1350)
//   wedstrijden/<map>/aankondiging-story.jpg (1080x1920)
//   wedstrijden/<map>/opstelling-post.jpg    (1080x1350, alleen als opstelling.json er staat)
//   wedstrijden/<map>/opstelling-story.jpg   (1080x1920, idem)
// Gebruik: npm run kaarten            (actieve wedstrijd)
//          npm run kaarten -- <map>   (andere map in wedstrijden/)
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const actief = readFileSync(new URL("../src/actief.ts", import.meta.url), "utf8");
const gevonden = actief.match(/ACTIEVE_WEDSTRIJD\s*=\s*"([^"]+)"/);
const map = process.argv[2] ?? gevonden?.[1];
if (!map) {
  throw new Error("Geen actieve wedstrijd gevonden in src/actief.ts");
}

const props = JSON.stringify({ map, wedstrijd: null, fotoAfmetingen: [] });
const kaarten = [
  ["AankondigingPost", "aankondiging-post.jpg"],
  ["AankondigingStory", "aankondiging-story.jpg"],
];
// Line-up alleen als er een opstelling.json in de map staat (anders overslaan).
if (existsSync(new URL(`../wedstrijden/${map}/opstelling.json`, import.meta.url))) {
  kaarten.push(["OpstellingPost", "opstelling-post.jpg"], ["OpstellingStory", "opstelling-story.jpg"]);
}

for (const [id, bestand] of kaarten) {
  execFileSync(
    "npx",
    [
      "remotion",
      "still",
      "src/kaarten/index.ts",
      id,
      `wedstrijden/${map}/${bestand}`,
      `--props=${props}`,
      "--image-format=jpeg",
      "--jpeg-quality=95",
    ],
    { stdio: "inherit", cwd: fileURLToPath(new URL("..", import.meta.url)) },
  );
}
