import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.scss";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [location, setLocation] = useState("Toronto");
  const [weatherData, setWeatherData] = useState(null);

  const getWeatherData = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/current.json?key=${API_KEY}&q=${location}`
      );
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    getWeatherData();
  }, []);

  const getTempBackgroundColor = (temp) => {
    if (temp <= 10) return "#A8D0E6";
    if (temp > 10 && temp <= 19) return "#f1d0a3";
    if (temp > 19 && temp <= 29) return "#FF8C66";
    return "#FF6B6B";
  };

  const getWeatherEmoji = (text) => {
    const condition = text.toLowerCase();
    if (condition.includes("sun")) return "🌞";
    if (condition.includes("rain")) return "🌧";
    if (condition.includes("cloud")) return "⛅️";
    if (condition.includes("snow")) return "❄️";
    return "🌡";
  };

  function handleOnSubmit(e) {
    e.preventDefault();
    getWeatherData();
  }

  function handleInputChange(e) {
    setLocation(e.target.value);
  }

  return (
    <>
      <header className="header">
        <h1 className="header__logo">MY WEATHER APP</h1>
        <form className="header__form" onSubmit={handleOnSubmit}>
          <input
            className="header__input"
            onChange={handleInputChange}
            type="text"
            placeholder="Type your city"
            value={location}
          />
          <button className="header__button">SUBMIT</button>
        </form>
      </header>
      <main className="main">
        {!weatherData ? (
          <div>Loading...</div>
        ) : (
          <>
            <section className="info">
              <h3 className="info__location">
                {weatherData.location.name}, {weatherData.location.region}
              </h3>
              <p className="info__updated">
                Last updated: {weatherData.current.last_updated}
              </p>
            </section>
            <section
              className="temp"
              style={{
                backgroundColor: getTempBackgroundColor(
                  weatherData.current.temp_c
                ),
              }}
            >
              <img
                className="temp__icon"
                src={weatherData.current.condition.icon}
                alt={weatherData.current.condition.text}
              />
              <h2 className="temp__temp">{weatherData.current.temp_c}°C</h2>
              <p className="temp__text">
                {getWeatherEmoji(weatherData.current.condition.text)}
                {" "}
                {weatherData.current.condition.text}
              </p>
            </section>
            <section className="extra">
              <ul className="extra__list">
                <li className="extra__item">
                  <h4 className="extra__title">Feels Like</h4>
                  <p className="extra__text">
                    {weatherData.current.feelslike_c}°C
                  </p>
                </li>
                <li className="extra__item">
                  <h4 className="extra__title">Humidity</h4>
                  <p className="extra__text">{weatherData.current.humidity}%</p>
                </li>
                <li className="extra__item">
                  <h4 className="extra__title">Wind</h4>
                  <p className="extra__text">
                    {weatherData.current.wind_kph} kph
                  </p>
                </li>
                <li className="extra__item">
                  <h4 className="extra__title">UV</h4>
                  <p className="extra__text">{weatherData.current.uv}</p>
                </li>
              </ul>
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default App;
