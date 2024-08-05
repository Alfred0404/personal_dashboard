<script setup>
const props = defineProps(["match"]);
</script>

<template>
  <div class="flex w-full flex-row items-start justify-between gap-10 pe-2">
    <p class="text-sm">{{ match.date.day }}</p>
    <div class="flex flex-row justify-between items-center w-2/3">
      <div class="flex flex-col">
        <p class="text-xl text-blue-300">{{ match.blue.name }}</p>
        <p class="text-xl text-orange-300">{{ match.orange.name }}</p>
      </div>
      <div class="flex flex-col">
        <p class="text-xl text-indigo-50">{{ match.blue.score }}</p>
        <p class="text-xl text-indigo-50">{{ match.orange.score }}</p>
      </div>
    </div>
  </div>
</template>
