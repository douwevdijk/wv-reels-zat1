---
name: zat1-aankondiging
description: Wedstrijdaankondiging (reel + post + story) voor WV-HEDW Zaterdag 1 in zat1/. Gebruik bij "aankondiging zat1", "aankondiging zaterdag 1", "next match", "volgende wedstrijd zaterdag 1", "wedstrijdaankondiging", "nieuwe wedstrijd zat1" of als de gebruiker foto's voor de volgende wedstrijd van Zat1 aanlevert.
---

# Aankondiging WV-HEDW Zaterdag 1

Werkmap: `zat1/` (paden relatief aan de repo-root `wv-reels-zat1`; Claude Code wordt in de repo-root gestart).

## Vaste regels
- Video (mp4) renderen alleen na een expliciet "ja" van de gebruiker, elke keer opnieuw. Stills/jpg's mogen zonder vragen.
- Naar Google Drive schrijven alleen na een expliciet "ja" van de gebruiker, elke keer opnieuw.
- Gegevens nooit gokken: altijd met bron aan de gebruiker voorleggen en op bevestiging wachten.
- Geen emoji, geen console.log. Code wijzigen (alles in `zat1/src`) alleen via agents, na een "bouw" of "ja" op een plan.
- Aan het eind van de reel staat altijd de EindBumper; die zit al in de compositie `Aankondiging` (`src/aankondiging/Aankondiging.tsx`). Niet zelf toevoegen.
- `remotion.config.ts` heeft `setOverwriteOutput(true)`: een render overschrijft een bestaande mp4/jpg zonder waarschuwing. Bestaat het bestand al, meld dat eerst.

## Stappen

### 1. Volgende wedstrijd opzoeken
- WebFetch geeft 403 op hollandsevelden.nl; gebruik curl met een browser-user-agent:
  ```
  curl -sL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36" https://www.hollandsevelden.nl/clubs/w/wv-hedw/
  ```
- Filter op het blok "Wedstrijden van WV-HEDW in de Vierde Divisie A".
- Wedstrijdlinks: `/wedstrijd/<id>/<dd-mm-jjjj>-<thuis>-<uit>/`. Kies de eerstvolgende na vandaag.
- Speelronde = volgnummer van die wedstrijd in die lijst.
- Haal de wedstrijdpagina op (zelfde curl) voor aftrap en sportpark + plaats ("speelt X tegen Y op Sportpark ... in ...").

### 2. Voorleggen aan de gebruiker
- Lijstje: datum, tijd, thuis/uit, sportpark, plaats, speelronde, bron (URL's).
- Wacht op bevestiging. Niets invullen voor de bevestiging.

### 3. Logo tegenstander
- Officieel logo: clubsite (of het KNVB/Sportlink-clublogo op de clubsite), anders Wikimedia.
- Zo groot mogelijk, transparant, zonder bijschriften zoals "Opgericht ...".
- Opslaan als `assets/logos/tegenstanders/<slug>.svg` of `.png` (bv. `fc-uitgeest.png`). In de JSON is het pad `logos/tegenstanders/<slug>.png` (via symlink `zat1/public/logos`).
- Kijk eerst of het logo er al staat (`ls assets/logos/tegenstanders`).
- Oogt het logo te klein/groot: `logoSchaal` in de JSON (1 = contain; Uitgeest staat op 1.35). Laat de gebruiker die beoordelen.
- WV-HEDW-logo: `logo/wv-hedw-blauw.svg`.

### 4. Foto's die de gebruiker aanlevert
- Normaal 1 foto; het schema staat 1 tot 3 toe.
- Bij 2 of 3 foto's wordt de fotoband verdeeld in schuine stroken; per foto een `focus` (x, y tussen 0 en 1, standaard 0.5/0.5).

### 5. Wedstrijdmap en JSON
- Map: `zat1/wedstrijden/<dag>-<dd>-<maand afgekort>-<tegenstander>/`, bv. `za-26-sep-uitgeest` (zondag: `zo-`, zoals `zo-13-sep-hoofddorp`).
- Foto's: `foto-1.jpg`, `foto-2.jpg`, `foto-3.jpg`.
- `wedstrijd.json`: kopieer de structuur van `zat1/wedstrijden/za-26-sep-uitgeest/wedstrijd.json`. Schema: `zat1/src/aankondiging/schema.ts`.
  - Velden: `test` (false), `competitie` ("VIERDE DIVISIE A"), `speelronde` ("SPEELRONDE 5"), `datum` ("ZATERDAG 26 SEPTEMBER"), `tijd` ("14:30 UUR"), `locatie` ("SPORTPARK DE KOOG"), `plaats`, `thuis`, `uit`, `fotos`.
  - Teams: `club`, `label` (tekst onder het logo), `logo`, `logoSchaal`.
  - Alle teksten in hoofdletters, precies zoals ze in beeld komen.
  - De thuisploeg staat links (`thuis`), uitploeg rechts (`uit`).
- Zet in `zat1/src/actief.ts` de regel `export const ACTIEVE_WEDSTRIJD = "<map>";` op de nieuwe map (alleen die regel; dit is een gegevenswijziging, meld hem in het plan).

### 6. Kaarten (jpg's) maken en controleren
- In `zat1/`: `npm run kaarten` (of `npm run kaarten -- <map>` voor een andere map).
- Maakt `aankondiging-post.jpg` (1080x1350) en `aankondiging-story.jpg` (1080x1920) in de wedstrijdmap.
- Bekijk beide zelf (Read). Let vooral op de uitlijning van de logo's met de namen eronder.
- Laat ze daarna aan de gebruiker zien en wacht op het oordeel van de gebruiker.

### 7. Reel renderen (alleen na een expliciet ja van de gebruiker)
- Vraag: "Mag ik de reel renderen naar wedstrijden/<map>/aankondiging.mp4?"
- Na ja, in `zat1/`:
  ```
  npx remotion render Aankondiging wedstrijden/<map>/aankondiging.mp4 --codec h264 --crf 16
  ```

### 8. Uploaden
- Daarna skill `zat1-drive` (weer met apart ja).

## Studio
- `npm run dev` in `zat1/` start de Remotion-studio; andere poort bv. `npm run dev -- --port 3002`.
- De studio toont alleen video's (Aankondiging, Opstelling, EindBumper). De jpg's staan in een apart entrypoint `src/kaarten/index.ts` en komen alleen via `npm run kaarten`.
- Controle na codewijzigingen: `npm run lint` (eslint + tsc).
