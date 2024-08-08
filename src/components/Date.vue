<script setup>
import { ref } from 'vue';

const current_date = new Date();
const date = current_date.toDateString();

const time = ref(current_date.toLocaleTimeString());

setInterval(() => {
  const current_date = new Date();
  time.value = current_date.toLocaleTimeString();
}, 1000);

</script>

<template>
  <div class="flex flex-row items-center gap-2 p-3 text-indigo-50">
    <p class="text-2xl w-fit">{{ date }}</p>
    <p class="text-md text-indigo-300">{{ time }}</p>
  </div>
</template>
