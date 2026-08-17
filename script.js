let currentLat = 35.2828;
let currentLon = -120.6596;


const cityName = document.getElementById('city-name');
const dateTime = document.getElementById('date-time');
const currentTemp = document.getElementById('current-temp');
const conditionText = document.getElementById('condition-text');
const feelsLike = document.getElementById('feels-like');

const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const uvIndex = document.getElementById('uv-index');

const hourlyList = document.getElementById('hourly-list');
const dailyList = document.getElementById('daily-list');

const searchToggle = document.getElementById('search-toggle');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

const statusMessage = document.getElementById('status-message');


searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  setStatus('Searching...');

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      setStatus(`Couldn't find "${query}"`);
      return;
    }

    const place = geoData.results[0];
    currentLat = place.latitude;
    currentLon = place.longitude;
    cityName.textContent = place.name;
    getWeather(currentLat, currentLon);

    setStatus(null); // clear the status message

  } catch (err) {
    setStatus('Something went wrong — try again');
  }
});

//Fetch current conditions
 async function getWeather(lat, lon) {
    try {
   const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode,pressure_msl&timezone=auto&daily=uv_index_max`);
   const data = await res.json();
      currentTemp.textContent = Math.round(data.current.temperature_2m);
   humidity.textContent = `${data.current.relative_humidity_2m}%`;
windSpeed.textContent = `${Math.round(data.current.wind_speed_10m)}mph`;
pressure.textContent = `${Math.round(data.current.pressure_msl)}mb`;
conditionText.textContent = weatherCode[data.current.weathercode] || 'Unknown';
uvIndex.textContent = data.daily.uv_index_max[0];
const hourlyList = document.getElementById('hourly-list');
   hourlyList.innerHTML = '';
  for (let i = 0; i < data.hourly.time.length; i++) {
   const outDiv = document.createElement('div');
   outDiv.classList.add('hourly__item');
   const hourlyTime = document.createElement('span');
   hourlyTime.textContent = new Date(data.hourly.time[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
   outDiv.appendChild(hourlyTime);
   hourlyList.appendChild(outDiv);
      hourlyTime.classList.add('hourly__time');
      const hourlyIcon = document.createElement('span');
hourlyIcon.classList.add('hourly__icon');
hourlyIcon.textContent = "☀️";
outDiv.appendChild(hourlyIcon);
const hourlyTemp = document.createElement('span');
hourlyTemp.classList.add('hourly__temp');
hourlyTemp.textContent = `${Math.round(data.hourly.temperature_2m[i])}°`;
outDiv.appendChild(hourlyTemp);
  }
        console.log(data);
    } catch (err) {
      console.log(err);
    setStatus('Something went wrong - try again')
   }
 }
 getWeather(currentLat, currentLon);

// Weather object code
const weatherCode = {
0: 'Clear sky',
1: 'Mainly clear',
2: 'Partly cloudy',
3: 'Overcast',
45: 'Fog',
61: "Rain"
};


//  Toggle the search panel 
searchToggle.addEventListener('click', () => {
  const isHidden = searchForm.hasAttribute('hidden');
  if (isHidden) {
    searchForm.removeAttribute('hidden');
    searchInput.focus();
  } else {
    searchForm.setAttribute('hidden', '');
  }
  searchToggle.setAttribute('aria-expanded', String(isHidden));
});

// Handle search submit
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  // geocode `query` -> lat/lon -> getWeather(lat, lon)
});

// ---- Loading / error helper
function setStatus(message) {
  if (!message) {
    statusMessage.setAttribute('hidden', '');
    statusMessage.textContent = '';
    return;
  }
  statusMessage.textContent = message;
  statusMessage.removeAttribute('hidden');
}