<script setup>
// checker comment fonctionne l'o-auth2 de google avec js
// requete api ytb pour récupérer les videos de la playlist avec cet id=PL3IJ5ThU80xhATA03YMrofFH9p-bmGF6M
// recupérer l'id de la première vidéo de la playlist
// requete avec l'id de la première vidéo pour récupérer les informations de la vidéo
// afficher la vidéo dans le composant
</script>

<template>
  <div class="flex h-full w-full flex-col rounded-xl bg-indigo-900 p-3">
    <p>Youtube</p>
    <iframe
      class="h-full w-full flex-grow rounded-lg"
      width="560"
      height="315"
      src="https://www.youtube.com/embed/MXRTGJnwGds?si=8unvuTbYF-sI2WWv&amp;controls=0"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
  </div>
</template>
