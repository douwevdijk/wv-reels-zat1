import React, { useId } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadBigShoulders } from "@remotion/google-fonts/BigShoulders";
import { loadFont as loadArimo } from "@remotion/google-fonts/Arimo";
import onderdelen from "../../public/logo/onderdelen/onderdelen.json";
import {
  BINNEN,
  BINNEN_START,
  CIJFER,
  DAG,
  DAG_FOCUS_ANDER,
  DAG_FOCUS_MIDDEN,
  DAG_FOCUS_START,
  DAG_INTRO,
  DAG_INTRO_NIVEAU,
  DAG_INTRO_START,
  DAG_INTRO_Y,
  DAG_ROL_DEKKING,
  DAG_START,
  DAG_VERSCHUIVING,
  EINDBUMPER_LENGTE,
  HULPLIJN,
  HULPLIJN_BAND,
  HULPLIJN_BAND_START,
  HULPLIJN_DEKKING,
  HULPLIJN_LENGTE,
  HULPLIJN_START,
  KLEUR,
  LIJN,
  LOGO,
  RING_HOEK,
  RING_START,
  RINGTEKST,
  ROL_BLUR,
  ROL_HOEK,
  ROL_START,
  STIP,
} from "./eindBumperZat1Metingen";

// Eindbumper Zaterdag 1 (WV-HEDW): lijn, ring, logo, rollend cijfer dat op "1"
// landt en een rollende dagenrij die op ZATERDAG landt. Alle maten en tijden zijn
// gemeten aan de referentie; zie eindBumperZat1Metingen.ts.

const anton = loadAnton("normal", { weights: ["400"], subsets: ["latin"] });
const bigShoulders = loadBigShoulders("normal", {
  weights: ["800"],
  subsets: ["latin"],
});
const arimo = loadArimo("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

export const EINDBUMPER_FRAMES = EINDBUMPER_LENGTE;

const { cx: CX, cy: CY } = LOGO;
const W_PAD: string =
  onderdelen.parts.find((p: { id: string }) => p.id === "W")?.d ?? "";

// Waarde uit een per-frame tabel (lineair tussen frames, vast buiten de tabel).
const uitTabel = (
  tabel: number[],
  start: number,
  frame: number,
  stap = 1,
): number => {
  const pos = (frame - start) / stap;
  if (pos <= 0) {
    return tabel[0];
  }
  if (pos >= tabel.length - 1) {
    return tabel[tabel.length - 1];
  }
  const i = Math.floor(pos);
  const f = pos - i;
  return tabel[i] * (1 - f) + tabel[i + 1] * f;
};

const easeOutCubic = Easing.out(Easing.cubic);

// Ringsegment (annulus) van 0 graden (12 uur) tot `hoek`, met de klok mee.
const ringPad = (hoek: number, rBuiten: number, rBinnen: number): string => {
  const punt = (r: number, a: number) => {
    const rad = (a * Math.PI) / 180;
    return `${CX + r * Math.sin(rad)},${CY - r * Math.cos(rad)}`;
  };
  if (hoek >= 359.999) {
    return [
      `M${CX},${CY - rBuiten}`,
      `A${rBuiten},${rBuiten} 0 1,1 ${CX},${CY + rBuiten}`,
      `A${rBuiten},${rBuiten} 0 1,1 ${CX},${CY - rBuiten}Z`,
      `M${CX},${CY - rBinnen}`,
      `A${rBinnen},${rBinnen} 0 1,0 ${CX},${CY + rBinnen}`,
      `A${rBinnen},${rBinnen} 0 1,0 ${CX},${CY - rBinnen}Z`,
    ].join(" ");
  }
  const groot = hoek > 180 ? 1 : 0;
  return [
    `M${punt(rBuiten, 0)}`,
    `A${rBuiten},${rBuiten} 0 ${groot},1 ${punt(rBuiten, hoek)}`,
    `L${punt(rBinnen, hoek)}`,
    `A${rBinnen},${rBinnen} 0 ${groot},0 ${punt(rBinnen, 0)}Z`,
  ].join(" ");
};

// Halve schijf (links of rechts van de middenas) met straal r.
const halveSchijf = (r: number, links: boolean): string =>
  `M${CX},${CY - r} A${r},${r} 0 0,${links ? 0 : 1} ${CX},${CY + r}Z`;

// Welk teken staat op vlak k (0 = W, daarna 0, 9, 8, ..., 1, 0, 9, ..., 1).
const tekenVoorVlak = (k: number): string =>
  k === 0 ? "W" : String((((11 - k) % 10) + 10) % 10);

type VlakProps = {
  k: number;
  schijfSchaal: number;
  clipLinks: string;
  clipRechts: string;
};

// Eén vlak van de cijferrol: blauwe halve schijf + teken dat op de blauwe helft wit
// is en op de witte helft blauw.
const Vlak: React.FC<VlakProps> = ({
  k,
  schijfSchaal,
  clipLinks,
  clipRechts,
}) => {
  const blauwLinks = k % 2 === 0;
  const teken = tekenVoorVlak(k);
  const tekenEl = (kleur: string) =>
    teken === "W" ? (
      <path
        d={W_PAD}
        fill={kleur}
        fillRule="evenodd"
        transform={`translate(${CX} ${CY}) scale(${LOGO.wSchaal}) translate(-256 -256)`}
      />
    ) : (
      <text
        x={CIJFER.x}
        y={CIJFER.basislijn}
        textAnchor="middle"
        fontFamily={anton.fontFamily}
        fontSize={CIJFER.grootte}
        fill={kleur}
      >
        {teken}
      </text>
    );
  return (
    <g>
      <path
        d={halveSchijf(LOGO.schijf, blauwLinks)}
        fill={KLEUR.blauw}
        transform={`translate(${CX} ${CY}) scale(${schijfSchaal}) translate(${-CX} ${-CY})`}
      />
      <g clipPath={`url(#${clipLinks})`}>
        {tekenEl(blauwLinks ? KLEUR.wit : KLEUR.blauw)}
      </g>
      <g clipPath={`url(#${clipRechts})`}>
        {tekenEl(blauwLinks ? KLEUR.blauw : KLEUR.wit)}
      </g>
    </g>
  );
};

const RingLetter: React.FC<{
  teken: string;
  hoek: number;
  onder: boolean;
  start: number;
  frame: number;
}> = ({ teken, hoek, onder, start, frame }) => {
  const p = easeOutCubic(
    interpolate(frame, [start, start + RINGTEKST.duur], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  if (p <= 0) {
    return null;
  }
  const r =
    (onder ? RINGTEKST.straalOnder : RINGTEKST.straalBoven) +
    (teken === "-" ? RINGTEKST.streepjeExtra : 0) +
    RINGTEKST.schuif * (1 - p);
  const draai = onder ? hoek - 180 : hoek;
  // Boven: letter wijst naar buiten; onder: rechtop, voet naar buiten.
  const y = onder
    ? CY + r + RINGTEKST.kaphoogte / 2
    : CY - r + RINGTEKST.kaphoogte / 2;
  return (
    <text
      x={CX}
      y={y}
      transform={`rotate(${draai} ${CX} ${CY}) translate(${CX} 0) scale(${RINGTEKST.smal} 1) translate(${-CX} 0)`}
      textAnchor="middle"
      fontFamily={arimo.fontFamily}
      fontWeight={700}
      fontSize={RINGTEKST.lettergrootte}
      fill={KLEUR.wit}
      opacity={p}
    >
      {teken}
    </text>
  );
};

export const EindBumperZat1: React.FC = () => {
  const frame = useCurrentFrame();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (naam: string) => `eindzat1-${naam}-${uid}`;

  // Horizontale lijn
  const lijnHalf = interpolate(frame, [0, LIJN.eindFrame], [0, 540], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ring
  const ringHoek = uitTabel(RING_HOEK, RING_START, frame);

  // Binnenkant logo
  const binnen = uitTabel(BINNEN, BINNEN_START, frame);
  const rolt = frame >= ROL_START;

  // Cijferrol
  const rolHoek = rolt ? uitTabel(ROL_HOEK, ROL_START, frame) : 0;
  const vlak = Math.round(rolHoek / 180);
  const breedte = Math.abs(Math.cos(((rolHoek - vlak * 180) * Math.PI) / 180));
  const rolBlur = rolt ? uitTabel(ROL_BLUR, ROL_START, frame) : 0;

  // Stippen
  const stip = easeOutCubic(
    interpolate(frame, [STIP.start, STIP.start + STIP.duur], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  // Hulplijnen
  const hulpLengte =
    frame < HULPLIJN_START
      ? 0
      : uitTabel(HULPLIJN_LENGTE, HULPLIJN_START, frame);
  const hulpDekking = uitTabel(HULPLIJN_DEKKING, HULPLIJN_START, frame);
  const hulpBand = uitTabel(HULPLIJN_BAND, HULPLIJN_BAND_START, frame);

  // Dagenrij
  const dagVerschuiving = uitTabel(DAG_VERSCHUIVING, DAG_START, frame);
  const dagSnelheid = Math.abs(
    uitTabel(DAG_VERSCHUIVING, DAG_START, frame + 0.5) -
      uitTabel(DAG_VERSCHUIVING, DAG_START, frame - 0.5),
  );
  const dagBlur = DAG.blurFactor * dagSnelheid;
  const dagBasis =
    frame < DAG_INTRO_START - 1
      ? 0
      : frame <= DAG_INTRO_START + DAG_INTRO.length - 1
        ? DAG_INTRO_NIVEAU *
          uitTabel([0, ...DAG_INTRO], DAG_INTRO_START - 1, frame)
        : interpolate(
            frame,
            [DAG_INTRO_START + DAG_INTRO.length - 1, 62],
            [DAG_INTRO_NIVEAU, DAG_ROL_DEKKING],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
  const dagY = uitTabel(DAG_INTRO_Y, DAG_INTRO_START, frame);
  const focusMidden =
    frame < DAG_FOCUS_START
      ? dagBasis
      : uitTabel(DAG_FOCUS_MIDDEN, DAG_FOCUS_START, frame, 2);
  const focusAnder =
    frame < DAG_FOCUS_START
      ? dagBasis
      : uitTabel(DAG_FOCUS_ANDER, DAG_FOCUS_START, frame, 2);

  const woorden = Array.from({ length: DAG.aantal }, (_, i) => {
    const midden = DAG.eersteMidden + DAG.afstand * i - dagVerschuiving;
    return {
      i,
      midden,
      tekst: DAG.woorden[i % DAG.woorden.length],
      dekking: i === DAG.doel ? focusMidden : focusAnder,
    };
  }).filter((w) => w.midden > -400 && w.midden < 1480 && w.dekking > 0);

  const bovenTekens = RINGTEKST.boven.split("");
  const onderTekens = RINGTEKST.onder.split("");

  return (
    <AbsoluteFill style={{ backgroundColor: KLEUR.achtergrond }}>
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <clipPath id={id("links")} clipPathUnits="userSpaceOnUse">
            <rect x={0} y={0} width={CX} height={1920} />
          </clipPath>
          <clipPath id={id("rechts")} clipPathUnits="userSpaceOnUse">
            <rect x={CX} y={0} width={1080 - CX} height={1920} />
          </clipPath>
          <filter
            id={id("rolblur")}
            filterUnits="userSpaceOnUse"
            x={0}
            y={700}
            width={1080}
            height={720}
          >
            <feGaussianBlur stdDeviation={`${rolBlur} 0`} />
          </filter>
          <filter
            id={id("dagblur")}
            filterUnits="userSpaceOnUse"
            x={-200}
            y={450}
            width={1480}
            height={220}
          >
            <feGaussianBlur stdDeviation={`${dagBlur} 0`} />
          </filter>
          <linearGradient
            id={id("dagmasker-verloop")}
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={0}
            x2={1080}
            y2={0}
          >
            <stop offset={0} stopColor="#fff" stopOpacity={0} />
            <stop
              offset={DAG.maskerRand / 1080}
              stopColor="#fff"
              stopOpacity={1}
            />
            <stop
              offset={1 - DAG.maskerRand / 1080}
              stopColor="#fff"
              stopOpacity={1}
            />
            <stop offset={1} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <mask
            id={id("dagmasker")}
            maskUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={1080}
            height={1920}
          >
            <rect
              x={0}
              y={400}
              width={1080}
              height={300}
              fill={`url(#${id("dagmasker-verloop")})`}
            />
          </mask>
        </defs>

        {/* Horizontale lijn op logohoogte */}
        {lijnHalf > 0 ? (
          <rect
            x={CX - lijnHalf}
            y={LIJN.y}
            width={lijnHalf * 2}
            height={LIJN.dikte}
            fill={KLEUR.lijn}
          />
        ) : null}

        {/* Hulplijnen naast de dag: stuk boven en stuk onder de tekstband */}
        {hulpLengte > 0 ? (
          <g opacity={hulpDekking} fill={KLEUR.hulplijn}>
            {[-1, 1].map((kant) => (
              <React.Fragment key={kant}>
                <rect
                  x={CX + kant * HULPLIJN.dx - HULPLIJN.breed / 2}
                  y={HULPLIJN.boven - hulpLengte}
                  width={HULPLIJN.breed}
                  height={hulpLengte}
                />
                <rect
                  x={CX + kant * HULPLIJN.dx - HULPLIJN.breed / 2}
                  y={HULPLIJN.onder}
                  width={HULPLIJN.breed}
                  height={hulpLengte}
                />
              </React.Fragment>
            ))}
          </g>
        ) : null}

        {hulpBand > 0 ? (
          <g opacity={hulpBand} fill={KLEUR.hulplijn}>
            {[-1, 1].map((kant) => (
              <rect
                key={kant}
                x={CX + kant * HULPLIJN.dx - HULPLIJN.breed / 2}
                y={HULPLIJN.boven}
                width={HULPLIJN.breed}
                height={HULPLIJN.onder - HULPLIJN.boven}
              />
            ))}
          </g>
        ) : null}

        {/* Dagenrij */}
        {woorden.length > 0 ? (
          <g mask={`url(#${id("dagmasker")})`}>
            <g filter={dagBlur > 0.2 ? `url(#${id("dagblur")})` : undefined}>
              {woorden.map((w) => (
                <text
                  key={w.i}
                  x={w.midden + DAG.letterafstand / 2}
                  y={DAG.basislijn + dagY}
                  textAnchor="middle"
                  fontFamily={bigShoulders.fontFamily}
                  fontWeight={800}
                  fontSize={DAG.grootte}
                  letterSpacing={DAG.letterafstand}
                  fill={KLEUR.blauw}
                  opacity={w.dekking}
                >
                  {w.tekst}
                </text>
              ))}
            </g>
          </g>
        ) : null}

        {/* Binnenkant logo: witte schijf (dekt de lijn af) + vlak met W of cijfer */}
        {binnen > 0 ? (
          <g opacity={binnen}>
            <circle cx={CX} cy={CY} r={LOGO.ringBinnen} fill={KLEUR.wit} />
            <g filter={rolBlur > 0.2 ? `url(#${id("rolblur")})` : undefined}>
              <g
                transform={`translate(${CX} 0) scale(${breedte} 1) translate(${-CX} 0)`}
              >
                <Vlak
                  k={vlak}
                  schijfSchaal={rolt ? 1 : binnen}
                  clipLinks={id("links")}
                  clipRechts={id("rechts")}
                />
              </g>
            </g>
          </g>
        ) : null}

        {/* Blauwe ring */}
        {ringHoek > 0 ? (
          <path
            d={ringPad(ringHoek, LOGO.ringBuiten, LOGO.ringBinnen)}
            fill={KLEUR.blauw}
            fillRule="evenodd"
          />
        ) : null}

        {/* Stippen */}
        {stip > 0
          ? [-1, 1].map((kant) => (
              <circle
                key={kant}
                cx={CX + kant * LOGO.stipAfstand}
                cy={CY}
                r={LOGO.stipStraal * stip}
                fill={KLEUR.wit}
              />
            ))
          : null}

        {/* Ringletters */}
        {bovenTekens.map((t, k) => (
          <RingLetter
            key={`b${k}`}
            teken={t}
            hoek={(k - (bovenTekens.length - 1) / 2) * RINGTEKST.bovenStap}
            onder={false}
            start={RINGTEKST.bovenBegin + k * RINGTEKST.bovenInterval}
            frame={frame}
          />
        ))}
        {onderTekens.map((t, k) => (
          <RingLetter
            key={`o${k}`}
            teken={t}
            hoek={RINGTEKST.onderStart + k * RINGTEKST.onderStap}
            onder
            start={RINGTEKST.onderBegin + k * RINGTEKST.onderInterval}
            frame={frame}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
