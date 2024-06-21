import { getData } from "./weather.js";
import { appLanguage } from "./language.js";

const $CITY = document.getElementById('city');
const $CURRENT_TEMP = document.getElementById('current-temperature');
const $CURRENT_HUMIDITY = document.getElementById('current-humidity');
const $CURRENT_WEATHER = document.getElementById('weather');
const $CURRENT_WIND_SPEED = document.getElementById('wind-speed');
const $CURRENT_PRECIP_PROB = document.getElementById('precipitation-probability');
const $CURRENT_APPARENT_TEMP = document.getElementById('current-apparent-temperature');
const $FUN_FACT = document.getElementById('fun-fact');
const $CURRENT_DATE = document.getElementById('current-date');
// const $PREVIOUS_FACT_BUTTON = document.getElementById('previous-fact-button');
// const $NEXT_FACT_BUTTON = document.getElementById('next-fact-button');

function cityParser(timezone) {
    const lastSlashIndex = timezone.lastIndexOf('/');
    const city = timezone.slice(lastSlashIndex + 1).replace('_', ' ');
    return city;
}

async function replaceElements() {
    const data = await getData();

    const currentDate = new Date(data.current.time);
    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }

    $CURRENT_DATE.innerText = `${currentDate.toLocaleString(navigator, options)}`;
    $CITY.innerText = cityParser(data.timezone);
    $CURRENT_TEMP.innerText = `${data.current.temperature_2m}${data.current_units.temperature_2m}`;
    $CURRENT_HUMIDITY.innerText = `${data.current.relative_humidity_2m} ${data.current_units.relative_humidity_2m}`;
    $CURRENT_WEATHER.innerText = `${appLanguage.weatherCodeDescription[data.current.weather_code]}`;
    $CURRENT_WIND_SPEED.innerText = `${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`;
    $CURRENT_PRECIP_PROB.innerText = `${data.current.precipitation_probability} ${data.current_units.precipitation_probability}`;
    $CURRENT_APPARENT_TEMP.innerText = `${data.current.apparent_temperature} ${data.current_units.apparent_temperature}`;
    $FUN_FACT.innerText = appLanguage.facts[Math.floor((Math.random() * appLanguage.facts.length))];
}

replaceElements();

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
