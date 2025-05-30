import { calculateDegrees } from "./shared.helper.js";
import { sidtime, houses_ex } from "sweph";

export const getHouses = (conf) => {
  if (!conf.lat || !conf.lon) {
    return [];
  }

  const chartHouses = [];
  const sidereal_time = sidtime(conf.ut);
  const sideral_degree = sidereal_time.siderialTime * 15;
  let armc = sideral_degree + conf.lon;
  if (armc < 0) armc += 360;
  if (armc >= 360) armc -= 360;

  const {
    data: { houses },
  } = houses_ex(conf.ut, 0, conf.lat, conf.lon, "P");
  houses.forEach((longitude, index) => {
    const zodIndex = Math.floor(longitude / 30);
    const lang30 = 360 - longitude;

    const { degrees, minutes, seconds } = calculateDegrees(longitude);

    chartHouses.push({
      house: index,
      start_degree: lang30,
      normalized_degree: (longitude + 180) % 360,
      sign_id: zodIndex,
      degrees: degrees % 30,
      minutes,
      seconds,
    });
  });

  return chartHouses;
};
