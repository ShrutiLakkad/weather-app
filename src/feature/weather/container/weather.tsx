import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie';
import toast from 'react-hot-toast';
import moment from 'moment-timezone';
import loadingAnimation from '../json/loadingAnimation.json';
import { WeatherStatsGraph } from '../component/weatherChart';
import clearWeather from '../json/clearWeather.json';
import Clouds from '../json/Clouud.json';
import haze from '../json/haze.json';
import smoky from '../json/smoky.json';
import cityAnimation from '../json/city.json';
import thunderstorm from '../json/thunderstorm.json';
import { Arrow, Location, Sunrise, Sunset, WindSpeed } from 'shared/component/icons/icon';
import clouds from 'assets/images/giphy.gif';
import smoke from 'assets/images/smoke.gif';
import fewClouds from 'assets/images/few clouds.gif';
import hazeImage from 'assets/images/haze.gif';
import thunderstormImage from 'assets/images/thunderstorm.gif';

export interface IWeatherData {
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
  weatherStats: any;
  sys:{
    sunrise: number;
    sunset: number;
  }
}

interface IWeatherMapper {
  [key: string]: any;
}

const weatherBgMapper: IWeatherMapper = {
  Clear: fewClouds,
  Clouds: clouds,
  Smoke: smoke,
  Haze: hazeImage,
  Thunderstorm: thunderstormImage
};

const weatherMapper: IWeatherMapper = {
  Clear: clearWeather,
  Clouds,
  Smoke: smoky,
  Haze: haze,
  Thunderstorm: thunderstorm
};

const WeatherApp: React.FC = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<IWeatherData | null>(null);
  const [forecastWeatherData, setForecastWeatherData] = useState<any>([])
  const [loading, setLoading] = useState(true);
  const [initial, setInitial] = useState(true);
  const [foreCastKey, setForeCastKey] = useState(0);
  const [currentTime, setCurrentTime] = useState(moment().format('dddd, MMMM Do YYYY, h:mm:ss a'));

  useEffect(() => {
    setTimeout(() => {
      handleGetCurrentLocation()
    }, 2000);
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().format('dddd, MMMM Do YYYY, h:mm:ss a'));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);


  const fetchWeatherData = async (currentCity = city, fetchForeCast = false) => {

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${process.env.REACT_APP_OPEN_WEATHER_MAP_APP_ID}&units=metric`
      );
      const { lat, lon } = response.data.coord
      setWeatherData(response.data);
      setInitial(false)
      if (fetchForeCast) {
        fetchWeatherDataByLocation(lat, lon)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setWeatherData(null);
    }
    setLoading(false);
  };

  const fetchWeatherDataByLocation = async (lat = 0, lon = 0, fetchWeather = false) => {
    const params: any = {
      units: 'metric',
      appid: process.env.REACT_APP_OPEN_WEATHER_MAP_APP_ID
    }
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon
    }
    setLoading(true);
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, { params });
      setForecastWeatherData(response.data.list);
      const currentCity = response.data.city.name;
      setForeCastKey(foreCastKey + 1)
      if (fetchWeather) {
        setCity(currentCity)
        fetchWeatherData(currentCity);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setForecastWeatherData([]);
    }
    setLoading(false);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherDataByLocation(latitude, longitude, true);
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
  };


  return (
    <>
      {initial && loading ? (
        <div className="loading-animation">
          <Lottie options={loadingAnimationOptions} height={500} width={500} />
        </div>
      ) : (
        <div className="weather-container animate__animated animate__fadeIn">
          <img src={weatherData ? weatherBgMapper[weatherData.weather[0].main] : clouds} className='bg-image' />
          <div className='weather-details'>
            <div className="input-container animate__animated animate__slideInLeft">
              <h1 className='weather-app'>Weather App</h1>
              <div className='location-input-box'>
                <div className='location-icon' onClick={handleGetCurrentLocation}>
                  <Location />
                </div>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter city name"
                  value={city}
                  onKeyDown={({ which }) => {
                    if (which === 13) {
                      fetchWeatherData(undefined, true)
                    }
                  }}
                  onChange={(e) => setCity(e.target.value)}
                />
                <div className='arrow-icon' onClick={() => fetchWeatherData(undefined, true)}>
                  <Arrow />
                </div>
              </div>
              <hr style={{ color: "white" }} />
              {weatherData &&
                <div className="weather-card animate__animated animate__fadeIn" key={foreCastKey}>
                  <div className='weather-card-inner'>
                    <div className='weather-sun'>
                    <p className='sunrise'><Sunrise/> { moment.unix(weatherData.sys.sunrise).format('LT')}</p>
                    <p className='sunset'><Sunset/> { moment.unix(weatherData.sys.sunset).format('LT')}</p>
                    </div>
                    <h1 className='weather-name'>{weatherData.name}</h1>
                    <p className='weather-temp'>{parseInt(weatherData.main.temp.toString())}°C</p>
                    <Lottie options={{
                      loop: true,
                      autoplay: true,
                      animationData: weatherMapper[weatherData.weather[0].main],
                    }} height={200} width={300} />
                    <div className='weather-wind'>
                      <WindSpeed />
                      <p>{weatherData.wind.speed}km/h</p>
                    </div>
                    <p className='weather-desc'>{weatherData.weather[0].description}</p>
                    <p className='weather-humidity'>Humidity: {weatherData.main.humidity}%</p>
                    <p className='weather-pressure'>Pressure: {weatherData.main.pressure}mpbr</p>
                  </div>
                </div>
              }
            </div>
            <div className='weather-graph animate__animated animate__slideInRight'>
              <div className='animate__animated animate__fadeIn'>
                {weatherData &&  (
            <div className='weather-date-day'>
                <p>{currentTime}</p>
                </div> 
                )}
                <Lottie
                  key={foreCastKey}
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: cityAnimation,
                  }} height={300} width={1200} />
              </div>
              {forecastWeatherData.length > 0 &&
                <WeatherStatsGraph key={foreCastKey} weatherStats={forecastWeatherData} />
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WeatherApp;
