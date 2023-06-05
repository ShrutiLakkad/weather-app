import React from 'react';
import WeatherApp from './feature/weather/container/weather';
import { Toaster } from 'react-hot-toast';
import 'animate.css';
import '../src/assets/style/weather.scss';

function App() {
  return (
    <div className="App">
      <WeatherApp />
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />

    </div>
  );
}

export default App;
