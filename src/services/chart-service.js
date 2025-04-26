import { getAspects, getPlanets, getHouses } from "../utils/index.js";
import { utc_to_jd, constants } from "sweph";

export const createChart = ({ date, longitude, latitude }) => {
  const chart = {};

  const utc = {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: 0,
  };

  const {
    data: [, ut],
  } = utc_to_jd(
    utc.year,
    utc.month,
    utc.day,
    utc.hour,
    utc.minute,
    utc.second,
    constants.SE_GREG_CAL
  );

  const conf = {
    ut,
    lat: latitude,
    lon: longitude,
  };
  const planets = getPlanets(conf.ut);
  const houses = getHouses(conf);

  //   setPlanetHouse(plan, hous);

  chart.metadata = {
    date,
    latitude,
    longitude,
    julDayUT: ut,
    utc,
  };

  chart.planets = planets;
  chart.houses = houses;
  chart.ascendant = houses[0];
  chart.aspects = getAspects(planets);

  //   chart.elements = calculateElements(chart.planets, chart.houses);

  return chart;
};
