const apiKey = "5630d31f5a2ef6f66c549e656480ee04";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city !== "") {
        getWeather(city);
        getForecast(city);
    }
});

locationBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            getWeatherByLocation(lat, lon);
        },
        () => {
            alert("Unable to get your location.");
        }
    );
});

async function getWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        displayWeather(data);
    } catch (error) {
        alert(error.message);
    }
}

async function getWeatherByLocation(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        displayWeather(data);

        getForecast(data.name);

    } catch (error) {
        alert("Error fetching weather data");
    }
}

function displayWeather(data) {

    document.getElementById("city").textContent = data.name;

    document.getElementById("temperature").textContent =
        `${Math.round(data.main.temp)}°C`;

    document.getElementById("description").textContent =
        data.weather[0].description;

    document.getElementById("humidity").textContent =
        `${data.main.humidity}%`;

    document.getElementById("wind").textContent =
        `${data.wind.speed} km/h`;

    document.getElementById("pressure").textContent =
        `${data.main.pressure} hPa`;

    const iconCode = data.weather[0].icon;

    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

async function getForecast(city) {

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        displayForecast(data);

    } catch (error) {

        console.log(error);

    }
}

function displayForecast(data) {

    const forecastContainer =
        document.getElementById("forecastContainer");

    forecastContainer.innerHTML = "";

    const forecastList = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    forecastList.slice(0, 5).forEach(day => {

        const date = new Date(day.dt_txt);

        const card = document.createElement("div");

        card.classList.add("forecast-card");

        card.innerHTML = `
            <h3>${date.toLocaleDateString()}</h3>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
            <p>${Math.round(day.main.temp)}°C</p>
            <p>${day.weather[0].main}</p>
        `;

        forecastContainer.appendChild(card);
    });
}