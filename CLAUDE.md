# Huisregels wv-reels-zat1 (geldt in elke sessie in deze repo)

Claude Code wordt gestart in de repo-root (`wv-reels-zat1`); alle paden hieronder zijn relatief daaraan.

## Werkwijze

- Taal Nederlands. Kort. Lijstjes.
- Geen emoji of emoticons, nergens: chat, code, video, pagina's.
- Lezen, zoeken en plannen mag vrij.
- Code wijzigen pas na een plan in de chat en een "ja" of "bouw" van de gebruiker.
- Video (mp4) renderen: elke keer eerst vragen. Stills en jpg's mogen zonder vragen.
- Naar Google Drive schrijven (upload, vervangen, openbaar delen): elke keer eerst vragen.
- Commit en push: eerst vragen, apart van elkaar.
- Nooit `console.log`, `console.warn` of `console.error` toevoegen.
- Gegevens nooit gokken: met bron voorleggen; "vermoeden" erbij zetten als iets niet zeker is.
- "Goed genoeg" is de norm; niet pixel-exact itereren, behalve waar de gebruiker dat vraagt. De eindbumper is pixel-exact nagemaakt: niet aanpassen zonder reden.
- Na codewijzigingen `npm run lint` en `npm run build` in de betreffende projectmap.
- Alle uitvoer in reelformaat 9:16, behalve post-jpg's (1080x1350).
- Muziek alleen rechtenvrij, nooit Content ID Registered.
- Thuisploeg links.
- Geheimen staan in `.env` (niet in git).

## Projecten

- `zat1/` = WV-HEDW Zaterdag 1: aankondiging, line-up, eindbumper, kaarten via `npm run kaarten`. Wekelijkse werkwijze via de skills `zat1-aankondiging`, `zat1-opstelling` en `zat1-drive`.
- `assets/` = logo's.

## Nieuwe Mac (eenmalig)

- `brew install node git rclone ffmpeg`.
- Claude Code installeren: `curl -fsSL https://claude.ai/install.sh | bash`.
- `git clone https://github.com/douwevdijk/wv-reels-zat1.git` en `npm install` in `zat1/`.
- `rclone config create gdrive drive scope=drive` met het eigen Google-account. De Drive-mappen moeten met dat account gedeeld zijn als bewerker:
  - reels-map id `1lI-oUmk1Q6s1oR86aGTYhGI75W-9UKuD`
  - fotomap id `1_x7EFOyIm5atT6ztoQvgXyqJdyUWH5nn`
- Claude Code starten in de repo-root, zodat de skills laden.
- rclone's gedeelde client_id stopt in 2026: dan een eigen client_id, zie https://rclone.org/drive/#making-your-own-client-id
