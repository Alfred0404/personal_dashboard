<script setup>
const google_calendar_link = import.meta.env.VITE_GOOGLE_CALDENDAR_LINK;

</script>

<template>
  <div class="rounded-xl bg-indigo-900 p-3 h-full w-full flex flex-col">
    <p>Calendar</p>

    <iframe
    class="rounded-lg w-full h-full flex-grow"
      :src="google_calendar_link"
      width="300"
      height="300"
      frameborder="0"
      scrolling="no"
    ></iframe>
  </div>
</template>
