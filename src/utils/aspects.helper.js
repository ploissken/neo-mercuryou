const aspects = [
  { class: "Conjunction", classID: 0, degree: 0, orbTolerance: 10 },
  { class: "SemiSextile", classID: 1, degree: 30, orbTolerance: 3 },
  { class: "SemiSquare", classID: 2, degree: 45, orbTolerance: 3 },
  { class: "SemiSquare", classID: 2, degree: 225, orbTolerance: 3 },
  { class: "Sextile", classID: 3, degree: 60, orbTolerance: 4 },
  { class: "Quintile", classID: 4, degree: 72, orbTolerance: 4 },
  { class: "Square", classID: 5, degree: 90, orbTolerance: 10 },
  { class: "Square", classID: 5, degree: 270, orbTolerance: 10 },
  { class: "Trine", classID: 6, degree: 120, orbTolerance: 20 },
  { class: "Trine", classID: 6, degree: 240, orbTolerance: 20 },
  { class: "SesquiQuadrate", classID: 7, degree: 135, orbTolerance: 4 },
  { class: "SesquiQuadrate", classID: 7, degree: 270, orbTolerance: 4 },
  { class: "BiQuintile", classID: 8, degree: 144, orbTolerance: 4 },
  { class: "BiQuintile", classID: 8, degree: 288, orbTolerance: 4 },
  { class: "Quincux", classID: 9, degree: 150, orbTolerance: 4 },
  { class: "Opposition", classID: 10, degree: 180, orbTolerance: 10 },
];

function aspectStr(asp, d) {
  return 1 - Math.abs(d - asp.degree) / asp.orbTolerance;
}

function doubleToDegree(deg) {
  let d = Math.floor(deg);
  let minfloat = (deg - d) * 60;
  let m = Math.floor(minfloat);
  let secfloat = (minfloat - m) * 60;
  let s = Math.round(secfloat);
  if (s >= 30) {
    m++;
  }
  if (m === 60) {
    d++;
    m = 0;
  }
  return d + "°" + (m > 9 ? m : "0" + m);
}

const getAspectComplete = (p1, p2) => {
  let d = Math.abs(p1.longitude - p2.longitude);
  let asp = aspects.find(
    (a) =>
      d >= Math.abs(a.degree - a.orbTolerance) &&
      d <= Math.abs(a.degree + a.orbTolerance)
  );

  if (asp) {
    // fast forward planet position based on its speed
    let p1fflon = p1.longitude + p1.speed;
    let p2fflon = p2.longitude + p2.speed;
    let dff = Math.abs(p1fflon - p2fflon);

    // if new aspect's strength is higher, it is an applicative aspect
    /*
     * This approach produces different results from astro.com, (aka 'bug'),
     * apparently related to fast-moving planets. as the aspects shall
     * consider the planets involved soon, 'incongruency' stays.
     */
    let dir = aspectStr(asp, dff) > aspectStr(asp, d) ? "a" : "s";

    return {
      aID: asp.classID,
      class: asp.class,
      value: aspectStr(asp, d),
      dms: doubleToDegree(Math.abs(d - asp.degree)),
      direction: dir,
    };
  } else {
    return -1;
  }
};

export const getAspects = (planets) => {
  let aspectsArray = [];

  for (var i = 0; i < planets.length; i++) {
    for (var j = 0; j < planets.length; j++) {
      if (i === j) continue; // dont conjunct itself
      if (j > i) continue; // remove duplicates
      const asp = getAspectComplete(planets[i], planets[j]);
      if (asp !== -1) {
        aspectsArray.push({
          aspect_id: asp.aID,
          planet_a_id: planets[i].planet_id,
          planet_b_id: planets[j].planet_id,
          value: asp.value,
          dms: asp.dms,
          direction: asp.direction,
        });
      }
    }
  }

  return aspectsArray;
};
