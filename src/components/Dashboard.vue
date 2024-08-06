<script setup>
import { ref } from "vue";
import Grades from "./Grades.vue";
import GithubContributions from "./GithubContributions.vue";
import RocketLeague from "./RocketLeague.vue";
import Weather from "./Weather.vue";
import Calendar from "./Calendar.vue";
import Youtube from "./Youtube.vue";
import Articles from "./Articles.vue";
import CheatSheets from "./CheatSheets.vue";

const access_token = ref("");
</script>

<template>
  <div
    class="m-2 grid h-full grid-cols-10 grid-rows-8 gap-2 rounded-xl text-indigo-300"
  >
    <Calendar class="col-span-3 row-span-5" />
    <Grades class="col-span-3 row-span-2" />
    <Youtube
      class="col-span-4 row-span-3"
      v-if="access_token !== ''"
      :access_token="access_token"
    />
    <Youtube class="col-span-4 row-span-3" v-else access_token="" />
    <RocketLeague class="col-span-3 row-span-3" />
    <Weather class="col-span-2 row-span-2" />
    <Articles class="col-span-2 row-span-4" />
    <GithubContributions class="col-span-4 row-span-2" />
    <CheatSheets class="col-span-4 row-span-2" />
  </div>
</template>
