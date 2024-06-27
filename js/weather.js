class Fetch {

    parameters = [];
    baseUrl = '';
    query = '';
    fullUrl = '';

    setQuery(parameters) {
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
            query = query.slice(0, -1);
        }
        return query;
    }

    async getResponseAsync(fullUrl, cacheName) {

        async function setResponseToCacheAsync(fullUrl, cacheName) {
            try {
                const browserCache = await caches.open(cacheName);
                browserCache.add(fullUrl);
            } catch (error) {
                console.alert(error);
            }
        }
    
        async function getResponseFromCacheAsync(fullUrl, cacheName) {
            try {
                const browserCache = await caches.open(cacheName);
                const response = browserCache.match(fullUrl);
                return response;
            } catch (error) {
                console.alert(error);
            }
        }

        try {
            return await getResponseFromCacheAsync(fullUrl, cacheName);
        } catch {
            await setResponseToCacheAsync(fullUrl, cacheName);
            return await getResponseFromCacheAsync(fullUrl, cacheName);
        }
    }
}

export default class Weather extends Fetch {

    async #getUserCoords() {
        let userCoords = new Promise((resolve, reject) => {
            function success(geoPosition) {
                const userLat = geoPosition.coords.latitude;
                const userLon = geoPosition.coords.longitude;
                resolve([userLat, userLon])
            }
            function error(error) {
                reject(error);
            }
            const options = {
                timeout: 5000,
                enableHighAccuracy: true
            }
            navigator.geolocation.getCurrentPosition(success, error, options);
        })
        return userCoords;
    }

    async initAsync() {
        let userCoords = await this.#getUserCoords();
        this.parameters = {
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
        this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
        this.query = super.setQuery(this.parameters);
        this.fullUrl = this.baseUrl + this.query;
        return this;
    }

    async getResponseAsync() {
        return await super.getResponseAsync(this.fullUrl, 'weather');
    }

    async getResponseAsJsonAsync() {
        const response = await this.getResponseAsync();
        return response.json();
    }
}
