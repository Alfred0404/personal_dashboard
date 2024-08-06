<script setup>
const github_username = "Alfred0404";
</script>

<template>
  <div class="flex h-full w-full flex-col rounded-xl bg-indigo-900 p-3">
    <p>Github Contributions</p>
    <div class="flex h-full flex-grow flex-col items-center justify-end">
      <iframe
        class="w-full"
        :src="`https://jandee.vercel.app/${github_username}?redias=3&margin=2&footer=true&weeks=false&scheme=dark`"
        frameborder="0"
      ></iframe>
    </div>
  </div>
</template>
