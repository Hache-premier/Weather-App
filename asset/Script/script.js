const weatherIcon = document.getElementById("weather-icon");

const cityInput = document.getElementById("city-input");

const searchButton = document.getElementById("search-btn");

const cityName = document.getElementById("city-name");

const temperature = document.getElementById("temperature");

const weatherDescription = document.getElementById("weather-description");

const humidity = document.getElementById("humidity");

const windSpeed = document.getElementById("wind-speed");

searchButton.addEventListener("click", function () {
  const city = cityInput.value.trim();

  if (city === "") {
    return;
  }

  cityName.textContent = city;

  getCityCoordinates(city);
});

function getWeatherDescription(weatherCode) {
  if (weatherCode === 0) {
    return "Clear sky";
  } else if (weatherCode === 1 || weatherCode === 2) {
    return "Partly cloudy";
  } else if (weatherCode === 3) {
    return "Overcast";
  } else if (weatherCode === 45 || weatherCode === 48) {
    return "Foggy";
  } else if (weatherCode >= 51 && weatherCode <= 57) {
    return "Drizzle";
  } else if (weatherCode >= 61 && weatherCode <= 67) {
    return "Rain";
  } else if (weatherCode >= 71 && weatherCode <= 77) {
    return "Snow";
  } else if (weatherCode >= 80 && weatherCode <= 82) {
    return "Rain showers";
  } else if (weatherCode >= 85 && weatherCode <= 86) {
    return "Snow showers";
  } else if (weatherCode >= 95 && weatherCode <= 99) {
    return "Thunderstorm";
  } else {
    return "Unknown weather";
  }
}

function setWeatherBackground(weatherCode) {
  document.body.className = "";

  if (weatherCode === 0) {
    document.body.classList.add("clear");
  } else if (weatherCode === 1 || weatherCode === 2) {
    document.body.classList.add("partly-cloudy");
  } else if (weatherCode === 3) {
    document.body.classList.add("overcast");
  } else if (weatherCode === 45 || weatherCode === 48) {
    document.body.classList.add("fog");
  } else if (weatherCode >= 51 && weatherCode <= 82) {
    document.body.classList.add("rain");
  } else if (weatherCode >= 95 && weatherCode <= 99) {
    document.body.classList.add("thunderstorm");
  }
}

function getWeatherIcon(weatherCode) {
  if (weatherCode === 0) {
    return "☀️";
  } else if (weatherCode === 1 || weatherCode === 2) {
    return "🌤️";
  } else if (weatherCode === 3) {
    return "☁️";
  } else if (weatherCode === 45 || weatherCode === 48) {
    return "🌫️";
  } else if (weatherCode >= 51 && weatherCode <= 57) {
    return "🌦️";
  } else if (weatherCode >= 61 && weatherCode <= 67) {
    return "🌧️";
  } else if (weatherCode >= 71 && weatherCode <= 77) {
    return "❄️";
  } else if (weatherCode >= 80 && weatherCode <= 82) {
    return "🌦️";
  } else if (weatherCode >= 85 && weatherCode <= 86) {
    return "🌨️";
  } else if (weatherCode >= 95 && weatherCode <= 99) {
    return "⛈️";
  } else {
    return "🌍";
  }
}

async function getCityCoordinates(city) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`,
  );

  const data = await response.json();

  if (!data.results) {
    weatherDescription.textContent = "City not found";
    return;
  }

  const latitude = data.results[0].latitude;
  const longitude = data.results[0].longitude;

  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`,
  );

  const weatherData = await weatherResponse.json();

  const currentWeather = weatherData.current;

  temperature.textContent = `${currentWeather.temperature_2m}°C`;

  humidity.textContent = `${currentWeather.relative_humidity_2m}%`;

  windSpeed.textContent = `${currentWeather.wind_speed_10m} km/h`;

  const description = getWeatherDescription(currentWeather.weather_code);

  weatherDescription.textContent = description;

  weatherIcon.textContent = getWeatherIcon(currentWeather.weather_code);

  setWeatherBackground(currentWeather.weather_code);
}
