class Fetch {

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
     };

     async getResponseAsync(url, cacheName) {

          async function deleteOldCacheAsync() {

               function isResponseOld(response) {
                    const currentDate = new Date();
                    const responseCreationDate = new Date(response.headers.get('dateCreatedInUTC'));
                    const fifteenMinutesInMs = 15 * 60 * 1000;
                    const deleteDate = new Date(responseCreationDate.getTime() + fifteenMinutesInMs);
                    if (deleteDate <= currentDate) {
                         return true;
                    }
                    return false;
               }

               try {
                    const cache = await caches.open(cacheName);
                    for (const response of await cache.matchAll()) {
                         if (isResponseOld(response)) {
                              console.log('Deleting old response in cache...');
                              cache.delete(url);
                         }
                    }
               }
               catch (error) {
                    console.error(error);
               }

          };

          if (window.caches) {
               await deleteOldCacheAsync();
               const cache = await caches.open(cacheName);
               const responseInCache = await cache.match(url);

               if (responseInCache === undefined) {
                    console.log('Response for current URL is not in cache. Adding it...');
                    const response = await fetch(url);
                    const currentDateInUTC = (new Date()).toUTCString();
                    const newResponse = new Response(response.body, { headers: { dateCreatedInUTC: currentDateInUTC } });
                    await cache.put(url, newResponse);
                    return await cache.match(url);
               }

               return responseInCache;

          }

          console.log('Cache API not available. Using Fetch.');
          return await fetch(url);

     };

     async getResponseAsJsonAsync(url, cacheName) {
          const response = await this.getResponseAsync(url, cacheName);
          return await response.json();
     };

}

export default class Weather extends Fetch {
     constructor() {
          super();
     };

     async getUserCoordsAsync() {
          if (navigator.geolocation) {
               const userCoords = new Promise((resolve, reject) => {
                    function success(geoPosition) {
                         const userLat = geoPosition.coords.latitude;
                         const userLon = geoPosition.coords.longitude;
                         resolve([userLat, userLon])
                    }
                    function error() {
                         resolve([-34.61, -58.38]); // Buenos Aires Coordinates.
                    }
                    const options = {
                         timeout: 5000,
                         enableHighAccuracy: true
                    }
                    navigator.geolocation.getCurrentPosition(success, error, options);
               })
               return userCoords;
          }
     };

     async initAsync() {
          let userCoords = await this.getUserCoordsAsync();
          this.parameters = {
               latitude: userCoords[0],
               longitude: userCoords[1],
               timezone: "auto",
               forecast_days: 7,
               weather: {
                    current: ["temperature_2m", "relative_humidity_2m", "weather_code", "wind_speed_10m", "precipitation_probability", "apparent_temperature"],
                    hourly: ["temperature_2m", "weather_code"],
                    daily: ["temperature_2m_max", "temperature_2m_min", "weather_code"]
               }
          }
          this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
          this.query = super.buildQuery(this.parameters);
          this.fullUrl = this.baseUrl + this.query;
          this.cacheName = 'weather';
          return this;
     };

     async getWeatherAsync() {
          return await super.getResponseAsync(this.fullUrl, this.cacheName);
     };

     async getWeatherJsonAsync() {
          return await super.getResponseAsJsonAsync(this.fullUrl, this.cacheName);
     };

}

const weatherObj = await (new Weather).initAsync();
const weatherJson = await weatherObj.getWeatherJsonAsync();
export { weatherJson };
