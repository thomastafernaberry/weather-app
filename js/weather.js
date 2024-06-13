export { getData }

const getUserCords = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((geoPos) => {
            const [lat, lon] = [geoPos.coords.latitude, geoPos.coords.longitude];
            resolve([lat, lon])
        }), (error) => {
            reject(error);
        }
    })
}

async function buildUrl() {

    const userCords = await getUserCords();

    const parameters = {
        latitude: userCords[0], longitude: userCords[1],
        timezone: "auto",
        forecast_days: 4,
        weather: {
            current: ["temperature_2m", "relative_humidity_2m", "weather_code", "wind_speed_10m", "precipitation_probability", "apparent_temperature"],
            hourly: ["temperature_2m", "weather_code"],
            daily: ["temperature_2m_max","temperature_2m_max", "weather_code"]
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
    console.log(data)
    return data
}
