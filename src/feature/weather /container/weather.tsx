import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie';
import loadingAnimation from '../json/loadingAnimation.json';



interface WeatherData {
  weather: any;
  main: {
    pressure: number;
    temp: number;
    humidity: number;
  };
  dt_txt: string;
  name: string;
  wind: {
    speed: number
  }
}

const WeatherApp: React.FC = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);






  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_OPEN_WEATHER_MAP_APP_ID}&units=metric`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.log(error);
      setWeatherData(null);
    }
    setLoading(false);
  };

  const fetchWeatherDataByLocation = async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_OPEN_WEATHER_MAP_APP_ID}&units=metric`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.log(error);
      setWeatherData(null);
    }
    setLoading(false);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherDataByLocation(latitude, longitude);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };




  const loadingAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="weather-container">
      <h1>Weather App</h1>
      <div className="input-container">
        <input
          type="text"
          className="input"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="button"
          onClick={fetchWeatherData}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
        <button className="button" onClick={handleGetCurrentLocation} disabled={loading}>
          Get Current Location
        </button>
      </div>
      {loading ? (
        <div className="loading-animation">
          <Lottie options={loadingAnimationOptions} height={200} width={200} />
        </div>
      ) : (
        weatherData && (
          <div className="weather-card">
            <h2>{weatherData.name}</h2>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Description: {weatherData.weather[0].description}</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Pressure: {weatherData.main.pressure}mpbr</p>
            <p>Wind Speed: {weatherData.wind.speed}km/h</p>
          </div>
        )
      )}
    </div>
  );

};

export default WeatherApp;
