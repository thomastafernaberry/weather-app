import { getData } from './weather.js'
import { appLanguage } from './languages.js';

document.addEventListener('DOMContentLoaded', async function () {
  const $CHART = document.getElementById('chart');
  const data = await getData();

  const $25hoursIn24HoursFormat = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'];

  new Chart($CHART, {
    type: 'line',
    data: {
      labels: $25hoursIn24HoursFormat,
      datasets: [{
        label: appLanguage.temperature,
        data: data.hourly.temperature_2m.slice(0, 25) + data.hourly_units.temperature_2m,
        borderWidth: 2
      }]
    },
    options: {
      aspectRatio: 2,
      onHover: {},
      interaction: {
        axis: 'x'
      },
      elements: {
        point: {
          radius: 3,
          hoverRadius: 6,
          backgroundColor: 'rgba(255, 193, 7, 1)'
        },
        line: {
          borderColor: 'rgba(121, 82, 179, 1)'
        }
      },
      plugins: {
        tooltip: {
          intersect: false
        }
      }
    }
  });
});
