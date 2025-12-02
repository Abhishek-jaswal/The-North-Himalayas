"use client";
import { useEffect, useState } from "react";

export default function WeatherBox({ place }: { place: string }) {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        // Convert place → coordinates using Open-Meteo geocoding
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${place}&count=1`
        );
        const geoData = await geoRes.json();

        if (!geoData?.results?.length) return;

        const { latitude, longitude } = geoData.results[0];

        // Fetch real-time weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        const weatherData = await weatherRes.json();
        setWeather(weatherData.current_weather);
      } catch (error) {
        console.log(error);
      }
    }

    fetchWeather();
  }, [place]);


  if (!weather) return null;

  return (
    <div className="absolute top-22 right-6 bg-white/10 backdrop-blur-xl text-white px-5 py-3 rounded-2xl border border-white/20 shadow-lg flex flex-col items-end w-[150px] z-10">

      <p className="text-sm font-semibold">{place}</p>

      <p className="text-3xl font-bold leading-tight">
        {weather.temperature}°C 
      </p>

      <p className="text-xs text-gray-300">
        {weather.windspeed} km/h wind
      </p>
    </div>
  );
}
