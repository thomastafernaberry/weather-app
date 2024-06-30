class Fetch {

    parameters = [];
    baseUrl = '';
    query = '';
    fullUrl = '';
    cacheName = '';

    buildQuery(parameters) {
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

    async getResponseAsync(url, cacheName) {

        async function deleteCacheAsync() {
            try {
                const toDeleteCache = await caches.open(cacheName); 
                for (const urlInCache of await toDeleteCache.keys()) {
                    console.log(`Deleting ${urlInCache} of ${toDeleteCache}`);
                    toDeleteCache.delete(urlInCache);
                }
            } catch (error) {
                console.error(error);
            }
        }

        if (navigator.caches) {
            await deleteCacheAsync();
            const cache = await caches.open(cacheName);
            const response = await cache.match(url);
            if (response === undefined) {
                console.log('Response not found in cache. Setting new one...')
                await cache.add(url);
                return await cache.match(url);
            }
            return response
        } else {
            console.log('Cache API not available. Using Fetch.');
            return await fetch(url);
        }
    }

    async getResponseAsJsonAsync(fullUrl, cacheName) {
        const response = await this.getResponseAsync(fullUrl, cacheName);
        console.log('To JSON: ' + response)
        return await response.json();
    }

}

export default class Weather extends Fetch {
    constructor() {
        super();
    }
    async getUserCoordsAsync() {
        const userCoords = new Promise((resolve, reject) => {
            function success(geoPosition) {
                const userLat = geoPosition.coords.latitude;
                const userLon = geoPosition.coords.longitude;
                resolve ([userLat, userLon])
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
        let userCoords = [-34.61, -58.38];
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
        this.query = super.buildQuery(this.parameters);
        this.fullUrl = this.baseUrl + this.query;
        this.cacheName = 'weather';

        return this;
    }
    async getWeatherAsync() {
        return await super.getResponseAsync(this.fullUrl, this.cacheName);
    }
    async getWeatherJsonAsync() {
        return await super.getResponseAsJsonAsync(this.fullUrl, this.cacheName);
    }
}

const weatherObj = await (new Weather).initAsync();
const weatherJson = await weatherObj.getWeatherJsonAsync();
export { weatherJson };
