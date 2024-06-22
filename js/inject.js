import { getWeatherData } from "./weather.js";
import { appCurrentLanguage } from "./language.js";

function timezoneCityParser(timezone) {
    const lastSlashIndex = timezone.lastIndexOf('/');
    const city = timezone.slice(lastSlashIndex + 1).replace('_', ' ');
    return city;
}

document.addEventListener('DOMContentLoaded', () => {
    const $ = (e) => document.getElementById(e);
    // Definitions' names that are DOM elements start with $ 
    const $CITY = $('city');
    const $CURRENT_TEMP = $('current-temperature');
    const $CURRENT_HUMIDITY = $('current-humidity');
    const $CURRENT_WEATHER = $('weather');
    const $CURRENT_WIND_SPEED = $('wind-speed');
    const $CURRENT_PRECIP_PROB = $('precipitation-probability');
    const $CURRENT_APPARENT_TEMP = $('current-apparent-temperature');
    const $FUN_FACT = $('fun-fact');
    const $CURRENT_DATE = $('current-date');
    // const $PREVIOUS_FACT_BUTTON = $('previous-fact-button');
    // const $NEXT_FACT_BUTTON = $('next-fact-button');
    
    // $TITLE is used for to-be-translated text
    const $TITLE_CURRENT_HUMIDITY = $('title-current-humidity');
    const $TITLE_CURRENT_WIND = $('title-current-wind');
    const $TITLE_CURRENT_RAIN = $('title-current-rain');
    const $TITLE_CURRENT_APPARENT_TEMP = $('title-current-apparent-temperature');
    const $TITLE_TODAY_TEMPERATURE = $('title-today-temperature');
    const $TITLE_DID_YOU_KNOW = $('title-did-you-know');
    // const $TITLE_FUN_WEATHER_FACTS = $('title-fun-weather-facts');
    // const $TITLE_FOUR_DAYS_PRONOSTIC = $('title-four-days-pronostic');

    async function injectWeatherDataInDOM() {
        const data = await getWeatherData();
        const currentWeather = data.current;
        const currentUnits = data.current_units;
        const currentDate = new Date(data.current.time);
        const options = {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        }
        console.log(appCurrentLanguage);
        // Weather data.
        $CURRENT_DATE.innerText = `${currentDate.toLocaleString(navigator, options)}`;
        $CITY.innerText = timezoneCityParser(data.timezone);
        $CURRENT_TEMP.innerText = `${currentWeather.temperature_2m}${currentUnits.temperature_2m}`;
        $CURRENT_HUMIDITY.innerText = `${currentWeather.relative_humidity_2m}${currentUnits.relative_humidity_2m}`;
        $CURRENT_WEATHER.innerText = `${appCurrentLanguage.weatherCodeDescription[currentWeather.weather_code]}`;
        $CURRENT_WIND_SPEED.innerText = `${currentWeather.wind_speed_10m}${currentUnits.wind_speed_10m}`;
        $CURRENT_PRECIP_PROB.innerText = `${currentWeather.precipitation_probability}${currentUnits.precipitation_probability}`;
        $CURRENT_APPARENT_TEMP.innerText = `${currentWeather.apparent_temperature}${currentUnits.apparent_temperature}`;
        $FUN_FACT.innerText = appCurrentLanguage.facts[Math.floor((Math.random() * appCurrentLanguage.facts.length))];
        // Text translation.
        $TITLE_CURRENT_HUMIDITY.innerText = appCurrentLanguage.humidity;
        $TITLE_CURRENT_WIND.innerText = appCurrentLanguage.wind;
        $TITLE_CURRENT_RAIN.innerText = appCurrentLanguage.rain;
        $TITLE_CURRENT_APPARENT_TEMP.innerText = appCurrentLanguage.apparentTemp;
        $TITLE_TODAY_TEMPERATURE.innerText = appCurrentLanguage.todayTemp;
        $TITLE_DID_YOU_KNOW.innerText = appCurrentLanguage.didYouKnow;
        // $TITLE_FUN_WEATHER_FACTS.innerText = language.funWeatherFacts;
        // $TITLE_FOUR_DAYS_PRONOSTIC.innerText = language;
    }

    injectWeatherDataInDOM();
})


// // TODO DEBUG FACT BUTTONS

// let currentFactIndex = weatherFacts.findIndex((fact) => fact === $FUN_FACT.innerText);

// function setFact(factIndex) {
//     $FUN_FACT.innerText = weatherFacts[factIndex];
//     currentFactIndex = factIndex;
// }

// $PREVIOUS_FACT_BUTTON.addEventListener('click', () => {
//     console.log(`currentFactIndex is ${currentFactIndex}`)
//     console.log(`next is ${currentFactIndex - 1}`)
//     if ((currentFactIndex - 1) >= 0) {
//         setFact(currentFactIndex - 1);
//     } else {
//         console.log(weatherFacts.length)
//         setFact(weatherFacts.length)
//     }
// })

// $NEXT_FACT_BUTTON.addEventListener('click', () => {
//     console.log(`currentFactIndex is ${currentFactIndex}`)
//     console.log(`next is ${currentFactIndex + 1}`)
//     if ((currentFactIndex) < (weatherFacts.length - 2)) {
//         setFact(currentFactIndex + 1)
//     } else {
//         setFact(weatherFacts[0])
//     }
// })
