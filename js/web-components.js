import { weatherJson } from "./weather.js";
import { appCurrentLanguage } from "./language.js";

const currentWeather = weatherJson.current;
const currentUnits = weatherJson.current_units;

class CityDate extends HTMLElement {
    currentDate = new Date(currentWeather.time);
    options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
    }
    constructor() {
        super();
    }
    timezoneCityParser(timezone) {
        const lastSlashIndex = timezone.lastIndexOf('/');
        const city = timezone.slice(lastSlashIndex + 1).replace('_', ' ');
        return city;
    }
    connectedCallback() {
        this.innerHTML = `
        <div class="big card">
            <p>${this.currentDate.toLocaleString(navigator, this.options)}</p>
            <h1>${this.timezoneCityParser(weatherJson.timezone)}</h1>
        </div>`
    }
}

class CurrentWeatherTemperature extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
        <div class="medium card">
            <h2>${appCurrentLanguage.weatherCodeDescription[currentWeather.weather_code]}</h2>
            <h1>${currentWeather.temperature_2m}${currentUnits.temperature_2m}</h1>
        </div>`
    }
}

class CurrentWeatherData extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
        <div class="current-weather-data-container">
            <div class="small card">
                <h3>${appCurrentLanguage.humidity}</h3>
                <p>${currentWeather.relative_humidity_2m + currentUnits.relative_humidity_2m}</p>
            </div>
            <div class="small card">
                <h3>${appCurrentLanguage.rain}</h3>
                <p>${currentWeather.precipitation_probability + currentUnits.precipitation_probability}</p>
            </div>
            <div class="small card">
                <h3>${appCurrentLanguage.wind}</h3>
                <p>${currentWeather.wind_speed_10m + currentUnits.wind_speed_10m}</p>
            </div>
            <div class="small card">
                <h3>${appCurrentLanguage.apparentTemp}</h3>
                <p>${currentWeather.apparent_temperature + currentUnits.apparent_temperature}</p>
            </div>
        </div>`
    }
}

class ChartTodayTemperature extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
        <section>
            <div class="chart">
                <h2 id="title-today-temperature">${appCurrentLanguage.todayTemp}</h2>
                <canvas class="today-chart" id="chart"></canvas>
            </div>
        </section>`
    }
}

class WeatherFunFacts extends HTMLElement {
    constructor() {
        super();
        this.randomFactIndex = Math.floor((Math.random() * appCurrentLanguage.facts.length));
    }
    connectedCallback() {
        this.innerHTML = `
        <div class="full card">
            <h2 style="margin-bottom: 20px;text-align: left;">${appCurrentLanguage.didYouKnow}</h2>
            <p id="fun-fact">${appCurrentLanguage.facts[this.randomFactIndex]}</p>
        </div>`
    }
}

class FourDaysPronostic extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
        <h2 id="title-four-days-pronostic">Four days weather</h2>
        <div class="four-days-pronostic-container">
            <div class="small card pronostic">
                <h4>Lunes 9/7</h4>
                <img src="/media/cloud.svg" alt="">
                <p>Lluvioso</p>
            </div>
            <div class="small card pronostic">
                <h4>Martes 9/7</h4>
                <img src="/media/cloud.svg" alt="">
                <p>Nublado</p>
            </div>
            <div class="small card pronostic">
                <h4>Miércoles 9/7</h4>
                <img src="/media/cloud.svg" alt="">
                <p>Soleado</p>
            </div>
            <div class="small card pronostic">
                <h4>Jueves 9/7</h4>
                <img src="/media/cloud.svg" alt="">
                <p>Tormentas</p>
            </div>
        </div>`
    }
}

customElements.define('city-date', CityDate);
customElements.define('current-weather-temperature', CurrentWeatherTemperature);
customElements.define('current-weather-data', CurrentWeatherData);
customElements.define('weather-fun-facts', WeatherFunFacts);
customElements.define('chart-today-temperature', ChartTodayTemperature);

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
