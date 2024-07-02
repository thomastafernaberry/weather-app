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

class Pronostic extends HTMLElement {
    constructor() {
        super();
    }
    getDateNames(date) {
        const dateObj = new Date(date);
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'numeric'
            
        }
        return dateObj.toLocaleString('en', options);
    }
    getForecast(daysNumber) {
        let forecastArray = [];
        for (let i = 0; i <= daysNumber; i++) {
            forecastArray.push(
                {
                    date: this.getDateNames(weatherJson.daily.time[i]),
                    maxTemp: weatherJson.daily.temperature_2m_max[i],
                    minTemp: weatherJson.daily.temperature_2m_min[i]
                }
            )
        }
        return forecastArray;  
    }
}

class FourDaysPronostic extends Pronostic {
    constructor() {
        super();
    }
    connectedCallback() {
        try {
            const forecastArray = super.getForecast(4);
            let forecast1 = forecastArray[1];
            let forecast2 = forecastArray[2];
            let forecast3 = forecastArray[3];
            let forecast4 = forecastArray[4];
            let unit = weatherJson.daily_units.temperature_2m_max;
            this.innerHTML = `
            <section class="weather">
            <h2>Four days weather</h2>
            <div class="four-days-pronostic-container">
                <div class="card pronostic">
                    <h4>${forecast1.date}</h4>
                    <p>Max. ${forecast1.maxTemp}${unit}</p>
                    <p>Min. ${forecast1.minTemp}${unit}</p>
                </div>
                <div class="card pronostic">
                    <h4>${forecast2.date}</h4>
                    <p>Max. ${forecast2.maxTemp}${unit}</p>
                    <p>Min. ${forecast2.minTemp}${unit}</p>
                </div>
                <div class="card pronostic">
                    <h4>${forecast3.date}</h4>
                    <p>Max. ${forecast3.maxTemp}${unit}</p>
                    <p>Min. ${forecast3.minTemp}${unit}</p>
                </div>
                <div class="card pronostic">
                    <h4>${forecast4.date}</h4>
                    <p>Max. ${forecast4.maxTemp}${unit}</p>
                    <p>Min. ${forecast4.minTemp}${unit}</p>
                </div>
            </div>
            </section>`
        } catch (error) {
            console.error(error);
        }

    }
}

customElements.define('city-date', CityDate);
customElements.define('current-weather-temperature', CurrentWeatherTemperature);
customElements.define('current-weather-data', CurrentWeatherData);
customElements.define('chart-today-temperature', ChartTodayTemperature);
customElements.define('weather-fun-facts', WeatherFunFacts);
customElements.define('forecast-four-days', FourDaysPronostic);

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
