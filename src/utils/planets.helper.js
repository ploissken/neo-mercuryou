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
  const ascendant = houses[0].start_degree;

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
    const renderLongitude = -(planetLongitude + ascendant);

    planets.push({
      planet_id: planet,
      planetIndex: planet,
      planet_name: defaultPlanetNames[planet],
      sign_id: zodIndex,
      signIndex: zodIndex,
      longitude: planetLongitude,
      renderLongitude,
      renderMarker: renderLongitude,
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

export const treatPlanetaryCollision = (planets) => {
  const COLLISION_THRESHOLD = 10;
  const SPREAD_DELTA = 8;

  const sortedPlanets = planets.sort(
    (a, b) => a.renderLongitude - b.renderLongitude
  );

  const clusters = [];
  let currentCluster = [];

  for (let i = 0; i < sortedPlanets.length; i++) {
    const currentPlanet = sortedPlanets[i];
    const previousPlanet = sortedPlanets[i - 1];

    if (
      currentCluster.length === 0 ||
      (previousPlanet &&
        Math.abs(
          currentPlanet.renderLongitude - previousPlanet.renderLongitude
        ) <= COLLISION_THRESHOLD)
    ) {
      currentCluster.push(currentPlanet);
    } else {
      clusters.push(currentCluster);
      currentCluster = [currentPlanet];
    }
  }

  if (currentCluster.length > 0) {
    clusters.push(currentCluster);
  }

  const colisionTreatedPlanets = [];

  clusters.forEach((cluster) => {
    const clusterCenter =
      cluster.reduce((sum, planet) => sum + planet.renderLongitude, 0) /
      cluster.length;

    cluster.forEach((planet, index) => {
      const adjustedLongitude =
        clusterCenter + (index - Math.floor(cluster.length / 2)) * SPREAD_DELTA;
      planet.renderLongitude = adjustedLongitude;
      colisionTreatedPlanets.push(planet);
    });
  });

  return colisionTreatedPlanets.sort((a, b) => a.planetIndex - b.planetIndex);
};
