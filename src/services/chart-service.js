import { getAspects, getPlanets, getHouses } from "../utils/index.js";
import { utc_to_jd, constants } from "sweph";
import { getTimezone } from "./timezone-service.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export const createChart = async ({ chartDate, location }) => {
  const chart = {};
  let date = new Date(dayjs(chartDate).utc(true).format());
  let timezone = "unknown";
  const naiveDate = {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: 0,
    weekDay: date.getDay(),
  };

  const { latitude, longitude } = location || {};
  if (latitude && longitude) {
    const tzResponse = await getTimezone({ latitude, longitude });
    if (tzResponse.ok) {
      timezone = tzResponse.data;
      const isoDateWithTZ = dayjs.tz(chartDate, timezone).toISOString();
      date = new Date(isoDateWithTZ);
      console.log("date TZ is", date);
    }
  }

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
    julDayUT: ut,
    utc,
    location,
    inputDate: {
      naiveDate,
      date: chartDate,
    },
    timezone,
  };

  chart.planets = planets;
  chart.houses = houses;
  chart.ascendant = houses[0];
  chart.aspects = getAspects(planets);

  //   chart.elements = calculateElements(chart.planets, chart.houses);
  return chart;
};
