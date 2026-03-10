const axios = require("axios");

async function reverseGeocode(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  const response = await axios.get(url, {
    headers: {
      "User-Agent": "civic-issue-platform",
    },
  });

  const address = response.data.address || {};

  return {
    area:
      address.suburb ||
      address.neighbourhood ||
      address.village ||
      address.town ||
      "",
    city: address.city || address.county || "",
    state: address.state || "",
  };
}

module.exports = { reverseGeocode };
