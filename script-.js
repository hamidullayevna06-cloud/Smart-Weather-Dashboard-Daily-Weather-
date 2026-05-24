const cityInput = document.getElementById("cityInput");
const weatherDiv = document.getElementById("weather");

document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (cityInput.value) {
    getWeather();
  }
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && cityInput.value) {
    getWeather();
  }
});

function getWeatherEmoji(condition) {
  const normalized = String(condition || "").toLowerCase();
  if (normalized.includes("clear")) return "☀️";
  if (normalized.includes("cloud")) return "☁️";
  if (normalized.includes("rain")) return "🌧️";
  if (normalized.includes("snow")) return "❄️";
  if (normalized.includes("storm")) return "⛈️";
  return "🌤️";
}

const sweetMessages = [
  "Today is a good day to say hi to your friend 💛",
  "Even if it's cloudy, keep your mood sunny ☀️",
  "Drinking some water and take a deep breath 🌿",
  "Somewhere, something good is waiting for you ✨",
];

function getSweetMessage() {
  return sweetMessages[Math.floor(Math.random() * sweetMessages.length)];
}

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  const apiURL = `http://localhost/weather_app/my-api.php?city=${encodeURIComponent(city)}`;
  const cacheWhen = Number(localStorage.getItem("when"));
  const cacheValid = cacheWhen + 10000 > Date.now();

  if (cacheValid) {
    const temp = Number(localStorage.getItem("temperature"));
    const weatherCondition = localStorage.getItem("description") || "";
    const savedCity = localStorage.getItem("city") || city;
    const emoji = getWeatherEmoji(weatherCondition);
    const message = getSweetMessage();

    weatherDiv.style.padding = "60px";
    weatherDiv.style.marginTop = "20px";
    weatherDiv.innerHTML = `
        <h2>${savedCity}</h2>
        <p>${temp} °C</p>
        <p>${emoji} ${weatherCondition}</p>
        <p class="sweet">${message}</p>
      `;
  } else {
    try {
      const response = await fetch(apiURL);
      const data = await response.json();

      if (data && data.city) {
        const temp = Math.round(data.weather_temperature);
        const weatherCondition = data.weather_description;
        const emoji = getWeatherEmoji(weatherCondition);
        const message = getSweetMessage();

        weatherDiv.style.padding = "60px";
        weatherDiv.style.marginTop = "20px";
        weatherDiv.innerHTML = `
        <h2>${data.city}</h2>
        <p>${temp} °C</p>
        <p>${emoji} ${weatherCondition}</p>
        <p class="sweet">${message}</p>
      `;

        getWeeklyForecast(city);

        localStorage.setItem("temperature", String(temp));
        localStorage.setItem("description", weatherCondition);
        localStorage.setItem("city", data.city);
        localStorage.setItem("when", String(Date.now()));
      } else {
        weatherDiv.innerHTML = "City not found. Try again.";
      }
    } catch (error) {
      console.error(error);

      const temp = localStorage.getItem("temperature");
      const weatherCondition = localStorage.getItem("description");
      const savedCity = localStorage.getItem("city");

      if (temp && weatherCondition) {
        const emoji = getWeatherEmoji(weatherCondition);

        weatherDiv.style.padding = "60px";
        weatherDiv.style.marginTop = "20px";

        weatherDiv.innerHTML = `
      <h2>${savedCity}</h2>
      <p>${temp} °C</p>
      <p>${emoji} ${weatherCondition}</p>
      <p>⚠️ Showing cached data (offline)</p>
    `;
      } else {
        weatherDiv.innerHTML = "No data available offline 😭";
      }
    }
  }
}

async function getWeeklyForecast(city) {
  const API_KEY = "1e3e8f230b6064d27976e41163a82b77";
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,
    );

    const data = await response.json();

    if (data.cod === "200") {
      displayWeek(data);
    }
  } catch (error) {
    console.error("Couldn't fetch weekly forecast", error);
  }
}

function displayWeek(data) {
  const weekBox = document.getElementById("weekForecast");
  weekBox.innerHTML = "";

  for (let i = 0; i < data.list.length; i += 8) {
    const day = data.list[i];
    const temp = Math.round(day.main.temp);
    const condition = day.weather[0].description;
    const emoji = getWeatherEmoji(condition);
    const date = new Date(day.dt_txt).toLocaleDateString("en-US", {
      weekday: "short",
    });

    weekBox.innerHTML += `
      <div class="day">
        <p>${date}</p>
        <p>${emoji}</p>
        <p>${temp}°C</p>
      </div>
    `;
  }
}
localStorage.clear();
