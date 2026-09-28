---
name: zat1-drive
description: Eindbestanden van WV-HEDW Zaterdag 1 (aankondiging, line-up/opstelling) uploaden naar Google Drive met rclone en een deellink geven. Gebruik bij "naar drive", "upload naar drive", "op de drive zetten", "drive-link", "deel de reel", of na een afgeronde aankondiging of opstelling van zat1.
---

# Uploaden naar Google Drive (Zaterdag 1)

## Vaste regels
- Naar Google Drive schrijven alleen na een expliciet "ja" van de gebruiker, elke keer opnieuw. Ook `rclone link` (openbaar delen) valt daaronder.
- Bestaande bestanden op Drive vervangen alleen na een apart ja.
- Video (mp4) renderen alleen na een expliciet "ja" van de gebruiker. Deze skill rendert niets; ontbreekt een mp4, dan terug naar `zat1-aankondiging` of `zat1-opstelling`.
- Gegevens nooit gokken: map en bestanden eerst voorleggen.
- Geen emoji, geen console.log. Code wijzigen alleen via agents, na een "bouw" of "ja" op een plan.
- De EindBumper zit al in de composities; niet apart uploaden.

## Gegevens
- rclone-remote: `gdrive` (al geconfigureerd).
- Hoofdmap-id: `1lI-oUmk1Q6s1oR86aGTYhGI75W-9UKuD`.
- Remote-string (zsh), altijd zo, tussen aanhalingstekens:
  ```
  "gdrive,root_folder_id=1lI-oUmk1Q6s1oR86aGTYhGI75W-9UKuD:<map>"
  ```
  Een losse `--drive-root-folder-id` in een variabele breekt in zsh.
- Drive-mapnaam = lokale mapnaam in `zat1/wedstrijden/` (bv. `za-26-sep-uitgeest`).

## Alleen eindbestanden
- Wel: `aankondiging.mp4`, `aankondiging-post.jpg`, `aankondiging-story.jpg`, `opstelling.mp4`, `opstelling-post.jpg`, `opstelling-story.jpg`.
- Nooit: `foto-*.jpg`, `wedstrijd.json`, `opstelling.json`, `testfotos/`.

## Stappen
1. Kijk lokaal wat er is: `ls -la zat1/wedstrijden/<map>` (paden relatief aan de repo-root `wv-reels-zat1`, waar Claude Code gestart wordt).
2. Kijk wat er al op Drive staat (alleen lezen):
   ```
   rclone lsl "gdrive,root_folder_id=1lI-oUmk1Q6s1oR86aGTYhGI75W-9UKuD:<map>"
   ```
3. Leg voor aan de gebruiker: welke bestanden, welke Drive-map, welke al bestaan en vervangen worden. Wacht op ja.
4. Na ja, vanuit de wedstrijdmap (`cd zat1/wedstrijden/<map>`), alleen de bestanden die er zijn:
   ```
   rclone copy . "gdrive,root_folder_id=1lI-oUmk1Q6s1oR86aGTYhGI75W-9UKuD:<map>" --include "aankondiging.mp4" --include "aankondiging-post.jpg" --include "aankondiging-story.jpg"
   ```
   Voor de line-up: `--include "opstelling.mp4" --include "opstelling-post.jpg" --include "opstelling-story.jpg"`.
   Tip: eerst met `--dry-run` om te zien wat er gebeurt.
5. Controleer: `rclone lsl "<remote>"` (zelfde string als hierboven).
6. Deel openbaar: `rclone link "gdrive,root_folder_id=1lI-oUmk1Q6s1oR86aGTYhGI75W-9UKuD:<map>"` en geef de gebruiker de link.

## Waarschuwing
- rclone's gedeelde client_id stopt in de loop van 2026. Falen uploads (bv. 403 of rate limit), dan is een eigen client_id nodig: https://rclone.org/drive/#making-your-own-client-id. Niet zelf de rclone-config aanpassen; eerst met de gebruiker overleggen, met voorstel.
