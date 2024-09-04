// select elements
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temp");
const weatherIcon = document.getElementById("weather-icon");
const weatherBackground = document.body;
const maxTemperature = document.getElementById("max-temp");
const formData = document.getElementById("form-data");

const API_KEY = "de4d138a43e1475e8dd121037d9b6fd9";
const URL = "https://api.openweathermap.org/data/2.5/weather";

const getWeatherByLocation = async (lat, long) => {
  const res = await fetch(
    `${URL}?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`
  );
  const data = await res.json();
  console.log(data);
  cityName.innerText = data?.name === "Sāmāir" ? "Badda" : data?.name;
  temperature.innerText = `${Math.round(data?.main?.temp)}°C`;

  switch (data?.weather[0]?.main) {
    case "Haze":
      weatherIcon.src = "/assets/haze.svg";
      weatherBackground.style.backgroundImage = `url('/assets/backgrounds/mist.jpeg')`;
      break;
    case "Drizzle":
      weatherIcon.src = "/assets/drizzle-svgrepo-com.svg";
      break;
    case "Rain":
      weatherIcon.src = "/assets/rainy.svg";
      break;
    case "Snow":
      weatherIcon.src = "/assets/icons/snow.svg";
      break;
    case "Thunderstorm":
      weatherIcon.src = "/assets/thunder.svg";
      break;
    case "Clear":
      weatherIcon.src = "/assets/sun.svg";
      break;
    case "Clouds":
      weatherIcon.src = "/assets/cloudy.svg";
      break;
    default:
      weatherIcon.src = "/assets/sun.svg";
  }

  maxTemperature.innerText = `${Math.round(data?.main?.temp_max)}°C`;
};

const getWeatherByCityName = async (city) => {
  const res = await fetch(`${URL}?q=${city}&appid=${API_KEY}&units=metric`);
  const data = await res.json();
//   console.log(data);
   cityName.innerText = data?.name;
   temperature.innerText = `${Math.round(data?.main?.temp)}°C`;
};

formData.addEventListener("submit",(e)=>{
    e.preventDefault();
    const city = e.target["search-input"].value.trim();
    if(city){
        getWeatherByCityName(city);
        e.target["search-input"].value = "";
    }
})

navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;
  getWeatherByLocation(latitude, longitude);
});
