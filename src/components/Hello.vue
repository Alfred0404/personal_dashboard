<script setup>
const props = defineProps(["name"]);
</script>

<template>
  <div class="flex justify-center p-3">
    <p class="text-indigo-300">
      <span class="ps-2 text-3xl text-indigo-50">
        {{ props.name }}
      </span>
    </p>
  </div>
</template>
