import { calculateDegrees } from "./shared.helper.js";
import { constants, calc_ut } from "sweph";

const flag = constants.SEFLG_SPEED | constants.SEFLG_MOSEPH;

const defaultChartPlanets = [
  constants.SE_SUN,
  constants.SE_MOON,
  constants.SE_MERCURY,
  constants.SE_VENUS,
  constants.SE_MARS,
  constants.SE_JUPITER,
  constants.SE_SATURN,
  constants.SE_URANUS,
  constants.SE_NEPTUNE,
  constants.SE_PLUTO,
];

export const getPlanets = (juldayUT) => {
  const planets = [];

  defaultChartPlanets.forEach((planet) => {
    const {
      data: [longitude, , , longitudeSpeed],
    } = calc_ut(juldayUT, planet, flag);
    const planetSpeed = Math.round(longitudeSpeed * 1000) / 1000;

    const direction =
      planetSpeed <= -0.01
        ? "retrograde"
        : planetSpeed >= 0.01
        ? "direct"
        : "stationary";

    const zodIndex = Math.floor(longitude / 30);
    const lang30 = longitude - zodIndex * 30;
    const { degrees, minutes, seconds } = calculateDegrees(lang30);

    planets.push({
      planet_id: planet,
      sign_id: zodIndex,
      longitude: (longitude + 180) % 360,
      degrees,
      minutes,
      seconds,
      house: "CALC_ME",
      direction: direction,
      speed: longitudeSpeed,
    });
  });

  return planets;
};
