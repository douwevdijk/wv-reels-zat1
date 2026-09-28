---
name: zat1-opstelling
description: Line-up (opstelling) van WV-HEDW Zaterdag 1 in zat1/, voor dezelfde wedstrijd als de aankondiging. Gebruik bij "line-up", "lineup", "opstelling", "opstelling zat1", "basiself", "wissels", "bank" of als de gebruiker eind van de week de opstelling van Zaterdag 1 aanlevert.
---

# Line-up WV-HEDW Zaterdag 1

Werkmap: `zat1/` (paden relatief aan de repo-root `wv-reels-zat1`; Claude Code wordt in de repo-root gestart). De gebruiker levert de opstelling eind van de week aan, voor de wedstrijd in `src/actief.ts` (`ACTIEVE_WEDSTRIJD`).

## Vaste regels
- Video (mp4) renderen alleen na een expliciet "ja" van de gebruiker, elke keer opnieuw. Stills/jpg's mogen zonder vragen.
- Naar Google Drive schrijven alleen na een expliciet "ja" van de gebruiker, elke keer opnieuw.
- Gegevens nooit gokken: altijd met bron aan de gebruiker voorleggen en op bevestiging wachten. Rugnummers verschillen per wedstrijd: altijd uit de door de gebruiker aangeleverde opstelling, nooit uit een vaste lijst. Namen alleen uit `zat1/spelers.json` of van de gebruiker.
- Geen emoji, geen console.log. Code wijzigen (alles in `zat1/src`, `zat1/scripts`) alleen via agents, na een "bouw" of "ja" op een plan.
- Aan het eind van de reel staat altijd de EindBumper; die zit al in de compositie `Opstelling` (`src/opstelling/Opstelling.tsx`).
- `remotion.config.ts` heeft `setOverwriteOutput(true)`: renders overschrijven bestaande bestanden zonder waarschuwing.

## Hoe het in de code zit
- Schema: `zat1/src/opstelling/schema.ts`. Laden: `zat1/src/opstelling/laden.ts`.
- `opstelling.json` in de wedstrijdmap (voorbeeld, testset: `zat1/wedstrijden/zo-13-sep-hoofddorp/opstelling.json`):
  - `test`: false voor echt (true = testset, niet publiceren)
  - `thuis` / `uit`: `naam`, `label`, `logo`, `logoSchaal` (let op: hier `naam`, in wedstrijd.json heet dat `club`). Overnemen uit `wedstrijd.json` van dezelfde map. Thuisploeg links.
  - `basis`: precies 11 spelers `{ nummer, naam, foto? }`, in de volgorde waarin ze in beeld komen.
  - `bank`: max 10 wissels `{ nummer, naam }`; in beeld 2 kolommen, eerst de linkerkolom van boven naar beneden.
  - `eindspeler`: rugnummer van de uitgelichte speler op het eindshot van de reel. Moet een basisspeler zijn (zod-check). Elke wedstrijd een andere speler: kijk welke eerder gebruikt zijn in `zat1/wedstrijden/*/opstelling.json`.
  - `kaartspeler` (optioneel): rugnummer van de speler op de post- en story-jpg. Moet een basisspeler zijn (zod-check); zonder dit veld tonen de jpg's de eindspeler.
  - Afspraak (2026-09-25): de reel eindigt met DEZELFDE speler als op de story/post. Dus `eindspeler` = `kaartspeler`. Claude kiest die ene speler zelf (basisspeler met foto, niet dezelfde als bij de vorige wedstrijd) en noemt de keuze. Geen willekeur in de code: het staat vast in opstelling.json.
  - Namen in hoofdletters, precies zoals in beeld.
- Spelersfoto per basisspeler, in deze volgorde:
  1. `foto` in opstelling.json (pad binnen `public/`)
  2. anders `foto` bij die NAAM in `zat1/spelers.json` (hoofdletters, accenten, spaties, streepjes en punten tellen niet mee)
  3. anders een neutraal silhouet
- `zat1/spelers.json`: vaste selectie op naam `{ naam, foto }` (geen rugnummers); `foto` is `"spelers/<slug>.png"` of null. Slug = volledige naam in kleine letters met streepjes, bv. `paul-agne.png`, `aaron-mc-cready.png`.
- Foto's staan in `zat1/spelers/<slug>.png`, bereikbaar via symlink `zat1/public/spelers`. Een `foto` uit opstelling.json die niet bestaat geeft een fout; een foto uit spelers.json die (nog) niet bestaat wordt het silhouet.

## Nieuwe spelersfoto's
- Bron: Google Drive-map id `1_x7EFOyIm5atT6ztoQvgXyqJdyUWH5nn`, submap `fotokaart line up` (line-up-kaarten 1024x1820, bestandsnaam = voornaam). De volledige namen staan in submap `vierkant lr` (bv. `Aaron mc Cready.jpg`). Alleen lezen, bv. `rclone lsf "gdrive,root_folder_id=1_x7EFOyIm5atT6ztoQvgXyqJdyUWH5nn:fotokaart line up"`.
- Uitsnijden lokaal met `rembg` (venv in de scratchpad, `pip install "rembg[cpu]" scipy`), model `birefnet-general` (schoonste randen bij blauw shirt op blauwe achtergrond, haar en schoenen; beter dan `birefnet-portrait` en `isnet-general-use`). Alleen het masker gebruiken, dan opschonen: grootste samenhangende component houden (alpha > 0.5, 3 px gedilateerd voor de zachte rand), alpha < 0.02 op 0, bijsnijden tot de speler plus 4 px marge, volle resolutie. Geen foto's naar externe diensten.
- Controle voordat het in `zat1/spelers/` gaat: contactsheet op #0a1f5c met naam eronder en ingezoomde randen op magenta; de gebruiker keurt goed. Daarna `foto` in spelers.json invullen.

## Stappen
1. Controleer welke map actief is (`zat1/src/actief.ts`) en dat daar een `wedstrijd.json` staat.
2. Vraag de gebruiker: basis-11 (in volgorde) en bank. Kies zelf de uitgelichte speler (eindspeler = kaartspeler, basisspeler met foto, nog niet eerder gebruikt) en noem die keuze.
3. Veel namen: maak een lokale invulpagina (HTML met tekstvakken) in de scratchpad, niet in het project. Vul namen voor uit `spelers.json`; rugnummers komen uit de aangeleverde opstelling van deze wedstrijd.
4. Leg het resultaat als lijstje voor (nummer + naam, bank, eindspeler, kaartspeler, bron) en wacht op bevestiging. Onbekend rugnummer of naam: vragen, niet invullen.
5. Schrijf `zat1/wedstrijden/<map>/opstelling.json`.
6. Stills (mogen zonder vragen), in `zat1/`: `npm run kaarten` (actieve wedstrijd) of `npm run kaarten -- <map>`. Dat maakt de aankondiging-jpg's en, als er een `opstelling.json` in de map staat, ook `opstelling-post.jpg` (1080x1350) en `opstelling-story.jpg` (1080x1920), jpeg kwaliteit 95. Zonder opstelling.json worden die twee stil overgeslagen. De aankondiging-jpg's worden daarbij opnieuw gemaakt; bij ongewijzigde gegevens zijn ze byte-gelijk. Bekijk de jpg's zelf en laat ze aan de gebruiker zien.
7. Reel alleen na een expliciet ja van de gebruiker, in `zat1/`:
   ```
   npx remotion render Opstelling wedstrijden/<map>/opstelling.mp4 --codec h264 --crf 16
   ```
8. Daarna skill `zat1-drive` (apart ja).

Bestandsnamen in de wedstrijdmap: `opstelling.mp4`, `opstelling-post.jpg`, `opstelling-story.jpg`.
