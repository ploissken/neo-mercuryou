import { constants } from "sweph";

export const calculateElements = (planets) => {
  let earth = 0;
  let fire = 0;
  let water = 0;
  let air = 0;

  planets.forEach((planet) => {
    if (planet.planetIndex >= constants.SE_URANUS) {
      return;
    } else {
      switch (planet.signIndex) {
        case 0:
        case 4:
        case 8:
          fire++;
          break;
        case 1:
        case 5:
        case 9:
          earth++;
          break;
        case 2:
        case 6:
        case 10:
          air++;
          break;
        case 3:
        case 7:
        case 11:
          water++;
          break;
        default:
          break;
      }
    }
  });
  const total = earth + fire + water + air;
  return {
    earth: (earth / total) * 100,
    fire: (fire / total) * 100,
    water: (water / total) * 100,
    air: (air / total) * 100,
  };
};
