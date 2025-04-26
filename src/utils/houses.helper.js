import { swisseph } from "swisseph";
import { calculateDegrees } from "./shared.helper.js";

export const getHouses = (conf) => {
  const houses = [];
  const sidereal_time = swisseph.swe_sidtime(conf.ut);
  const sideral_degree = sidereal_time.siderialTime * 15;
  let armc = sideral_degree + conf.lon;
  if (armc < 0) armc += 360;
  if (armc >= 360) armc -= 360;

  swisseph.swe_houses_ex(conf.ut, 0, conf.lat, conf.lon, "P", (result) => {
    result.house.forEach((element, index) => {
      const zodIndex = Math.floor(element / 30);
      const lang30 = 360 - element;

      const { degrees, minutes, seconds } = calculateDegrees(element);

      houses.push({
        house: index,
        start_degree: lang30,
        sign_id: zodIndex,
        degrees: degrees % 30,
        minutes,
        seconds,
      });
    });
  });

  return houses;
};
