<script setup>
const spotify_playlist_link = import.meta.env.VITE_SPOTIFY_PLAYLIST_LINK;
</script>

<template>
  <div class="flex flex-col rounded-xl bg-indigo-900 p-3">
    <p>Spotify</p>
    <div class="flex w-full flex-grow flex-col items-center justify-end">
      <iframe
        class="rounded-lg"
        :src="spotify_playlist_link"
        width="100%"
        height="352"
        frameBorder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  </div>
</template>
