<script setup>
import { ref, onMounted } from "vue";

const weather_api_key = import.meta.env.VITE_WEATHER_API_KEY;

const weather_infos = ref({
  location: "",
  temperature: "",
  condition: "",
  icon: "",
});

onMounted(async () => {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${weather_api_key}&q=Paris&aqi=no`,
  );
  const weather = await response.json();

  weather_infos.value = {
    location: weather.location.name,
    temperature: weather.current.temp_c,
    condition: weather.current.condition.text,
    icon: weather.current.condition.icon,
    wind_speed: weather.current.wind_kph,
  };
});
</script>

<template>
  <div class="h-full rounded-xl bg-indigo-900 p-3 felx-flex-col">
    <p>Weather</p>
    <div class="flex-grow flex flex-col items-start justify-center">
      <p class="text-3xl text-indigo-50">{{ weather_infos.location }}</p>
      <div class="flex justify-center w-full">
        <div class="relative flex items-center justify-start">
          <div class="flex flex-row items-center justify-center">
            <p class="text-2xl text-indigo-100">
              {{ weather_infos.temperature }}°C
            </p>
            <img :src="weather_infos.icon" alt="Weather icon" />
          </div>
          <p class="absolute top-12 text-indigo-200">
            {{ weather_infos.wind_speed }} km/h
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
