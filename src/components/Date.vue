<script setup>
const current_date = new Date();
const date = current_date.toDateString();
</script>

<template>
  <div class="flex flex-col items-start justify-center p-3 text-indigo-50">
    <p class="text-2xl">{{ date }}</p>
  </div>
</template>
