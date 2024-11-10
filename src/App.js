import React, { useState } from "react";

const API_URL = "https://api.open-meteo.com/v1/forecast";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setError(null);
    setWeather(null);

    try {
      const geocodeRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geocodeData = await geocodeRes.json();

      if (!geocodeData.results || geocodeData.results.length === 0) {
        setError("City not found.");
        return;
      }

      const { latitude, longitude } = geocodeData.results[0];

      const weatherRes = await fetch(
        `${API_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather(weatherData.current_weather);
    } catch (err) {
      setError("Failed to fetch weather data.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Weather Now</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={fetchWeather}
        >
          Search
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {weather && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Weather in {city}</h5>
            <p className="card-text">Temperature: {weather.temperature}°C</p>
            <p className="card-text">Wind Speed: {weather.windspeed} km/h</p>
            <p className="card-text">
              Condition: {weather.weathercode === 0 ? "Clear" : "Cloudy"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
