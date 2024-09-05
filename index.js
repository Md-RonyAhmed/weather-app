// select elements
const elements = {
  weatherIcon: document.getElementById("weather-icon"),
  formData: document.getElementById("form-data"),
  loadingElement: document.getElementById("loading"),
};

const API_KEY = "de4d138a43e1475e8dd121037d9b6fd9";
const URL = "https://api.openweathermap.org/data/2.5/weather";

const updateElement = (id, content, isHtml = false) => {
  const element = document.getElementById(id);
  if (!element) {
    return;
  } else if (isHtml) {
    element.innerHTML = content;
  } else {
    element.innerText = content;
  }
};

const toggleLoader = (show) => {
  if (show) {
    elements.loadingElement.classList.remove("hidden");
    elements.loadingElement.classList.add("flex");
  } else {
    elements.loadingElement.classList.add("hidden");
    elements.loadingElement.classList.remove("flex");
  }
};
// Icon Mapping
const weatherIcons = {
  Haze: "/assets/haze.svg",
  Fog: "/assets/haze.svg",
  Mist: "/assets/haze.svg",
  Clouds: "/assets/cloud.svg",
  Clear: "/assets/sun.svg",
  Rain: "/assets/rainy.svg",
  Thunderstorm: "/assets/thunder.svg",
  Snow: "/assets/icons/snow.svg",
  Drizzle: "/assets/drizzle-svgrepo-com.svg",
};

// Backgrounds Mapping
const weatherBackgrounds = {
  Haze: "/assets/backgrounds/mist.jpeg",
  Fog: "/assets/backgrounds/mist.jpeg",
  Mist: "/assets/backgrounds/mist.jpeg",
  Clouds: "/assets/backgrounds/clouds.png",
  Clear: "/assets/backgrounds/sunny.jpg",
  Rain: "/assets/backgrounds/rainy-day.jpg",
  Thunderstorm: "/assets/backgrounds/thunderstorm.jpg",
  Snow: "/assets/backgrounds/snow.jpg",
  Drizzle: "/assets/backgrounds/shower-rain.jpg",
};

const getWeather = async (info) => {
  const { lat, long, city } = info || {};
  toggleLoader(true);
  try {
    const fetchURL = city
      ? `${URL}?q=${city}&appid=${API_KEY}&units=metric`
      : `${URL}?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`;

    const data = await fetchData(fetchURL);
    updateWeatherUI(data);
  } catch (error) {
    console.log("Error fetching weather data: " + error.message);
  } finally {
    toggleLoader(false);
  }
};

const fetchData = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fetching weather data failed");
  const data = res.json();
  return await data;
};

const updateWeatherUI = (data) => {
  // Updating the weather UI using the dynamic function
  updateElement("city-name", data?.name === "Sāmāir" ? "Dhaka" : data?.name);
  updateElement("temp", `${Math.round(data?.main?.temp)}°c`);
  updateElement("title", formatWeatherTitle(data?.weather[0]?.main), true); // using true for isHtml
  updateElement("max-temp", `${Math.round(data?.main?.temp_max)}°c`);
  updateElement("min-temp", `${Math.round(data?.main?.temp_min)}°c`);
  updateElement("humidity", `${data?.main?.humidity}%`);
  updateElement("clouds", `${data?.clouds?.all}%`);
  updateElement("wind", `${data?.wind?.speed} m/s`);

  // Set the src attribute of the weather-icon element
  elements.weatherIcon.src =
    weatherIcons[data?.weather[0]?.main] || "/assets/cloud.svg";

  // Set the background image based on the weather condition
  const weatherCondition = data?.weather[0]?.main;
  document.body.style.backgroundImage = `url('${
    weatherBackgrounds[weatherCondition] || "/assets/backgrounds/clear-sky.jpg"
  }')`;
};

// Format Weather Title
const formatWeatherTitle = (weatherCondition) => {
  return `<p>The climate is <u class="text-orange-500">${weatherCondition}</u></p>`;
};

elements.formData.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = e.target["search-input"].value.trim();
  if (city) {
    getWeather({ city });
    e.target["search-input"].value = "";
  }
});

navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;
  getWeather({ lat: latitude, long: longitude });
});
