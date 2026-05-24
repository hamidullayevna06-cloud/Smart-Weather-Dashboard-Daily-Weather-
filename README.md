# Weather-Dashboard
🌦️ Smart Weather Dashboard (Daily Weather)

A full-stack weather app that shows real-time weather data for different cities. It uses an external weather API and caching to improve performance and reduce API requests.

⚙️ Tech Stack

HTML, CSS, JavaScript, PHP, MySQL, OpenWeather API, localStorage

🚀 Features
Search weather by city
Real-time weather data
API integration (OpenWeather)
Browser caching (localStorage)
Server caching (MySQL)
Faster loading with reduced API calls
🧠 How It Works
Checks browser cache first (localStorage)
If needed, requests backend (PHP)
Backend checks MySQL cache
If outdated → fetches fresh API data
Stores updated data back in database

