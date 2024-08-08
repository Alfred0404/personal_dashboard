<script setup>
import { ref } from "vue";
import Grades from "./Grades.vue";
import GithubContributions from "./GithubContributions.vue";
import RocketLeague from "./RocketLeague.vue";
import Weather from "./Weather.vue";
import Calendar from "./Calendar.vue";
import Youtube from "./Youtube.vue";
import Spotify from "./Spotify.vue";
import Pomodoro from "./Pomodoro.vue";
</script>

<template>
  <div
    class="m-2 grid h-full auto-rows-auto grid-cols-10 grid-rows-none gap-2 rounded-xl text-indigo-300"
  >
    <Calendar class="col-span-3 row-span-5" />
    <Grades class="col-span-3 row-span-5" />
    <Youtube class="col-span-4 row-span-3" />
    <Weather class="col-span-2 row-span-2" />
    <Spotify class="col-span-2 row-span-4" />
    <GithubContributions class="col-span-4 row-span-2" />
    <Pomodoro class="col-span-2 row-span-2" />
    <RocketLeague class="col-span-2 row-span-2" />
  </div>
</template>
