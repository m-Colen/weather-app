const openWeatherApiKey = config.OPEN_WEATHER_API_KEY;
const geoapifyApiKey = config.GEOAPIFY_API_KEY;
const cityInput = document.querySelector("#city-search");
const tempUnit = document.querySelector(".weather-temp-unit");

// Keyup event listener to run autocomplete and openWeather API's
cityInput.addEventListener("keyup", (e) => {
  autocomplete();
  getWeather(e.target.value);
});

/***
Autocomplete API 
***/

// GET request using async/await for autocomplete API
const autocomplete = async () => {
  const query = cityInput.value;
  const fullUrl = `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=${geoapifyApiKey}`;
  try {
    const response = await fetch(fullUrl);
    if (response.ok) {
      const jsonResponse = await response.json();
      renderAutocomplete(jsonResponse.features);
    } else {
      throw new Error("Request failed");
    }
  } catch (err) {
    console.error(err);
  }
};

// Renders autocomplete search results on page
const renderAutocomplete = (arr) => {
  clearAutocomplete();
  // Creates new ul for search results
  const searchResults = document.createElement("ul");
  arr.forEach((city) => {
    // Filters out the undefined results
    if (city.properties.name || city.properties.city) {
      // Creates new search result item
      const cityResult = document.createElement("li");
      // Sets up the search result variables
      const cityName = city.properties.name || city.properties.city;
      const stateName = city.properties.state;
      const countryName = city.properties.country;
      cityResult.innerHTML = `${cityName}, ${stateName}, ${countryName}`;
      searchResults.appendChild(cityResult);
    }
  });
  document.querySelector(".search-results").appendChild(searchResults);
};

// Clears previous autocomplete search results
const clearAutocomplete = () => {
  document.querySelector(".search-results").innerHTML = "";
};

/***
openWeather API 
***/

// GET request using async/await to pull weather data for openWeather API
const getWeather = async () => {
  const cityName = cityInput.value;
  const fullUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${openWeatherApiKey}&units=imperial`;
  try {
    const response = await fetch(fullUrl);
    if (response.ok) {
      const jsonResponse = await response.json();
      renderWeather(jsonResponse);
    } else {
      throw new Error("Request failed");
    }
  } catch (err) {
    console.error(err);
  }
};

// Render weather data on page
const renderWeather = (obj) => {
  const weatherLoc = document.querySelector(".weather-location");
  weatherLoc.innerHTML = `${obj.name}, ${obj.sys.country}`;
  const weatherTemp = document.querySelector(".weather-temp");
  weatherTemp.innerHTML = `${obj.main.temp.toFixed(0)}`;
  const weatherConditions = document.querySelector(".weather-conditions");
  weatherConditions.innerHTML = obj.weather[0].description;
  const weatherIcon = document.querySelector(".weather-icon");
  weatherIcon.src = `http://openweathermap.org/img/w/${obj.weather[0].icon}.png`;
  tempUnit.innerHTML = "F";
};
