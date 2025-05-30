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

const defaultPlanetNames = [
  "SUN",
  "MOON",
  "MERCURY",
  "VENUS",
  "MARS",
  "JUPITER",
  "SATURN",
  "URANUS",
  "NEPTUNE",
  "PLUTO",
];

const getHouseForPlanet = (rotatedLongitude, houses) => {
  const sortedHouses = [...houses].sort(
    (a, b) => b.normalized_degree - a.normalized_degree
  );

  for (let i = 0; i < sortedHouses.length; i++) {
    const current = sortedHouses[i];
    const next = sortedHouses[(i + 1) % sortedHouses.length];

    const start = current.normalized_degree;
    const end = next.normalized_degree;

    if (start > end) {
      if (rotatedLongitude <= start && rotatedLongitude > end) {
        return current.house;
      }
    } else {
      if (rotatedLongitude <= start || rotatedLongitude > end) {
        return current.house;
      }
    }
  }

  return null;
};

export const getPlanets = (juldayUT, houses) => {
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
    const planetLongitude = (longitude + 180) % 360;

    planets.push({
      planet_id: planet,
      planet_name: defaultPlanetNames[planet],
      sign_id: zodIndex,
      longitude: planetLongitude,
      degrees,
      minutes,
      seconds,
      house: getHouseForPlanet(planetLongitude, houses),
      direction: direction,
      speed: longitudeSpeed,
    });
  });

  return planets;
};
