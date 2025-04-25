export const calculateDegrees = (longitude) => {
  const degrees = Math.floor(longitude);
  const minFrac = (longitude - degrees) * 60;
  const minutes = Math.floor(minFrac);
  const seconds = Math.floor((minFrac - minutes) * 60);

  return { degrees, minutes, seconds };
};
