import Weather from './weather.js';
import { appCurrentLanguage } from './language.js';

async function injectChart () {
  const $CHART = document.getElementById('chart');
  const weatherObj = await (new Weather).initAsync();
  const weatherJson = await weatherObj.getWeatherJsonAsync();
  const $25hoursIn24HoursFormat = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'];

  new Chart($CHART, {
    type: 'line',
    data: {
      labels: $25hoursIn24HoursFormat,
      datasets: [{
        label: `${appCurrentLanguage.temperature} in ${weatherJson.hourly_units.temperature_2m}`,
        data: weatherJson.hourly.temperature_2m.slice(0, 25),
        borderWidth: 1.5
      }]
    },
    options: {
      scales: {
        y: {
          grace: 2,
        }
      },
      tension: 0.4,
      interaction: {
        axis: 'x'
      },
      elements: {
        point: {
          radius: 2,
          hoverRadius: 7,
          backgroundColor: 'rgba(255, 193, 7, 1)',
          hitRadius: 500
        },
        line: {
          borderColor: 'rgba(121, 82, 179, 1)',
          backgroundColor: 'rgba(121, 82, 179, 1)',
        }
      },
      plugins: {
        tooltip: {
          intersect: false,
          events: ['mousemove', 'mouseout', 'touchstart', 'touchmove']
        }
      }
    }
  });
};

injectChart()
