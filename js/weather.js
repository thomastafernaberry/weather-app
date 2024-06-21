export { getData }

async function getUserCoords() {
    let userCoords = new Promise((resolve, reject) => {
        function success(geoPosition) {
            const userLat = geoPosition.coords.latitude;
            const userLon = geoPosition.coords.longitude;
            resolve([userLat, userLon])
        }
        function error(error) {
            reject(error)
        }
        const options = {
            timeout: 5000,
            enableHighAccuracy: true
        }
        navigator.geolocation.getCurrentPosition(success, error, options);
    })
    return userCoords;
}

async function buildUrl() {
    const userCoords = await getUserCoords();
    const parameters = {
        latitude: userCoords[0], 
        longitude: userCoords[1],
        timezone: "auto",
        forecast_days: 4,
        weather: {
            current: ["temperature_2m", "relative_humidity_2m", "weather_code", "wind_speed_10m", "precipitation_probability", "apparent_temperature"],
            hourly: ["temperature_2m", "weather_code"],
            daily: ["temperature_2m_max", "temperature_2m_max", "weather_code"]
        }
    }
    const baseUrl = 'https://api.open-meteo.com/v1/forecast';
    function buildQuery() {
        let query = '?';
        for (const [key, value] of Object.entries(parameters)) {
            if (typeof value === 'object') {
                for (const [k, v] of Object.entries(value)) {
                    query += `${k}=${v}&`;
                }
            }
            else {
                query += `${key}=${value}&`;
            }
        }
        if (query.endsWith('&')) {
            query = query.slice(0, -1)
        }
        return query
    }
    return baseUrl + buildQuery();
}

async function getData() {
    const url = await buildUrl();
    const data = await fetch(url).then(result => result.json());
    return data;
}
