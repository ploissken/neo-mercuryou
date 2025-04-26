import { calculateDegrees } from "./shared.helper.js";
const swisseph = await import("swisseph");

const flag = swisseph.SEFLG_SPEED | swisseph.SEFLG_MOSEPH;

const defaultChartPlanets = [
  swisseph.SE_SUN,
  swisseph.SE_MOON,
  swisseph.SE_MERCURY,
  swisseph.SE_VENUS,
  swisseph.SE_MARS,
  swisseph.SE_JUPITER,
  swisseph.SE_SATURN,
  swisseph.SE_URANUS,
  swisseph.SE_NEPTUNE,
  swisseph.SE_PLUTO,
];

export const getPlanets = (juldayUT) => {
  const planets = [];

  defaultChartPlanets.forEach((planet) => {
    swisseph.swe_calc_ut(juldayUT, planet, flag, function (body) {
      const planetSpeed = Math.round(body.longitudeSpeed * 1000) / 1000;

      const direction =
        planetSpeed <= -0.01
          ? "retrograde"
          : planetSpeed >= 0.01
          ? "direct"
          : "stationary";

      const zodIndex = Math.floor(body.longitude / 30);
      const lang30 = body.longitude - zodIndex * 30;
      const { degrees, minutes, seconds } = calculateDegrees(lang30);

      planets.push({
        planet_id: planet,
        sign_id: zodIndex,
        longitude: (body.longitude + 180) % 360,
        degrees,
        minutes,
        seconds,
        house: "CALC_ME",
        direction: direction,
        speed: body.longitudeSpeed,
      });
    });
  });

  return planets;
};
