export const getTimezone = async ({ longitude, latitude }) => {
  const tzdbGetUrl = `http://api.timezonedb.com/v2.1/get-time-zone?key=${
    process.env.TZDB_API_KEY || ""
  }&format=json&by=position&lat=${latitude}&lng=${longitude}`;

  try {
    const tzResponse = await fetch(tzdbGetUrl);
    if (!tzResponse.ok) {
      return {
        ok: false,
        error: `timezone_fetch_failed`,
      };
    }
    const tzData = await tzResponse.json();
    const { zoneName } = tzData;

    return { ok: true, data: zoneName };
  } catch {
    return {
      ok: false,
      error: `timezone_fetch_failed`,
    };
  }
};
